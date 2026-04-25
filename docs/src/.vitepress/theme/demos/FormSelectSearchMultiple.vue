<script setup lang="ts">
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import { computed, ref } from 'vue';

// Initializing the bound value as an array switches the component into
// multi-select mode — there is no separate `multiple` prop. The shape of
// `modelValue` is what determines single vs multi. The component pushes
// the full `FormSelectOption` object (not just the id) onto the array.
const values = ref<FormSelectOption[]>([]);

const options: FormSelectOption[] = [];
for (let i = 1; i <= 50; i++) {
    options.push({ id: i, value: `Option ${i}` });
}

const summary = computed(() => values.value.map((v) => v.value).join(', '));
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <VCFormSelectSearch
            v-model="values"
            :options="options"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Selected: <code>{{ summary || '(none)' }}</code>
        </p>
    </div>
</template>
