<script setup lang="ts">
import { VCFormRangeMultiSlider } from '@vuecs/form-controls';
import { ref } from 'vue';

const range = ref<{ min: number; max: number } | null>(null);

const onChange = (next: { min: number; max: number }) => {
    range.value = next;
};
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem;">
        <!-- Slider mounts via onMounted; render client-side only. -->
        <ClientOnly>
            <VCFormRangeMultiSlider
                :min="0"
                :max="100"
                @change="onChange"
            />
        </ClientOnly>
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Selected: <code>{{ range ?? '(drag a thumb)' }}</code>
        </p>
    </div>
</template>
