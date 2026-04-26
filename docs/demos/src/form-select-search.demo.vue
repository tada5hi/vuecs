<script setup lang="ts">
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref<string | number | null>(null);

const options: FormSelectOption[] = [];
for (let i = 1; i <= 100; i++) {
    options.push({ id: i, value: `Option ${i}` });
}
</script>

<template>
    <div style="max-width: 24rem;">
        <VCFormSelectSearch
            v-model="value"
            :options="options"
        />
    </div>
</template>
