<script setup lang="ts">
import { usePalette } from '@vuecs/design';
import { computed } from 'vue';
import {
    NEUTRAL_PALETTES,
    type NeutralPalette,
    PRIMARY_PALETTES,
    type PrimaryPalette,
} from '../palette-options';

const { current, extend } = usePalette({ initial: { primary: 'blue', neutral: 'neutral' } });

// Writable computed proxies so `<select v-model>` keeps working — the
// shared `usePalette` exposes a read-only `current`; mutations go via
// `extend()` so each select touches only its own scale and preserves
// the other.
const primary = computed<PrimaryPalette>({
    get: () => (current.value.primary as PrimaryPalette) ?? 'blue',
    set: (value) => extend({ primary: value }),
});
const neutral = computed<NeutralPalette>({
    get: () => (current.value.neutral as NeutralPalette) ?? 'neutral',
    set: (value) => extend({ neutral: value }),
});
</script>

<template>
    <div class="vc-palette-switch">
        <label class="vc-palette-switch-label">
            <span class="vc-palette-switch-name">primary</span>
            <select
                v-model="primary"
                class="vc-palette-switch-select"
                aria-label="Primary palette"
            >
                <option
                    v-for="p in PRIMARY_PALETTES"
                    :key="p"
                    :value="p"
                >
                    {{ p }}
                </option>
            </select>
        </label>
        <label class="vc-palette-switch-label">
            <span class="vc-palette-switch-name">neutral</span>
            <select
                v-model="neutral"
                class="vc-palette-switch-select"
                aria-label="Neutral palette"
            >
                <option
                    v-for="p in NEUTRAL_PALETTES"
                    :key="p"
                    :value="p"
                >
                    {{ p }}
                </option>
            </select>
        </label>
    </div>
</template>

<style scoped>
/* Match VitePress's `.VPNavBarSocialLinks` primitives exactly:
   `display: flex` (block-level, NOT inline-flex — inline-level flex
   containers handle whitespace differently and collapse spacing
   subtly). No flex `gap` because `gap` would apply between every
   adjacent flex item including the `::before` pipe and produce
   asymmetric spacing (the pipe's `margin-right` compounds with
   container `gap`). Inter-label spacing is on the labels themselves. */
.vc-palette-switch {
    display: flex;
    align-items: center;
}

/* The pipe — symmetric 16px each side. Visually the github link's
   internal `(36-20)/2 = 8px` right-padding turned out to look more
   like 0 in practice (rendered icon size + browser metrics), so we
   compensate with explicit 16px margin-left. 16px on the right is
   needed regardless because our labels have no internal padding. */
.vc-palette-switch::before {
    content: "";
    width: 1px;
    height: 24px;
    margin-right: 16px;
    margin-left: 16px;
    background-color: var(--vp-c-divider);
}

.vc-palette-switch-label + .vc-palette-switch-label {
    margin-left: 0.5rem;
}

.vc-palette-switch-label {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
}

.vc-palette-switch-name {
    color: var(--vc-color-fg-muted);
    text-transform: lowercase;
}

.vc-palette-switch-select {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.25rem;
    background: var(--vc-color-bg);
    color: var(--vc-color-fg);
    cursor: pointer;
}

.vc-palette-switch-select:focus {
    outline: none;
    border-color: var(--vc-color-primary-500);
    box-shadow: 0 0 0 1px var(--vc-color-primary-500);
}

/* Hide on narrow screens so the navbar stays clean on mobile. The
   demos still render with the persisted palette; users on desktop
   change it. */
@media (max-width: 768px) {
    .vc-palette-switch { display: none; }
}
</style>
