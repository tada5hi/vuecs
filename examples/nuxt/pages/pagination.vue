<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { type PaginationMetaInput, VCPagination } from '@vuecs/pagination';
import { ref } from '#imports';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCPagination,
    },
    setup() {
        const items = [];

        for (let i = 0; i < 100; i++) {
            items.push({
                name: `Item #${i}`,
            });
        }

        const meta = ref<PaginationMetaInput>({
            total: items.length,
            offset: 0,
            limit: 10,
        });

        const data = ref(items.slice(0, 10));

        const load = (temp: Record<string, any>) => {
            meta.value.offset = temp.offset;
            data.value = items.slice(meta.value.offset, meta.value.offset + 10);
        };

        return {
            meta,
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
            <VCPagination
                :meta="meta"
                @load="load"
            />
        </div>
    </div>
</template>
