<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    useTemplateRef,
    watch,
} from 'vue';

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
}

const props = defineProps<Props>();

const showCode = ref(true);
const copied = ref(false);
const codeRoot = useTemplateRef<globalThis.HTMLElement>('codeRoot');
const frameRef = useTemplateRef<globalThis.HTMLIFrameElement>('frame');
const frameHeight = ref<number>(160);
let copyTimer: ReturnType<typeof setTimeout> | null = null;

const { isDark } = useData();

// `withBase` prepends VitePress's configured `base` (currently '/' for the
// vuecs.dev deploy). If the site is ever moved to a subpath (e.g. a
// project page at `/vuecs/`), the iframe URL follows. The demos' own
// internal asset paths use Vite's `base` in `docs/demos/vite.config.ts`
// — that value must be kept in sync with VitePress's `base + 'demos/'`
// when changing deploy paths.
const frameSrc = computed(() => (props.name ? withBase(`/demos/${props.name}.html`) : null));

const postColorMode = (): void => {
    const win = frameRef.value?.contentWindow;
    if (!win) return;
    win.postMessage(
        { type: 'set-color-mode', mode: isDark.value ? 'dark' : 'light' },
        '*',
    );
};

const onFrameLoad = (): void => {
    postColorMode();
};

const onFrameMessage = (event: MessageEvent): void => {
    const data = event.data as { type?: string, height?: number };
    if (!data || data.type !== 'demo-resize') return;
    if (event.source !== frameRef.value?.contentWindow) return;
    if (typeof data.height === 'number') {
        frameHeight.value = data.height;
    }
};

watch(isDark, () => {
    postColorMode();
});

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
            class="vc-demo-preview"
            :class="{ 'vc-demo-preview--iframe': !!frameSrc }"
        >
            <iframe
                v-if="frameSrc"
                ref="frame"
                :src="frameSrc"
                :style="{ height: `${frameHeight}px` }"
                title="Demo"
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
