<script setup lang="ts">
import { VCPagination } from '@vuecs/pagination';
import { ref } from 'vue';

withDefaults(defineProps<{
    total?: number;
    limit?: number;
    busy?: boolean;
    hideDisabled?: boolean;
    withText?: boolean;
    themeVariant?: Record<string, string | boolean>;
}>(), {
    total: 100,
    limit: 10,
    busy: false,
    hideDisabled: true,
    withText: false,
    themeVariant: () => ({}),
});

const offset = ref(0);

const load = (next: { offset: number }) => {
    offset.value = next.offset;
};
</script>

<template>
    <!--
      The local `offset` ref overrides whatever is passed via props so the
      user-driven page change isn't clobbered when the toolbar updates
      other props on each tick.
    -->
    <VCPagination
        :total="total"
        :limit="limit"
        :busy="busy"
        :hide-disabled="hideDisabled"
        :with-text="withText"
        :theme-variant="themeVariant"
        :offset="offset"
        @load="load"
    />
</template>
