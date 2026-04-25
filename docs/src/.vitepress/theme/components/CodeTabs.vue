<script setup lang="ts">
import { ref } from 'vue';

interface Tab {
    label: string;
    lang: string;
    code: string;
}

const tabs: Tab[] = [
    {
        label: 'Install',
        lang: 'bash',
        code: 'npm install @vuecs/core @vuecs/theme-tailwind @vuecs/design',
    },
    {
        label: 'Configure',
        lang: 'ts',
        code: `// main.ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import App from './App.vue';

createApp(App)
    .use(vuecs, { themes: [tailwindTheme()] })
    .mount('#app');`,
    },
    {
        label: 'Use',
        lang: 'vue',
        // Split the closing tag so Vue's SFC parser doesn't terminate the
        // surrounding script block when reading this file.
        code: `<script setup lang="ts">
import { VCFormInput, VCFormSubmit } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref('');
${'</'}script>

<template>
    <VCFormInput v-model="value" placeholder="Email" />
    <VCFormSubmit type="primary" />
</template>`,
    },
];

const active = ref(0);
const copied = ref(false);

const copy = async (code: string) => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1500);
};
</script>

<template>
    <section class="vc-codetabs">
        <div class="vc-codetabs-inner">
            <h2 class="vc-codetabs-heading">
                From zero to first component
            </h2>
            <p class="vc-codetabs-sub">
                Three steps. Tailwind v4 + design tokens come pre-wired.
            </p>

            <div class="vc-codetabs-card">
                <div
                    class="vc-codetabs-tabs"
                    role="tablist"
                >
                    <button
                        v-for="(tab, i) in tabs"
                        :key="tab.label"
                        type="button"
                        class="vc-codetabs-tab"
                        :class="{ 'vc-codetabs-tab-active': active === i }"
                        :aria-selected="active === i"
                        role="tab"
                        @click="active = i"
                    >
                        {{ tab.label }}
                    </button>
                    <button
                        type="button"
                        class="vc-codetabs-copy"
                        @click="copy(tabs[active].code)"
                    >
                        {{ copied ? 'Copied' : 'Copy' }}
                    </button>
                </div>
                <pre class="vc-codetabs-pre"><code>{{ tabs[active].code }}</code></pre>
            </div>
        </div>
    </section>
</template>

<style scoped>
.vc-codetabs {
    padding: 4rem 1.5rem;
    background: var(--vc-color-bg-muted);
}

.vc-codetabs-inner {
    max-width: 960px;
    margin: 0 auto;
}

.vc-codetabs-heading {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    text-align: center;
    margin: 0 0 0.5rem;
}

.vc-codetabs-sub {
    text-align: center;
    color: var(--vc-color-fg-muted);
    margin: 0 0 2rem;
}

.vc-codetabs-card {
    border: 1px solid var(--vc-color-border);
    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--vc-color-bg);
}

.vc-codetabs-tabs {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.5rem 0;
    border-bottom: 1px solid var(--vc-color-border);
    background: var(--vc-color-bg-elevated);
}

.vc-codetabs-tab {
    padding: 0.5rem 0.875rem;
    border: none;
    background: transparent;
    color: var(--vc-color-fg-muted);
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem 0.375rem 0 0;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
}
.vc-codetabs-tab:hover { color: var(--vc-color-fg); }
.vc-codetabs-tab-active {
    color: var(--vc-color-fg);
    border-bottom-color: var(--vc-color-primary-500);
    background: var(--vc-color-bg);
}

.vc-codetabs-copy {
    margin-left: auto;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.375rem;
    background: transparent;
    font-size: 0.75rem;
    color: var(--vc-color-fg-muted);
    cursor: pointer;
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
}
.vc-codetabs-copy:hover { color: var(--vc-color-fg); }

.vc-codetabs-pre {
    padding: 1.25rem;
    margin: 0;
    overflow-x: auto;
    font-size: 0.8125rem;
    line-height: 1.6;
    background: var(--vc-color-bg);
    color: var(--vc-color-fg);
}
.vc-codetabs-pre code { font-family: ui-monospace, monospace; }
</style>
