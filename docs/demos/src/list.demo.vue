<script setup lang="ts">
import {
    VCList,
    VCListItem,
    VCListItemActions,
    VCListItemText,
} from '@vuecs/list';
import { ref } from 'vue';
import { variantState } from './iframe-bridge';

type Fruit = {
    id: number; 
    name: string; 
    stock: number 
};

const data = ref<Fruit[]>([
    {
        id: 1, 
        name: 'Apples', 
        stock: 12, 
    },
    {
        id: 2, 
        name: 'Oranges', 
        stock: 5, 
    },
    {
        id: 3, 
        name: 'Pears', 
        stock: 8, 
    },
]);

function remove(id: number): void {
    data.value = data.value.filter((row) => row.id !== id);
}
</script>

<template>
    <div style="max-width: 28rem;">
        <VCList
            :data="data"
            :theme-variant="variantState"
        >
            <template #item="{ data: item }">
                <VCListItem
                    :data="item"
                    :theme-variant="variantState"
                >
                    <VCListItemText>
                        <span class="font-medium">{{ item.name }}</span>
                        <span class="text-xs text-fg-muted">
                            {{ item.stock }} in stock
                        </span>
                    </VCListItemText>
                    <VCListItemActions>
                        <button
                            type="button"
                            class="rounded-md border border-border bg-bg px-2 py-1 text-xs hover:bg-bg-muted"
                            @click="remove(item.id)"
                        >
                            Remove
                        </button>
                    </VCListItemActions>
                </VCListItem>
            </template>
            <template #empty>
                Nothing left — add some fruit.
            </template>
        </VCList>
    </div>
</template>
