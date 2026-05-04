<script setup lang="ts">
import { VCTag, VCTags } from '@vuecs/elements';
import { computed, ref } from 'vue';
import { variantState } from './iframe-bridge';

const tags = ref([
    { value: 'vue', label: 'Vue' },
    { value: 'reka', label: 'Reka UI' },
    { value: 'tailwind', label: 'Tailwind' },
]);

// VCTags exposes a top-level `size` prop that forwards to each chip;
// pull the value from variantState rather than passing themeVariant
// (themeVariant.size on Tags only scales the wrapper gap, not the
// children's chip size).
const tagSize = computed(() => variantState.value.size as 'sm' | 'md' | 'lg' | undefined);

function remove(value: string | number | undefined) {
    tags.value = tags.value.filter((t) => t.value !== value);
}
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCTag
                value="static"
                label="Static chip"
                :size="tagSize"
            />
            <VCTag
                value="removable"
                label="Removable"
                removable
                :size="tagSize"
            />
        </div>
        <VCTags
            :items="tags"
            :size="tagSize"
            :theme-variant="variantState"
            removable
            @remove="remove"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>[{{ tags.map((t) => t.value).join(', ') }}]</code>
        </p>
    </div>
</template>
