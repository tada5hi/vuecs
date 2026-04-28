<script setup lang="ts">
import type { FormOption } from '@vuecs/forms';
import { VCFormSelectSearch } from '@vuecs/forms';
import { ref } from 'vue';

// Initializing modelValue as an array puts the component in multi-select
// mode — there is no separate `multiple` prop. With FormOption shape the
// component now emits an array of `value` (your bound type T), not whole
// option objects.
const values = ref<number[]>([]);

const options: FormOption<number>[] = [];
for (let i = 1; i <= 50; i++) {
    options.push({ value: i, label: `Option ${i}` });
}
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <VCFormSelectSearch
            v-model="values"
            :options="options"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Selected: <code>{{ values.join(', ') || '(none)' }}</code>
        </p>
    </div>
</template>
