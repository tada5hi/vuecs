<script setup lang="ts">
import { usePalette } from '@vuecs/design';
import {
    VCModal,
    VCModalClose,
    VCModalContent,
    VCModalDescription,
    VCModalTitle,
    VCModalTrigger,
} from '@vuecs/overlays';
import { useData } from 'vitepress';
import { computed, ref } from 'vue';
import {
    NEUTRAL_PALETTES,
    type NeutralPalette,
    PRIMARY_PALETTES,
    type PrimaryPalette,
} from '../palette-options';

const open = ref(false);
const { isDark } = useData();
const { current, extend } = usePalette();

const primary = computed<PrimaryPalette>({
    get: () => (current.value.primary as PrimaryPalette) ?? 'blue',
    set: (value) => extend({ primary: value }),
});
const neutral = computed<NeutralPalette>({
    get: () => (current.value.neutral as NeutralPalette) ?? 'neutral',
    set: (value) => extend({ neutral: value }),
});

// SVG path data is opaque — splitting it visually doesn't aid readability.
 
const cogIconPath = 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z';
</script>

<template>
    <VCModal v-model:open="open">
        <VCModalTrigger
            class="vc-settings-trigger"
            aria-label="Open appearance settings"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path :d="cogIconPath" />
                <circle
                    cx="12"
                    cy="12"
                    r="3"
                />
            </svg>
        </VCModalTrigger>
        <VCModalContent>
            <VCModalClose />
            <VCModalTitle>Appearance</VCModalTitle>
            <VCModalDescription>
                Customise the docs preview palette and color mode.
            </VCModalDescription>
            <div class="vc-settings-body">
                <label class="vc-settings-field">
                    <span class="vc-settings-label">Primary palette</span>
                    <select
                        v-model="primary"
                        class="vc-settings-select"
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
                <label class="vc-settings-field">
                    <span class="vc-settings-label">Neutral palette</span>
                    <select
                        v-model="neutral"
                        class="vc-settings-select"
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
                <hr class="vc-settings-divider">
                <div class="vc-settings-row">
                    <span class="vc-settings-label">Color mode</span>
                    <div
                        class="vc-settings-segment"
                        role="group"
                        aria-label="Color mode"
                    >
                        <button
                            type="button"
                            class="vc-settings-segment-btn"
                            :class="{ 'vc-settings-segment-btn--active': !isDark }"
                            :aria-pressed="!isDark"
                            @click="isDark = false"
                        >
                            Light
                        </button>
                        <button
                            type="button"
                            class="vc-settings-segment-btn"
                            :class="{ 'vc-settings-segment-btn--active': isDark }"
                            :aria-pressed="isDark"
                            @click="isDark = true"
                        >
                            Dark
                        </button>
                    </div>
                </div>
            </div>
            <div class="vc-settings-footer">
                <button
                    type="button"
                    class="vc-settings-close-btn"
                    @click="open = false"
                >
                    Close
                </button>
            </div>
        </VCModalContent>
    </VCModal>
</template>

<style scoped>
/* Trigger button lives inside this component's DOM, so scoped styles
   apply normally. Modal contents portal to <body> and need an
   unscoped block (below). */
.vc-settings-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-left: 4px;
    color: var(--vp-c-text-1);
    background: transparent;
    border-radius: 50%;
    transition: color 0.25s, background-color 0.25s;
}

.vc-settings-trigger:hover {
    color: var(--vp-c-brand-1);
    background-color: var(--vp-c-default-soft);
}

.vc-settings-trigger:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
}

@media (max-width: 768px) {
    .vc-settings-trigger { display: none; }
}
</style>

<!-- Modal content portals out of this component's DOM (DialogPortal ->
     <body>), so Vue's scoped data-attribute does not reach those nodes.
     The block below is intentionally unscoped; the `vc-settings-*` class
     prefix keeps selectors out of VitePress's chrome. -->
<style>
.vc-settings-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0.5rem;
}

.vc-settings-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    font-size: 0.875rem;
}

.vc-settings-label {
    font-weight: 500;
    color: var(--vc-color-fg);
}

.vc-settings-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--vc-color-fg);
    background-color: var(--vc-color-bg);
    border: 1px solid var(--vc-color-border);
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
    appearance: auto;
}

.vc-settings-select:focus {
    outline: none;
    border-color: var(--vc-color-primary-500);
    box-shadow: 0 0 0 1px var(--vc-color-primary-500);
}

.vc-settings-divider {
    margin: 0.25rem 0;
    border: 0;
    border-top: 1px solid var(--vc-color-border);
}

.vc-settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.875rem;
}

.vc-settings-segment {
    display: inline-flex;
    padding: 0.125rem;
    background-color: var(--vc-color-bg);
    border: 1px solid var(--vc-color-border);
    border-radius: 0.375rem;
}

.vc-settings-segment-btn {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--vc-color-fg-muted);
    background-color: transparent;
    border: 0;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
}

.vc-settings-segment-btn:hover {
    color: var(--vc-color-fg);
}

.vc-settings-segment-btn--active {
    color: var(--vc-color-on-primary);
    background-color: var(--vc-color-primary-600);
}

.vc-settings-segment-btn--active:hover {
    color: var(--vc-color-on-primary);
}

.vc-settings-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5rem;
}

.vc-settings-close-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--vc-color-fg);
    background-color: var(--vc-color-bg);
    border: 1px solid var(--vc-color-border);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.15s;
}

.vc-settings-close-btn:hover {
    background-color: var(--vc-color-bg-muted);
}
</style>
