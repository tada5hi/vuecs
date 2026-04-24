<!--
  - Copyright (c) 2022-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { defineComponent } from 'vue';
import ExampleList from '../../components/ExampleList.vue';

export default defineComponent({ components: { ExampleList } });
</script>
<template>
    <ExampleList>
        <template #itemActions="props">
            <div class="flex flex-row gap-1">
                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    @click.prevent="props.updated({name: 'foo'})"
                >
                    <i class="fa fa-refresh" />
                </button>
                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-md bg-gray-800 px-2 py-1 text-xs text-white hover:bg-gray-700"
                    @click.prevent="props.deleted()"
                >
                    <i class="fa fa-trash" />
                </button>
            </div>
        </template>
        <template #footer="props">
            <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-2.5 py-1 text-xs text-white hover:bg-gray-700"
                @click.prevent="props.created({
                    id: Math.ceil(Math.random() * 100),
                    name: 'Max'
                })"
            >
                Create <i class="fa fa-plus" />
            </button>
        </template>
    </ExampleList>
</template>
