<script setup lang="ts">
import { VCFormRadio, VCFormRadioGroup } from '@vuecs/forms';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
    segmented?: boolean;
}>();

const size = ref<string>('md');
const region = ref<string | undefined>(undefined);
const view = ref<string>('list');
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">Compound children</span>
            <VCFormRadioGroup
                v-model="size"
                :segmented="segmented"
                aria-label="Size"
            >
                <VCFormRadio
                    value="sm"
                    label-content="Small"
                    :theme-variant="themeVariant"
                />
                <VCFormRadio
                    value="md"
                    label-content="Medium"
                    :theme-variant="themeVariant"
                />
                <VCFormRadio
                    value="lg"
                    label-content="Large"
                    :theme-variant="themeVariant"
                />
            </VCFormRadioGroup>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">Options shorthand</span>
            <VCFormRadioGroup
                v-model="region"
                :options="[
                    { value: 'us', label: 'United States' },
                    { value: 'eu', label: 'Europe' },
                    { value: 'apac', label: 'Asia-Pacific' },
                ]"
            />
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">Segmented</span>
            <VCFormRadioGroup
                v-model="view"
                segmented
                aria-label="View mode"
                :theme-variant="themeVariant"
                :options="[
                    { value: 'list', label: 'List' },
                    { value: 'grid', label: 'Grid' },
                    { value: 'table', label: 'Table', disabled: true },
                    { value: 'cards', label: 'Cards' },
                ]"
            />
        </div>

        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>size={{ size }}, region={{ region }}, view={{ view }}</code>
        </p>
    </div>
</template>
