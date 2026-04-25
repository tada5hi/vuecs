<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

interface Props {
    title?: string;
}

defineProps<Props>();

const showCode = ref(true);
const copied = ref(false);
const codeRoot = useTemplateRef<globalThis.HTMLElement>('codeRoot');

const copy = async () => {
    if (!codeRoot.value) return;
    // When the slot contains a VitePress code-group (::: code-group), the
    // active tab carries the `.active` class. Prefer it so the copy button
    // tracks which tab the reader is actually looking at; fall back to any
    // <pre> for the single-code-block case.
    const pre = codeRoot.value.querySelector(
        '.vp-code-group .blocks > .active pre, pre',
    );
    if (!pre) return;
    const text = pre.textContent ?? '';
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1500);
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

        <div class="vc-demo-preview">
            <slot />
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
    /* If the demo content is a single column it should center vertically;
       overrideable via slot content's own layout. */
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
