<script setup lang="ts">
import { VCFormInput } from '@vuecs/forms';
import { ref } from 'vue';

withDefaults(defineProps<{
    disabled?: boolean;
    placeholder?: string;
    themeVariant?: Record<string, string | boolean>;
}>(), {
    disabled: false,
    placeholder: 'Enter your email',
    themeVariant: () => ({}),
});

const value = ref('');
const amount = ref('');
const username = ref('');
const website = ref('');
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <VCFormInput
            v-model="value"
            :disabled="disabled"
            :placeholder="placeholder"
            :theme-variant="themeVariant"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>{{ value || '(empty)' }}</code>
        </p>

        <VCFormInput
            v-model="amount"
            type="number"
            placeholder="0.00"
            group-prepend
            group-prepend-content="$"
            group-append
            group-append-content=".00"
            :theme-variant="themeVariant"
        />
        <VCFormInput
            v-model="username"
            placeholder="username"
            group-prepend
            group-prepend-content="@"
            :theme-variant="themeVariant"
        />
        <VCFormInput
            v-model="website"
            placeholder="example.com"
            group-prepend
            group-prepend-content="https://"
            group-append
            group-append-content=".dev"
            :theme-variant="themeVariant"
        />
    </div>
</template>
