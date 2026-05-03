<script lang="ts">
import { defineComponent } from 'vue';
import { VCListItem, VCListItemActions, VCListItemText } from '@vuecs/list';
import ExampleList from '../../components/ExampleList.vue';

export default defineComponent({
    components: {
        ExampleList,
        VCListItem,
        VCListItemText,
        VCListItemActions,
    },
});
</script>

<template>
    <ExampleList>
        <template #item="{ data, update, delete: del }">
            <VCListItem :data="data">
                <VCListItemText>
                    {{ data.name }}
                </VCListItemText>
                <VCListItemActions>
                    <button
                        type="button"
                        aria-label="Update item"
                        title="Update item"
                        class="inline-flex items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                        @click.prevent="update({ id: data.id, name: 'foo' })"
                    >
                        <VCIcon name="fa6-solid:arrows-rotate" />
                    </button>
                    <button
                        type="button"
                        aria-label="Delete item"
                        title="Delete item"
                        class="inline-flex items-center justify-center rounded-md bg-neutral-800 px-2 py-1 text-xs text-white"
                        @click.prevent="del(data)"
                    >
                        <VCIcon name="fa6-solid:trash" />
                    </button>
                </VCListItemActions>
            </VCListItem>
        </template>
        <template #footer="{ create }">
            <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md bg-neutral-800 px-2.5 py-1 text-xs text-white hover:bg-neutral-700"
                @click.prevent="create({
                    id: Math.ceil(Math.random() * 100),
                    name: 'Max'
                })"
            >
                Create <VCIcon name="fa6-solid:plus" />
            </button>
        </template>
    </ExampleList>
</template>
