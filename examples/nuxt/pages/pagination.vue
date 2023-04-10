<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { Pagination } from '@vue-layout/pagination';
import { ref } from '#imports';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        Pagination,
    },
    setup() {
        const items = [];

        for (let i = 0; i < 100; i++) {
            items.push({
                name: `Item #${i}`,
            });
        }

        const offset = ref(0);

        const data = ref(items.slice(0, 10));

        const load = (meta: Record<string, any>) => {
            offset.value = meta.offset;
            data.value = items.slice(offset.value, offset.value + 10);
        };

        return {
            limit: 10,
            total: items.length,
            offset,
            load,
            data,
        };
    },
});
</script>
<template>
    <div class="container">
        <h3><i class="fa fa-solid fa-road" /> Pagination</h3>

        <ul class="mt-2 mb-2">
            <li
                v-for="(item, key) in data"
                :key="key"
            >
                {{ item.name }}
            </li>
        </ul>
        <div class="mt-3 text-center">
            <pagination
                :total="total"
                :limit="limit"
                :offset="offset"
                @load="load"
            />
        </div>
    </div>
</template>
