<script setup lang="ts">
import { VCFormInputCheckbox } from '@vuecs/form-controls';
import { ref } from 'vue';

const accepted = ref(false);
const notifications = ref(true);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <!--
          The label text is set via `:label-content` (or the named `#label`
          slot). VCFormInputCheckbox does not render a default slot —
          children passed there are silently dropped.
        -->
        <VCFormInputCheckbox
            v-model="accepted"
            label-content="I accept the terms"
        />
        <VCFormInputCheckbox
            v-model="notifications"
            label-content="Enable notifications"
            :theme-variant="{ variant: 'switch' }"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>accepted={{ accepted }}, notifications={{ notifications }}</code>
        </p>
    </div>
</template>
