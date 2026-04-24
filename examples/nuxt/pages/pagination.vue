<script lang="ts">
import { VCPagination } from '@vuecs/pagination';
import { ref } from '#imports';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: { VCPagination },
    setup() {
        const items = [];

        for (let i = 0; i < 100; i++) {
            items.push({ name: `Item #${i}` });
        }

        const meta = ref({
            total: items.length,
            offset: 0,
            limit: 10,
        });

        const data = ref(items.slice(0, 10));

        const load = (temp: Record<string, number>) => {
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
    <div class="mx-auto max-w-5xl space-y-4">
        <h3 class="flex items-center gap-2 text-2xl font-semibold">
            <i class="fa fa-solid fa-road text-blue-500" /> Pagination
        </h3>
        <ul class="list-disc space-y-1 pl-6">
            <li
                v-for="(item, key) in data"
                :key="key"
            >
                {{ item.name }}
            </li>
        </ul>
        <div class="flex justify-center pt-4">
            <VCPagination
                v-bind="meta"
                @load="load"
            />
        </div>
    </div>
</template>
