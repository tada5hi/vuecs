<script setup lang="ts">
import { VCFormSwitch } from '@vuecs/forms';
import { ref } from 'vue';

const notifications = ref(true);
const dnd = ref(false);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <!--
          Reka renders a real <button role="switch"> with
          `data-state="checked|unchecked"`. The thumb slides via a CSS
          transform driven by the data-state attribute — no JS animation.
        -->
        <VCFormSwitch
            v-model="notifications"
            label-content="Enable notifications"
        />
        <VCFormSwitch
            v-model="dnd"
            label-content="Do not disturb"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>notifications={{ notifications }}, dnd={{ dnd }}</code>
        </p>
    </div>
</template>
