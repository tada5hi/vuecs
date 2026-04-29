<script lang="ts">
import { defineComponent } from 'vue';
import { VCListItem } from '@vuecs/list';
import ExampleList from '../../components/ExampleList.vue';

export default defineComponent({ components: { ExampleList, VCListItem } });
</script>

<template>
    <ExampleList>
        <template #item="{ data, updated, deleted }">
            <VCListItem :data="data">
                <template #text>
                    {{ data.name }}
                </template>
                <template #actions>
                    <div class="flex flex-row gap-1">
                        <button
                            type="button"
                            aria-label="Update item"
                            title="Update item"
                            class="inline-flex items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                            @click.prevent="updated({ id: data.id, name: 'foo' })"
                        >
                            <i class="fa fa-refresh" />
                        </button>
                        <button
                            type="button"
                            aria-label="Delete item"
                            title="Delete item"
                            class="inline-flex items-center justify-center rounded-md bg-neutral-800 px-2 py-1 text-xs text-white"
                            @click.prevent="deleted(data)"
                        >
                            <i class="fa fa-trash" />
                        </button>
                    </div>
                </template>
            </VCListItem>
        </template>
        <template #footer="{ created }">
            <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md bg-neutral-800 px-2.5 py-1 text-xs text-white hover:bg-neutral-700"
                @click.prevent="created({
                    id: Math.ceil(Math.random() * 100),
                    name: 'Max'
                })"
            >
                Create <i class="fa fa-plus" />
            </button>
        </template>
    </ExampleList>
</template>
