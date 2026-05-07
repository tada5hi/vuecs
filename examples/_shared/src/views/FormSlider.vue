<script setup lang="ts">
import { VCFormSlider } from '@vuecs/forms';
import { ref } from 'vue';

// Single-value slider — modelValue: number.
const volume = ref<number>(40);
// Range slider — modelValue: number[]. Same component, the array shape
// determines thumb count.
const range = ref<number[]>([20, 80]);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 28rem;">
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                Single — <code>v-model="volume"</code>
            </span>
            <VCFormSlider
                v-model="volume"
                :min="0"
                :max="100"
            />
            <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
                volume = <code>{{ volume }}</code>
            </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                Range — <code>v-model="range"</code> (array → multi-thumb)
            </span>
            <VCFormSlider
                v-model="range"
                :min="0"
                :max="100"
            />
            <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
                range = <code>[{{ range[0] }}, {{ range[1] }}]</code>
            </p>
        </div>
    </div>
</template>
