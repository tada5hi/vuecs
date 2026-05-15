<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import {
    computed,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    useTemplateRef,
    watch,
} from 'vue';
import { isObject } from '@vuecs/core';
import { useColorPalette } from '@vuecs/design';
import type { PropCatalog, PropSpec, PropValues } from '../../../../demos/src/iframe-bridge';

interface Props {
    title?: string;
    /**
     * Name of the iframe-isolated demo. Loaded as
     * `<iframe src="/demos/<name>.html">`. The iframe announces its
     * variant / prop catalog via postMessage; the toolbar above the
     * preview renders the matching controls (select for enums, checkbox
     * for booleans, range+number for numbers, text input for strings).
     *
     * For passive showcases without controls, use `<Demo>` instead — it
     * drops the announce/postMessage round-trip entirely.
     */
    name: string;
    /**
     * Component name shown in iframe accessibility labels (e.g.
     * `VCPagination`). If omitted, derived from `name` by capitalising
     * and prefixing `VC`. Pass explicitly for multi-word kebab-case
     * names like `form-checkbox-group → VCFormCheckboxGroup`.
     */
    component?: string;
}

const props = defineProps<Props>();

const showCode = ref(true);
const copied = ref(false);
const codeRoot = useTemplateRef<globalThis.HTMLElement>('codeRoot');
const frameRef = useTemplateRef<globalThis.HTMLIFrameElement>('frame');
const frameHeight = ref<number>(160);
let copyTimer: ReturnType<typeof setTimeout> | null = null;

// Variant catalog — populated from the iframe's `announceVariants` call.
// Renders a single-row dropdown strip in the toolbar.
const variantCatalog = ref<Record<string, readonly string[]>>({});
const variantValues = reactive<Record<string, string>>({});

// Rich prop catalog — populated from the iframe's `announceProps` call.
// Each entry is a typed spec; the toolbar renders the matching control.
// Dot-pathed keys (`themeVariant.size`) are auto-grouped into nested
// objects on the iframe side.
const propCatalog = ref<PropCatalog>({});
const propValues = reactive<PropValues>({});

// Global palette / color-mode state. Demo and Playground both forward
// these to their iframes so visuals stay in sync with the docs-site
// preferences (set in the navbar's SettingsModal). Per-theme proof
// lives in the runnable example apps under `examples/`; the docs are
// pinned to Tailwind.
const { current: palette } = useColorPalette();
const { isDark } = useData();

const frameSrc = computed(() => withBase(`/demos/${props.name}.html`));

const componentName = computed(() => {
    if (props.component) return props.component;
    const camel = props.name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    return `VC${camel}`;
});

const frameTitle = computed(() => {
    if (props.title) return `${props.title} playground`;
    return `${componentName.value} playground`;
});

const hasVariants = computed(() => Object.keys(variantCatalog.value).length > 0);
const hasProps = computed(() => Object.keys(propCatalog.value).length > 0);

// Group rich-prop entries by their `section` (or 'General' if unset) so
// related controls land together. Each group renders its own row.
const propSections = computed(() => {
    const sections = new Map<string, Array<{ key: string; spec: PropSpec }>>();
    for (const [key, spec] of Object.entries(propCatalog.value)) {
        const section = spec.section ?? 'General';
        if (!sections.has(section)) sections.set(section, []);
        sections.get(section)!.push({ key, spec });
    }
    return Array.from(sections.entries()).map(([title, entries]) => ({ title, entries }));
});

// Display label — explicit `label` wins, otherwise prettify the key.
// `themeVariant.size` → `size`, `hideDisabled` → `hide disabled`.
const labelFor = (key: string, spec: PropSpec): string => {
    if (spec.label) return spec.label;
    const tail = key.includes('.') ? key.split('.').pop()! : key;
    return tail.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
};

/*
 * Pinning targetOrigin to `globalThis.location.origin` ensures messages
 * are delivered ONLY to a same-origin parent — cross-origin embedders
 * never receive control messages.
 */
const postColorMode = (): void => {
    const win = frameRef.value?.contentWindow;
    if (!win) return;
    win.postMessage(
        { type: 'set-color-mode', mode: isDark.value ? 'dark' : 'light' },
        globalThis.location.origin,
    );
};

const postVariants = (): void => {
    const win = frameRef.value?.contentWindow;
    if (!win) return;
    if (Object.keys(variantValues).length === 0) return;
    win.postMessage(
        { type: 'set-variants', values: { ...variantValues } },
        globalThis.location.origin,
    );
};

const postProps = (): void => {
    const win = frameRef.value?.contentWindow;
    if (!win) return;
    if (Object.keys(propValues).length === 0) return;
    win.postMessage(
        { type: 'set-props', values: { ...propValues } },
        globalThis.location.origin,
    );
};

const postPalette = (): void => {
    const win = frameRef.value?.contentWindow;
    if (!win) return;
    win.postMessage(
        {
            type: 'set-palette',
            primary: palette.value.primary ?? 'blue',
            neutral: palette.value.neutral ?? 'neutral',
        },
        globalThis.location.origin,
    );
};

const onFrameLoad = (): void => {
    // Forward initial color-mode / palette state to the freshly loaded
    // iframe — and re-post the user's current toolbar selections so the
    // preview matches the toolbar after a same-src iframe reload (HMR,
    // manual refresh) rather than snapping back to the iframe's declared
    // defaults.
    //
    // Important: do NOT clear `variantCatalog` / `propCatalog` here. The
    // iframe's `announceVariants` / `announceProps` posts its message
    // during module-script execution, which can land in the parent's
    // queue BEFORE the iframe's `load` event fires — clearing here would
    // erase the catalog we just received and the toolbar would never
    // show controls. Catalog reset belongs on the `frameSrc` change
    // watcher below (different demo → reset stale catalog).
    postColorMode();
    postPalette();
    postVariants();
    postProps();
};

const onFrameMessage = (event: MessageEvent): void => {
    if (event.origin !== globalThis.location.origin) return;
    if (event.source !== frameRef.value?.contentWindow) return;
    const { data } = event;
    if (!isObject(data)) return;
    if (data.type === 'demo-resize' && typeof data.height === 'number') {
        frameHeight.value = data.height;
        return;
    }
    if (data.type === 'demo-variants' && data.catalog && data.defaults) {
        variantCatalog.value = data.catalog as Record<string, readonly string[]>;
        Object.keys(variantValues).forEach((k) => delete variantValues[k]);
        Object.assign(variantValues, data.defaults);
        return;
    }
    if (data.type === 'demo-props' && data.catalog && data.defaults) {
        propCatalog.value = data.catalog as PropCatalog;
        Object.keys(propValues).forEach((k) => delete propValues[k]);
        Object.assign(propValues, data.defaults);
    }
};

watch(isDark, () => {
    postColorMode();
});

watch(variantValues, () => postVariants(), { deep: true });
watch(propValues, () => postProps(), { deep: true });
watch(palette, () => postPalette(), { deep: true });

// Reset toolbar state when navigating to a different demo. The iframe
// will repopulate with its own announce; clearing here just prevents
// the previous demo's catalog from briefly showing before the new one
// announces.
watch(frameSrc, () => {
    variantCatalog.value = {};
    Object.keys(variantValues).forEach((k) => delete variantValues[k]);
    propCatalog.value = {};
    Object.keys(propValues).forEach((k) => delete propValues[k]);
});

onMounted(() => {
    globalThis.window.addEventListener('message', onFrameMessage);
});

onBeforeUnmount(() => {
    globalThis.window.removeEventListener('message', onFrameMessage);
});

const copy = async () => {
    if (!codeRoot.value) return;
    const pre = codeRoot.value.querySelector('.vp-code-group .blocks > .active pre') ??
        codeRoot.value.querySelector('pre');
    if (!pre) return;
    const text = pre.textContent ?? '';
    if (!navigator?.clipboard) return;
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        return;
    }
    copied.value = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copied.value = false; }, 1500);
};
</script>

<template>
    <div class="vc-demo vc-demo--playground">
        <div
            v-if="title"
            class="vc-demo-title"
        >
            {{ title }}
        </div>

        <div
            v-if="hasVariants"
            class="vc-demo-controls"
        >
            <div class="vc-demo-controls-row">
                <span class="vc-demo-controls-label">Variant</span>
                <div class="vc-demo-controls-fields">
                    <label
                        v-for="(values, key) in variantCatalog"
                        :key="key"
                        class="vc-demo-control"
                    >
                        <span class="vc-demo-control-name">{{ key }}</span>
                        <select
                            v-model="variantValues[key]"
                            class="vc-demo-control-select"
                        >
                            <option
                                v-for="value in values"
                                :key="value"
                                :value="value"
                            >
                                {{ value }}
                            </option>
                        </select>
                    </label>
                </div>
            </div>
        </div>

        <div
            v-if="hasProps"
            class="vc-demo-controls"
        >
            <div
                v-for="section in propSections"
                :key="section.title"
                class="vc-demo-controls-row"
            >
                <span class="vc-demo-controls-label">{{ section.title }}</span>
                <div class="vc-demo-controls-fields">
                    <label
                        v-for="entry in section.entries"
                        :key="entry.key"
                        class="vc-demo-control"
                    >
                        <span class="vc-demo-control-name">{{ labelFor(entry.key, entry.spec) }}</span>
                        <input
                            v-if="entry.spec.type === 'boolean'"
                            v-model="propValues[entry.key] as boolean"
                            type="checkbox"
                            class="vc-demo-control-checkbox"
                        >
                        <select
                            v-else-if="entry.spec.type === 'enum'"
                            v-model="propValues[entry.key] as string"
                            class="vc-demo-control-select"
                        >
                            <option
                                v-for="value in entry.spec.options"
                                :key="value"
                                :value="value"
                            >
                                {{ value }}
                            </option>
                        </select>
                        <template v-else-if="entry.spec.type === 'number'">
                            <input
                                v-if="entry.spec.min !== undefined && entry.spec.max !== undefined"
                                v-model.number="propValues[entry.key] as number"
                                type="range"
                                :min="entry.spec.min"
                                :max="entry.spec.max"
                                :step="entry.spec.step ?? 1"
                                class="vc-demo-control-range"
                            >
                            <input
                                v-model.number="propValues[entry.key] as number"
                                type="number"
                                :min="entry.spec.min"
                                :max="entry.spec.max"
                                :step="entry.spec.step ?? 1"
                                class="vc-demo-control-number"
                            >
                        </template>
                        <input
                            v-else-if="entry.spec.type === 'string'"
                            v-model="propValues[entry.key] as string"
                            type="text"
                            :placeholder="entry.spec.placeholder"
                            class="vc-demo-control-text"
                        >
                    </label>
                </div>
            </div>
        </div>

        <div class="vc-demo-preview vc-demo-preview--iframe">
            <iframe
                ref="frame"
                :src="frameSrc"
                :style="{ height: `${frameHeight}px` }"
                :title="frameTitle"
                @load="onFrameLoad"
            />
        </div>

        <div class="vc-demo-toolbar">
            <button
                type="button"
                class="vc-demo-toggle"
                @click="showCode = !showCode"
            >
                {{ showCode ? 'Hide code' : 'Show code' }}
            </button>
            <button
                type="button"
                class="vc-demo-copy"
                :disabled="!showCode"
                @click="copy"
            >
                {{ copied ? 'Copied' : 'Copy' }}
            </button>
        </div>

        <div
            v-show="showCode"
            ref="codeRoot"
            class="vc-demo-code"
        >
            <slot name="code" />
        </div>
    </div>
</template>

<style scoped>
/* Playground reuses the same shell styles as Demo. The `--playground`
   modifier is reserved for future visual differentiation (e.g. a
   "Playground" badge in the title bar) — currently identical to Demo. */
.vc-demo {
    border: 1px solid var(--vc-color-border);
    border-radius: 0.625rem;
    overflow: hidden;
    margin: 1.25rem 0 1.5rem;
    background: var(--vc-color-bg);
}

.vc-demo-title {
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--vc-color-border);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--vc-color-fg-muted);
    background: var(--vc-color-bg-elevated);
}

.vc-demo-controls {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--vc-color-border);
    background: var(--vc-color-bg-elevated);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.vc-demo-controls-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.vc-demo-controls-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--vc-color-fg-muted);
    min-width: 4rem;
}

.vc-demo-controls-fields {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.vc-demo-control {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
}

.vc-demo-control-name {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--vc-color-fg-muted);
    text-transform: capitalize;
}

.vc-demo-control-select,
.vc-demo-control-number,
.vc-demo-control-text {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.25rem;
    background: var(--vc-color-bg);
    color: var(--vc-color-fg);
    cursor: pointer;
}
.vc-demo-control-number {
    width: 4.5rem;
    cursor: text;
}
.vc-demo-control-text {
    width: 9rem;
    cursor: text;
}
.vc-demo-control-select:focus,
.vc-demo-control-number:focus,
.vc-demo-control-text:focus {
    outline: none;
    border-color: var(--vc-color-primary-500);
    box-shadow: 0 0 0 1px var(--vc-color-primary-500);
}

.vc-demo-control-checkbox {
    width: 0.875rem;
    height: 0.875rem;
    accent-color: var(--vc-color-primary-600);
    cursor: pointer;
}

.vc-demo-control-range {
    width: 7rem;
    accent-color: var(--vc-color-primary-600);
    cursor: pointer;
}

.vc-demo-preview {
    padding: 1.5rem;
    background: var(--vc-color-bg);
}

.vc-demo-preview--iframe {
    padding: 0;
}

.vc-demo-preview iframe {
    display: block;
    width: 100%;
    border: 0;
    background: var(--vc-color-bg);
    transition: height 0.15s ease;
}

.vc-demo-toolbar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-top: 1px solid var(--vc-color-border);
    border-bottom: 1px solid var(--vc-color-border);
    background: var(--vc-color-bg-elevated);
}

.vc-demo-toggle,
.vc-demo-copy {
    padding: 0.25rem 0.625rem;
    border: 1px solid transparent;
    background: transparent;
    color: var(--vc-color-fg-muted);
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.375rem;
    cursor: pointer;
}
.vc-demo-toggle:hover,
.vc-demo-copy:hover:not(:disabled) {
    color: var(--vc-color-fg);
    border-color: var(--vc-color-border);
}
.vc-demo-copy { margin-left: auto; }
.vc-demo-copy:disabled { opacity: 0.5; cursor: not-allowed; }

.vc-demo-code :deep(div[class*='language-']) {
    margin: 0;
    border-radius: 0;
}
.vc-demo-code :deep(pre) {
    margin: 0;
}
</style>
