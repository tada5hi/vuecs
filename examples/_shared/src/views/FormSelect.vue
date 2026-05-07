<script setup lang="ts">
import { VCFormSelect } from '@vuecs/forms';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const value = ref<string | undefined>(undefined);
const region = ref<string | undefined>(undefined);

// FormOption shape: `{ value, label }`. `value` flows through v-model;
// `label` is the display string (matches HTML <option value=…>label</option>
// and every form-library convention).
const sizes = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
];

// Grouped options — flat array of FormOption | FormOptionGroup. Renders as
// HTML <optgroup label="…">.
const regions = [
    {
        label: 'Americas',
        options: [
            { value: 'us', label: 'United States' },
            { value: 'br', label: 'Brazil' },
        ],
    },
    {
        label: 'Europe',
        options: [
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
        ],
    },
];
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 20rem;">
        <VCFormSelect
            v-model="value"
            :options="sizes"
            placeholder="-- Pick a size --"
            :theme-variant="themeVariant"
        />
        <VCFormSelect
            v-model="region"
            :options="regions"
            placeholder="-- Pick a region --"
            :theme-variant="themeVariant"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>size={{ value }}, region={{ region }}</code>
        </p>
    </div>
</template>
