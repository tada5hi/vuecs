<script setup lang="ts">
const code = `// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        palette: { primary: 'green', neutral: 'zinc' },
        // colorMode: true (default) — set false to opt out
    },
});`;
</script>

<template>
    <section class="vc-nuxt">
        <div class="vc-nuxt-inner">
            <div class="vc-nuxt-text">
                <p class="vc-nuxt-eyebrow">
                    @vuecs/nuxt
                </p>
                <h2 class="vc-nuxt-heading">
                    Built for Nuxt
                </h2>
                <p class="vc-nuxt-tagline">
                    SSR-safe palette and color-mode plumbing — server-rendered classes match
                    the client on first paint, no flash, no hydration mismatch.
                </p>
                <ul class="vc-nuxt-list">
                    <li><strong>usePalette()</strong> — switch palettes at runtime, persisted via cookie</li>
                    <li><strong>useColorMode()</strong> — VueUse-backed dark/light/system, cookie-driven</li>
                    <li><strong>Auto-imports</strong> — composables and components, zero boilerplate</li>
                    <li><strong>SSR plugins</strong> — palette and color-mode injected into &lt;head&gt; before paint</li>
                </ul>
                <a
                    class="vc-btn vc-btn-primary"
                    href="/nuxt/"
                >Read the Nuxt guide →</a>
            </div>

            <div class="vc-nuxt-code">
                <div class="vc-nuxt-code-toolbar">
                    <span>nuxt.config.ts</span>
                </div>
                <pre><code>{{ code }}</code></pre>
            </div>
        </div>
    </section>
</template>

<style scoped>
.vc-nuxt {
    padding: 4rem 1.5rem;
    background: var(--vc-color-bg);
}
.vc-nuxt-inner {
    max-width: 1152px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
}
@media (min-width: 960px) {
    .vc-nuxt-inner { grid-template-columns: 1fr 1fr; gap: 4rem; }
}

.vc-nuxt-eyebrow {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--vc-color-primary-500);
    margin: 0 0 0.75rem;
}

.vc-nuxt-heading {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
}

.vc-nuxt-tagline {
    font-size: 1.0625rem;
    line-height: 1.6;
    color: var(--vc-color-fg-muted);
    margin: 0 0 1.25rem;
}

.vc-nuxt-list {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
}
.vc-nuxt-list li {
    padding: 0.5rem 0;
    color: var(--vc-color-fg);
    font-size: 0.9375rem;
    border-bottom: 1px solid var(--vc-color-border-muted);
}
.vc-nuxt-list li:last-child { border-bottom: none; }
.vc-nuxt-list strong { color: var(--vc-color-primary-500); font-weight: 600; }

.vc-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none !important;
    transition: background-color 120ms;
}
.vc-btn-primary {
    background: var(--vc-color-primary-600);
    color: #fff;
}
.vc-btn-primary:hover { background: var(--vc-color-primary-500); }

.vc-nuxt-code {
    border: 1px solid var(--vc-color-border);
    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--vc-color-bg-elevated);
}
.vc-nuxt-code-toolbar {
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--vc-color-border);
    font-size: 0.75rem;
    color: var(--vc-color-fg-muted);
    font-family: ui-monospace, monospace;
}
.vc-nuxt-code pre {
    margin: 0;
    padding: 1.25rem;
    overflow-x: auto;
    font-size: 0.8125rem;
    line-height: 1.7;
    color: var(--vc-color-fg);
}
.vc-nuxt-code code { font-family: ui-monospace, monospace; }
</style>
