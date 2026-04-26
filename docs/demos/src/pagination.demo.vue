<script setup lang="ts">
import { VCPagination } from '@vuecs/pagination';
import { ref } from 'vue';

const meta = ref({
    total: 100,
    offset: 0,
    limit: 10,
});

const load = (next: { offset: number }) => {
    meta.value.offset = next.offset;
};
</script>

<template>
    <VCPagination
        :total="meta.total"
        :offset="meta.offset"
        :limit="meta.limit"
        @load="load"
    />
</template>
