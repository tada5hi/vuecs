<script setup lang="ts">
import { VCFormDateRange, fromDateInput } from '@vuecs/forms';
import type { DateRangeValue } from '@vuecs/forms';
import { computed, ref } from 'vue';

withDefaults(defineProps<{
    disabled?: boolean;
    presets?: boolean;
}>(), {
    disabled: false,
    presets: true,
});

const range = ref<DateRangeValue>({});

// What a list page would send to its API: UTC instants of the local
// start of `from` and end of `to`.
const query = computed(() => ({
    gte: fromDateInput(range.value.from, 'start'),
    lte: fromDateInput(range.value.to, 'end'),
}));
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 28rem;">
        <VCFormDateRange
            v-model="range"
            :disabled="disabled"
            :presets="presets ? undefined : []"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>{{ JSON.stringify(range) }}</code>
        </p>
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Query: <code>{{ JSON.stringify(query) }}</code>
        </p>
    </div>
</template>
