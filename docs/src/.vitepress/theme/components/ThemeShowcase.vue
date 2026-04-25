<script setup lang="ts">
interface ThemeCard {
    name: string;
    accent: string;
    href: string;
    summary: string;
    bullets: string[];
}

const themes: ThemeCard[] = [
    {
        name: 'Tailwind',
        accent: 'var(--vc-color-info-500)',
        href: '/themes/tailwind',
        summary: 'Native pairing for @vuecs/design — utility-first, JIT-compiled, dark-mode aware.',
        bullets: [
            'Tailwind v4 only',
            'Semantic token utilities (bg-bg, text-fg, border-border)',
            'twMerge-backed merge function pre-wired',
        ],
    },
    {
        name: 'Bootstrap v5',
        accent: 'var(--vc-color-primary-500)',
        href: '/themes/bootstrap-v5',
        summary: 'Drop-in Bootstrap 5 classes with optional design-token bridge for runtime palette switching.',
        bullets: [
            'Bootstrap 5.x classes',
            'design-token bridge maps --bs-* → --vc-color-*',
            'Repalettes Bootstrap components at runtime',
        ],
    },
    {
        name: 'Bootstrap v4',
        accent: 'var(--vc-color-warning-500)',
        href: '/themes/bootstrap-v4',
        summary: 'Legacy Bootstrap 4 support for projects still on the older release line.',
        bullets: [
            'Bootstrap 4.x classes',
            'design-token bridge for consumer-authored CSS',
            'Bootstrap components themselves are Sass-compiled (limited reach)',
        ],
    },
];
</script>

<template>
    <section class="vc-themes">
        <div class="vc-themes-inner">
            <h2 class="vc-themes-heading">
                Pick your CSS framework
            </h2>
            <p class="vc-themes-sub">
                vuecs ships drop-in themes for Tailwind v4, Bootstrap v5, and Bootstrap v4.
                Mix and match with @vuecs/theme-font-awesome for icons.
            </p>

            <div class="vc-themes-grid">
                <a
                    v-for="t in themes"
                    :key="t.name"
                    :href="t.href"
                    class="vc-theme-card"
                    :style="{ '--accent': t.accent }"
                >
                    <h3 class="vc-theme-name">{{ t.name }}</h3>
                    <p class="vc-theme-summary">{{ t.summary }}</p>
                    <ul class="vc-theme-list">
                        <li
                            v-for="b in t.bullets"
                            :key="b"
                        >{{ b }}</li>
                    </ul>
                    <span class="vc-theme-cta">Read more →</span>
                </a>
            </div>
        </div>
    </section>
</template>

<style scoped>
.vc-themes {
    padding: 4rem 1.5rem;
    background: var(--vc-color-bg-muted);
}

.vc-themes-inner {
    max-width: 1152px;
    margin: 0 auto;
}

.vc-themes-heading {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    text-align: center;
    margin: 0 0 0.75rem;
}

.vc-themes-sub {
    text-align: center;
    max-width: 38rem;
    margin: 0 auto 2.5rem;
    color: var(--vc-color-fg-muted);
}

.vc-themes-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
}

@media (min-width: 768px) {
    .vc-themes-grid { grid-template-columns: repeat(3, 1fr); }
}

.vc-theme-card {
    --accent: var(--vc-color-primary-500);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border: 1px solid var(--vc-color-border);
    border-top: 3px solid var(--accent);
    border-radius: 0.75rem;
    background: var(--vc-color-bg);
    text-decoration: none !important;
    color: inherit;
    transition: transform 120ms, border-color 120ms;
}
.vc-theme-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
}

.vc-theme-name {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
}

.vc-theme-summary {
    font-size: 0.9375rem;
    color: var(--vc-color-fg-muted);
    margin: 0 0 1rem;
    line-height: 1.5;
}

.vc-theme-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem;
    flex: 1;
}
.vc-theme-list li {
    padding: 0.375rem 0;
    font-size: 0.875rem;
    color: var(--vc-color-fg);
    border-bottom: 1px solid var(--vc-color-border-muted);
}
.vc-theme-list li:last-child { border-bottom: none; }
.vc-theme-list li::before {
    content: '✓';
    margin-right: 0.5rem;
    color: var(--accent);
    font-weight: 700;
}

.vc-theme-cta {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent);
}
</style>
