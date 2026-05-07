<script setup lang="ts">
import {
    VCList,
    VCListItem,
    VCListItemActions,
    VCListItemText,
} from '@vuecs/list';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

type Fruit = {
    id: number;
    name: string;
    stock: number;
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
            :theme-variant="themeVariant"
        >
            <template #item="{ data: item }">
                <VCListItem
                    :data="item"
                    :theme-variant="themeVariant"
                >
                    <VCListItemText>
                        <span style="font-weight: 500;">{{ item.name }}</span>
                        <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                            {{ item.stock }} in stock
                        </span>
                    </VCListItemText>
                    <VCListItemActions>
                        <button
                            type="button"
                            class="vc-demo-btn"
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

<style scoped>
.vc-demo-btn {
    border-radius: 0.375rem;
    border: 1px solid var(--vc-color-border);
    background-color: var(--vc-color-bg);
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
}
.vc-demo-btn:hover {
    background-color: var(--vc-color-bg-muted);
}
</style>
