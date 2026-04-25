<script setup lang="ts">
interface Feature {
    icon: string;
    title: string;
    detail: string;
}

const features: Feature[] = [
    {
        icon: '🎨',
        title: 'Themeable',
        detail: 'Layered theme resolution with structured variants, compound variants, and runtime overrides.',
    },
    {
        icon: '🧩',
        title: 'Design tokens',
        detail: '22 Tailwind palettes, 6 semantic scales. Switch palette at runtime — no rebuild.',
    },
    {
        icon: '🌗',
        title: 'Dark mode',
        detail: 'Tokens flip automatically under .dark — every component follows.',
    },
    {
        icon: '🚀',
        title: 'Nuxt-ready',
        detail: 'SSR-safe color mode and palette via @vuecs/nuxt — zero FOUC on first paint.',
    },
    {
        icon: '🛠️',
        title: 'Multi-framework',
        detail: 'Drop-in themes for Tailwind v4, Bootstrap v5, Bootstrap v4, Font Awesome.',
    },
    {
        icon: '🔒',
        title: 'TypeScript-first',
        detail: 'Augmentable theme & defaults interfaces — autocomplete for component names and slot keys.',
    },
];
</script>

<template>
    <section class="vc-features">
        <div class="vc-features-inner">
            <h2 class="vc-features-heading">
                Built for real apps
            </h2>
            <div class="vc-features-grid">
                <article
                    v-for="f in features"
                    :key="f.title"
                    class="vc-feature"
                >
                    <div class="vc-feature-icon">
                        {{ f.icon }}
                    </div>
                    <h3 class="vc-feature-title">
                        {{ f.title }}
                    </h3>
                    <p class="vc-feature-detail">
                        {{ f.detail }}
                    </p>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped>
.vc-features {
    padding: 4rem 1.5rem;
    background: var(--vc-color-bg);
}

.vc-features-inner {
    max-width: 1152px;
    margin: 0 auto;
}

.vc-features-heading {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 2.5rem;
    text-align: center;
}

.vc-features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
}

@media (min-width: 640px) {
    .vc-features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 960px) {
    .vc-features-grid { grid-template-columns: repeat(3, 1fr); }
}

.vc-feature {
    padding: 1.5rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.75rem;
    background: var(--vc-color-bg);
    transition: border-color 120ms, transform 120ms;
}
.vc-feature:hover {
    border-color: var(--vc-color-primary-500);
    transform: translateY(-2px);
}

.vc-feature-icon {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    line-height: 1;
}

.vc-feature-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
}

.vc-feature-detail {
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--vc-color-fg-muted);
    margin: 0;
}
</style>
