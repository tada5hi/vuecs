<script setup lang="ts">
import { VCFormTags } from '@vuecs/forms';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const tags = ref<string[]>(['vue', 'reka', 'tailwind']);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <VCFormTags
            v-model="tags"
            placeholder="Add a tag…"
            add-on-paste
            :theme-variant="themeVariant"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>[{{ tags.join(', ') }}]</code>
        </p>
    </div>
</template>
