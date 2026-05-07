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
    </div>
</template>
