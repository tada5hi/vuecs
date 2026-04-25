<script setup lang="ts">
import { VCFormSelect } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref<string | number | null>(null);

// VCFormSelect's option schema is `{ id, value }` where `id` is the bound
// selectable value and `value` is the display label — inverted from typical
// HTML <option> conventions, so easy to misread when copy-pasting.
const options = [
    { id: 'sm', value: 'Small' },
    { id: 'md', value: 'Medium' },
    { id: 'lg', value: 'Large' },
];
</script>

<template>
    <div style="max-width: 16rem;">
        <VCFormSelect
            v-model="value"
            :options="options"
        />
    </div>
</template>
