<script setup lang="ts">
import { VCList, VCListItem } from '@vuecs/list';
import { ref } from 'vue';

const data = ref([
    { id: 1, name: 'Apples' },
    { id: 2, name: 'Oranges' },
    { id: 3, name: 'Pears' },
]);
</script>

<template>
    <div style="max-width: 28rem;">
        <VCList :data="data">
            <template #item="{ data: item }">
                <VCListItem :data="item">
                    <template #text>
                        {{ item.name }}
                    </template>
                </VCListItem>
            </template>
        </VCList>
    </div>
</template>
