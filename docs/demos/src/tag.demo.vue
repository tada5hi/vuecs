<script setup lang="ts">
import { VCTag, VCTagList } from '@vuecs/elements';
import { ref } from 'vue';

const tags = ref([
    { value: 'vue', label: 'Vue' },
    { value: 'reka', label: 'Reka UI' },
    { value: 'tailwind', label: 'Tailwind' },
]);

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
            />
            <VCTag
                value="removable"
                label="Removable"
                removable
            />
        </div>
        <VCTagList
            :items="tags"
            removable
            @remove="remove"
        />
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>[{{ tags.map((t) => t.value).join(', ') }}]</code>
        </p>
    </div>
</template>
