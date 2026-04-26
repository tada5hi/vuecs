<script setup lang="ts">
import { useData } from 'vitepress';
import { usePalette } from '@vuecs/design';
import {
    NEUTRAL_PALETTES,
    type NeutralPalette,
    type PrimaryPalette,
} from '../palette-options';

const { isDark } = useData();

/*
 * Hero swatches share the SAME reactive state as the navbar
 * `PaletteSwitch` — `usePalette()` from `@vuecs/design` is wrapped
 * with `createSharedComposable`, so every call site reads/writes the
 * one shared ref. `setPalette()` is invoked inside the composable
 * (apply on init + apply on change). localStorage persists across
 * reloads.
 */
// No `initial` — `usePalette()` is wrapped in `createSharedComposable`,
// so options are first-call-wins. Demo.vue calls without options, so an
// `initial` here would be silently dropped. Design-token defaults paint
// `primary=blue` / `neutral=neutral` for the empty case.
const { current, extend } = usePalette();

// Hero shows a curated 6-color visual swatch grid (constrained
// horizontally by the hero card). The full enum lives in palette-options.ts.
const swatchPalettes: PrimaryPalette[] = ['blue', 'green', 'orange', 'red', 'purple', 'teal'];

const setPrimary = (value: PrimaryPalette) => {
    extend({ primary: value });
};

const setNeutral = (value: NeutralPalette) => {
    extend({ neutral: value });
};

const toggleDark = () => {
    isDark.value = !isDark.value;
};
</script>

<template>
    <section class="vc-hero">
        <div class="vc-hero-inner">
            <div class="vc-hero-text">
                <h1 class="vc-hero-title">
                    <span class="vc-hero-title-grad">vuecs</span>
                </h1>
                <p class="vc-hero-tagline">
                    Themeable Vue 3 component library with design tokens, runtime palette switching,
                    and SSR-safe Nuxt integration.
                </p>
                <div class="vc-hero-actions">
                    <a
                        class="vc-btn vc-btn-primary"
                        href="/getting-started/"
                    >Get Started</a>
                    <a
                        class="vc-btn vc-btn-ghost"
                        href="https://github.com/tada5hi/vuecs"
                        target="_blank"
                        rel="noopener"
                    >
                        View on GitHub
                    </a>
                </div>
            </div>

            <div class="vc-hero-card">
                <div class="vc-hero-card-toolbar">
                    <span
                        class="vc-hero-card-dot"
                        style="background: var(--vc-color-error-500)"
                    />
                    <span
                        class="vc-hero-card-dot"
                        style="background: var(--vc-color-warning-500)"
                    />
                    <span
                        class="vc-hero-card-dot"
                        style="background: var(--vc-color-success-500)"
                    />
                    <button
                        class="vc-hero-card-toggle"
                        type="button"
                        @click="toggleDark"
                    >
                        {{ isDark ? 'Dark' : 'Light' }}
                    </button>
                </div>

                <div class="vc-hero-card-body">
                    <p class="vc-hero-card-label">
                        Primary palette
                    </p>
                    <div class="vc-hero-card-swatches">
                        <button
                            v-for="swatch in swatchPalettes"
                            :key="swatch"
                            type="button"
                            class="vc-hero-card-swatch"
                            :class="{ 'vc-hero-card-swatch-active': (current.primary ?? 'blue') === swatch }"
                            :title="swatch"
                            :style="{ backgroundColor: `var(--color-${swatch}-500)` }"
                            @click="setPrimary(swatch)"
                        />
                    </div>

                    <p class="vc-hero-card-label">
                        Neutral palette
                    </p>
                    <select
                        :value="current.neutral ?? 'neutral'"
                        class="vc-hero-card-select"
                        @change="setNeutral(($event.target as globalThis.HTMLSelectElement).value as NeutralPalette)"
                    >
                        <option
                            v-for="p in NEUTRAL_PALETTES"
                            :key="p"
                            :value="p"
                        >
                            {{ p }}
                        </option>
                    </select>

                    <div class="vc-hero-card-preview">
                        <button
                            class="vc-btn vc-btn-primary"
                            type="button"
                        >
                            Primary action
                        </button>
                        <button
                            class="vc-btn vc-btn-ghost"
                            type="button"
                        >
                            Secondary
                        </button>
                    </div>

                    <p class="vc-hero-card-hint">
                        Click swatches to recolor every component on the page in real time —
                        powered by <code>setPalette()</code>.
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.vc-hero {
    padding: 4rem 1.5rem 3rem;
    background:
        radial-gradient(1200px 600px at 100% 0%, color-mix(in oklab, var(--vc-color-primary-500) 12%, transparent), transparent),
        radial-gradient(800px 400px at 0% 100%, color-mix(in oklab, var(--vc-color-info-500) 10%, transparent), transparent);
}

.vc-hero-inner {
    max-width: 1152px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
}

@media (min-width: 960px) {
    .vc-hero-inner { grid-template-columns: 1fr 1fr; gap: 4rem; }
}

.vc-hero-title {
    font-size: clamp(2.75rem, 6vw, 4.5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 1.25rem;
}
.vc-hero-title-grad {
    background: linear-gradient(120deg, var(--vc-color-primary-500), var(--vc-color-info-500));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.vc-hero-tagline {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--vc-color-fg-muted);
    max-width: 36rem;
    margin: 0 0 2rem;
}

.vc-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.vc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    border: 1px solid transparent;
    transition: background-color 120ms, color 120ms, border-color 120ms;
    cursor: pointer;
    text-decoration: none !important;
}

.vc-btn-primary {
    background: var(--vc-color-primary-600);
    color: #fff;
}
.vc-btn-primary:hover { background: var(--vc-color-primary-500); }

.vc-btn-ghost {
    background: transparent;
    color: var(--vc-color-fg);
    border-color: var(--vc-color-border);
}
.vc-btn-ghost:hover {
    background: var(--vc-color-bg-elevated);
    border-color: var(--vc-color-fg-muted);
}

.vc-hero-card {
    border: 1px solid var(--vc-color-border);
    border-radius: 1rem;
    background: var(--vc-color-bg);
    box-shadow: 0 25px 50px -12px color-mix(in oklab, var(--vc-color-primary-500) 8%, rgba(0,0,0,0.25));
    overflow: hidden;
}

.vc-hero-card-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--vc-color-border);
    background: var(--vc-color-bg-elevated);
}
.vc-hero-card-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 999px;
    display: inline-block;
}
.vc-hero-card-toggle {
    margin-left: auto;
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 999px;
    background: transparent;
    color: var(--vc-color-fg-muted);
    cursor: pointer;
}
.vc-hero-card-toggle:hover { color: var(--vc-color-fg); }

.vc-hero-card-body { padding: 1.25rem; }

.vc-hero-card-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    color: var(--vc-color-fg-muted);
    margin: 0 0 0.5rem;
}

.vc-hero-card-swatches {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
}
.vc-hero-card-swatch {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 999px;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
}
.vc-hero-card-swatch-active {
    border-color: var(--vc-color-fg);
    box-shadow: 0 0 0 2px var(--vc-color-bg);
}

.vc-hero-card-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--vc-color-border);
    background: var(--vc-color-bg);
    color: var(--vc-color-fg);
    font-size: 0.875rem;
    margin-bottom: 1.25rem;
}

.vc-hero-card-preview {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: var(--vc-color-bg-elevated);
    border: 1px solid var(--vc-color-border);
    margin-bottom: 1rem;
}

.vc-hero-card-hint {
    font-size: 0.8125rem;
    color: var(--vc-color-fg-muted);
    margin: 0;
}
.vc-hero-card-hint code {
    background: var(--vc-color-bg-elevated);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.8em;
}
</style>
