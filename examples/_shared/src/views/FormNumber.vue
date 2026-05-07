<script setup lang="ts">
import { VCFormNumber } from '@vuecs/forms';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const quantity = ref<number>(1);
const price = ref<number>(19.99);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">Quantity (0–99, step 1)</span>
            <VCFormNumber
                v-model="quantity"
                :min="0"
                :max="99"
                :step="1"
                :theme-variant="themeVariant"
            />
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">Price (USD currency formatting)</span>
            <VCFormNumber
                v-model="price"
                :min="0"
                :step="0.01"
                :format-options="{ style: 'currency', currency: 'USD' }"
                :theme-variant="themeVariant"
            />
        </div>

        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>quantity={{ quantity }}, price={{ price }}</code>
        </p>
    </div>
</template>
