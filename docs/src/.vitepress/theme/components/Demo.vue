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
import { useDocsPalette } from '../composables/use-docs-palette';

interface Props {
    title?: string;
    /**
     * Name of the iframe-isolated demo. When set, the demo renders inside
     * `<iframe src="/demos/<name>.html">` instead of the default slot —
     * the demo runs in its own document so VitePress's CSS resets and
     * `.vp-doc` chrome don't leak in. Files live under
     * `docs/demos/src/<name>.{html,ts,demo.vue}` (built by
     * `docs/demos/vite.config.ts` into `docs/src/public/demos/`).
     */
    name?: string;
    /**
     * Component name to show in the live-config snippet (e.g. `VCPagination`).
     * If omitted, derived from `name` by capitalising and prefixing `VC` —
     * which works for single-word demos (countdown → VCCountdown). For
     * multi-word kebab-case names (form-input-checkbox → VCFormInputCheckbox)
     * pass it explicitly.
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

// Variant catalog announced by the iframe via postMessage. Empty until
// the demo mounts and calls `announceVariants(...)` in iframe-bridge —
// at that point we render a dropdown per variant key in the toolbar.
const variantCatalog = ref<Record<string, readonly string[]>>({});
const variantValues = reactive<Record<string, string>>({});

// Global palette state — lives in the navbar `PaletteSwitch` component.
// Demo.vue subscribes and forwards changes to its iframe. Local
// dropdowns intentionally NOT rendered here (palette is page-wide, not
// per-component, so it belongs in the navbar).
const palette = useDocsPalette();

const { isDark } = useData();

// `withBase` prepends VitePress's configured `base` (currently '/' for the
// vuecs.dev deploy). If the site is ever moved to a subpath (e.g. a
// project page at `/vuecs/`), the iframe URL follows. The demos' own
// internal asset paths use Vite's `base` in `docs/demos/vite.config.ts`
// — that value must be kept in sync with VitePress's `base + 'demos/'`
// when changing deploy paths.
const frameSrc = computed(() => (props.name ? withBase(`/demos/${props.name}.html`) : null));

const componentName = computed(() => {
    if (props.component) return props.component;
    if (!props.name) return 'VCComponent';
    const camel = props.name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    return `VC${camel}`;
});

// Per-iframe accessibility name. Pages with multiple demos (e.g.
// form-select-search has two) need distinct titles so screen readers
// can tell them apart.
const frameTitle = computed(() => {
    if (props.title) return `${props.title} demo`;
    return `${componentName.value} demo`;
});

const variantSnippet = computed(() => {
    const keys = Object.keys(variantValues);
    if (keys.length === 0) return '';
    const inner = keys.map((k) => `${k}: '${variantValues[k]}'`).join(', ');
    return `<${componentName.value} :theme-variant="{ ${inner} }" />`;
});

const paletteSnippet = computed(() => `setPalette({ primary: '${palette.primary}', neutral: '${palette.neutral}' });`);

const hasVariants = computed(() => Object.keys(variantCatalog.value).length > 0);

/*
 * postMessage targetOrigin: demos are served same-origin with the docs
 * host (`vuecs.dev/demos/<name>.html` for the deploy, localhost for
 * dev). Pinning the targetOrigin to `globalThis.location.origin`
 * ensures the message is delivered ONLY to a same-origin parent —
 * cross-origin embedders never receive control messages.
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
    // Skip empty payloads — `onFrameLoad` clears `variantValues` before
    // the iframe announces its catalog, which would otherwise trigger
    // the deep watcher and post an empty `set-variants` round-trip
    // that the iframe immediately overwrites with its own announce.
    if (Object.keys(variantValues).length === 0) return;
    win.postMessage(
        { type: 'set-variants', values: { ...variantValues } },
        globalThis.location.origin,
    );
};

const postPalette = (): void => {
    const win = frameRef.value?.contentWindow;
    if (!win) return;
    win.postMessage(
        {
            type: 'set-palette',
            primary: palette.primary,
            neutral: palette.neutral,
        },
        globalThis.location.origin,
    );
};

const onFrameLoad = (): void => {
    // Reset variant state for the new iframe (in case Demo.vue is reused
    // across navigations and the previous demo had a different catalog).
    variantCatalog.value = {};
    Object.keys(variantValues).forEach((k) => delete variantValues[k]);
    postColorMode();
    postPalette();
};

const onFrameMessage = (event: MessageEvent): void => {
    // Only accept messages from THIS demo's iframe. Both checks together:
    //  - origin: rejects cross-origin messages (defense if Demo.vue is
    //    ever embedded in an unexpected context)
    //  - source: rejects same-origin sibling iframes that aren't ours
    if (event.origin !== globalThis.location.origin) return;
    if (event.source !== frameRef.value?.contentWindow) return;
    const data = event.data as {
        type?: string;
        height?: number;
        catalog?: Record<string, readonly string[]>;
        defaults?: Record<string, string>;
    };
    if (!data || typeof data !== 'object') return;
    if (data.type === 'demo-resize' && typeof data.height === 'number') {
        frameHeight.value = data.height;
        return;
    }
    if (data.type === 'demo-variants' && data.catalog && data.defaults) {
        variantCatalog.value = data.catalog;
        Object.keys(variantValues).forEach((k) => delete variantValues[k]);
        Object.assign(variantValues, data.defaults);
    }
};

watch(isDark, () => {
    postColorMode();
});

watch(
    variantValues,
    () => {
        postVariants();
    },
    { deep: true },
);

watch(
    palette,
    () => {
        postPalette();
    },
    { deep: true },
);

onMounted(() => {
    globalThis.window.addEventListener('message', onFrameMessage);
});

onBeforeUnmount(() => {
    globalThis.window.removeEventListener('message', onFrameMessage);
});

const copy = async () => {
    if (!codeRoot.value) return;
    // When the slot contains a VitePress code-group (::: code-group), the
    // active tab carries the `.active` class. Run two queries in priority
    // order — `querySelector('a, b')` returns the FIRST DOM-order match
    // across both selectors (not the first selector that matches), which
    // would always pick the inactive first tab's <pre>. The two-step
    // lookup actually tracks the active tab; falls back to any <pre> for
    // the single-code-block case.
    const pre = codeRoot.value.querySelector('.vp-code-group .blocks > .active pre') ??
        codeRoot.value.querySelector('pre');
    if (!pre) return;
    const text = pre.textContent ?? '';
    if (!navigator?.clipboard) return;
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        // Clipboard API can reject in insecure contexts or permission
        // denial — swallow and leave `copied` false so the button
        // doesn't claim success.
        return;
    }
    copied.value = true;
    // Clear any pending timer so rapid successive clicks restart the
    // 1.5s "Copied" window from the latest click instead of letting an
    // older timer flip back early.
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copied.value = false; }, 1500);
};
</script>

<template>
    <div class="vc-demo">
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
            <div class="vc-demo-snippet">
                <code class="vc-demo-snippet-code">{{ variantSnippet }}</code>
                <code class="vc-demo-snippet-code vc-demo-snippet-code--muted">{{ paletteSnippet }}</code>
            </div>
        </div>

        <div
            class="vc-demo-preview"
            :class="{ 'vc-demo-preview--iframe': !!frameSrc }"
        >
            <iframe
                v-if="frameSrc"
                ref="frame"
                :src="frameSrc"
                :style="{ height: `${frameHeight}px` }"
                :title="frameTitle"
                @load="onFrameLoad"
            />
            <slot v-else />
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

/* Controls panel — sits above the iframe preview, contains the variant
   dropdowns + the live-config snippet showing how the consumer would
   write the same call. The palette controls live in the navbar; the
   snippet here mirrors both the variant and the palette so the user
   sees the full picture in one place. */
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

.vc-demo-control-select {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.25rem;
    background: var(--vc-color-bg);
    color: var(--vc-color-fg);
    cursor: pointer;
}
.vc-demo-control-select:focus {
    outline: none;
    border-color: var(--vc-color-primary-500);
    box-shadow: 0 0 0 1px var(--vc-color-primary-500);
}

/* Live-config snippet — shows the Vue/JS call the user would write
   to reproduce the current state. Updates reactively. */
.vc-demo-snippet {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.5rem 0.625rem;
    border-radius: 0.375rem;
    background: var(--vc-color-bg);
    border: 1px dashed var(--vc-color-border);
    font-family: var(--font-mono);
}

.vc-demo-snippet-code {
    font-size: 0.6875rem;
    color: var(--vc-color-fg);
    white-space: pre-wrap;
    word-break: break-word;
    background: transparent;
    padding: 0;
    border: 0;
}

.vc-demo-snippet-code--muted {
    color: var(--vc-color-fg-muted);
}

.vc-demo-preview {
    padding: 1.5rem;
    background: var(--vc-color-bg);
}

/* Iframe demos own their own document padding (see docs/demos/src/style.css);
   the host preview just needs to provide the surface and let the iframe
   span it. */
.vc-demo-preview--iframe {
    padding: 0;
}

.vc-demo-preview iframe {
    display: block;
    width: 100%;
    border: 0;
    background: var(--vc-color-bg);
    /* Smooth height transitions when content reflows (e.g. dark-mode
       toggle alters image dimensions, palette swap re-flows wrapping). */
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

/* The default slot renders VitePress-styled <pre> elements; reset margins so
   they sit flush in the demo body. */
.vc-demo-code :deep(div[class*='language-']) {
    margin: 0;
    border-radius: 0;
}
.vc-demo-code :deep(pre) {
    margin: 0;
}
</style>
