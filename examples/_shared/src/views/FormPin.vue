<script setup lang="ts">
import { VCFormPin } from '@vuecs/forms';
import { ref } from 'vue';

const code = ref<string[]>([]);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <VCFormPin
            v-model="code"
            :length="6"
            type="number"
            otp
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>code = [{{ code.join(', ') }}]</code>
        </p>
    </div>
</template>
