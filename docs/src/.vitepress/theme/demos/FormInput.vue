<script setup lang="ts">
import { VCFormInput } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <VCFormInput
            v-model="value"
            placeholder="Enter your email"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>{{ value || '(empty)' }}</code>
        </p>
    </div>
</template>
