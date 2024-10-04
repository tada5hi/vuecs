<!--
  - Copyright (c) 2022-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { defineComponent } from 'vue';
import ExampleList from '../../components/ExampleList.vue';

export default defineComponent({
    components: { ExampleList },
});
</script>
<template>
    <ExampleList>
        <template #itemActions="props">
            <div class="d-flex flex-row gap-1">
                <div>
                    <button
                        class="btn btn-xs btn-primary"
                        @click.prevent="props.updated({name: 'foo'})"
                    >
                        <i class="fa fa-refresh" />
                    </button>
                </div>
                <div>
                    <button
                        class="btn btn-xs btn-dark"
                        @click.prevent="props.deleted()"
                    >
                        <i class="fa fa-trash" />
                    </button>
                </div>
            </div>
        </template>
        <template #footer="props">
            <button
                class="btn btn-xs btn-dark"
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
