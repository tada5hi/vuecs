<script lang="ts">
import { VCList, VCListItem, VCListItemText } from '@vuecs/list';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    components: {
        VCList, 
        VCListItem, 
        VCListItemText, 
    },
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
                <VCListItemText>
                    {{ data.name }}
                </VCListItemText>
            </VCListItem>
        </template>
    </VCList>
</template>
