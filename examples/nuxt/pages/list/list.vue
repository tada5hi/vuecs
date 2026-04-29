<script lang="ts">
import { VCList, VCListItem } from '@vuecs/list';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    components: { VCList, VCListItem },
    setup() {
        const items = ref<{ id: number; name: string }[]>([
            { id: 1, name: 'ABC' },
            { id: 2, name: 'DEF' },
        ]);
        return { items };
    },
});
</script>

<template>
    <VCList :data="items">
        <template #item="{ data }">
            <VCListItem :data="data">
                <template #text>
                    {{ data.name }}
                </template>
            </VCListItem>
        </template>
    </VCList>
</template>
