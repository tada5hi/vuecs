<script setup lang="ts">
import type { FormOption } from '@vuecs/forms';
import { VCFormSelectSearch } from '@vuecs/forms';
import { ref } from 'vue';

const value = ref<number | null | undefined>(undefined);

const options: FormOption<number>[] = [];
for (let i = 1; i <= 100; i++) {
    options.push({
        value: i,
        label: `Option ${i}`,
        description: i % 5 === 0 ? 'Multiple of 5' : undefined,
    });
}
</script>

<template>
    <div style="max-width: 24rem;">
        <VCFormSelectSearch
            v-model="value"
            :options="options"
            placeholder="Type to search…"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0.5rem 0 0;">
            Bound: <code>value={{ value }}</code>
        </p>
    </div>
</template>
