<script setup lang="ts">
import {
    VCList,
    VCListBody,
    VCListEmpty,
    VCListItem,
    VCListLoading,
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

const selected = ref<Array<string | number>>([]);

function remove(id: number): void {
    data.value = data.value.filter((row) => row.id !== id);
    selected.value = selected.value.filter((k) => k !== id);
}
</script>

<template>
    <div style="max-width: 28rem;">
        <VCList
            v-model:selection="selected"
            :data="data"
            selection-mode="multi"
            :theme-variant="themeVariant"
        >
            <template #default="{ classes }">
                <header :class="classes.header">
                    <strong>Fruit basket</strong>
                </header>

                <VCListBody>
                    <template #item="{ data: item }">
                        <VCListItem
                            :data="item"
                            :selectable="true"
                            :theme-variant="themeVariant"
                        >
                            <template #default="{ classes: itemClasses }">
                                <span :class="itemClasses.text">
                                    <span style="font-weight: 500;">{{ item.name }}</span>
                                    <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                                        {{ item.stock }} in stock
                                    </span>
                                </span>
                                <span :class="itemClasses.actions">
                                    <button
                                        type="button"
                                        class="vc-demo-btn"
                                        @click="remove(item.id)"
                                    >
                                        Remove
                                    </button>
                                </span>
                            </template>
                        </VCListItem>
                    </template>
                </VCListBody>

                <VCListEmpty>
                    Nothing left — add some fruit.
                </VCListEmpty>

                <VCListLoading>Loading…</VCListLoading>

                <footer
                    :class="classes.footer"
                    style="font-size: 0.75rem; color: var(--vc-color-fg-muted);"
                >
                    {{ data.length }} item{{ data.length === 1 ? '' : 's' }}
                    <template v-if="selected.length">
                        · {{ selected.length }} selected
                    </template>
                </footer>
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
