<script setup lang="ts">
import { VCPagination } from '@vuecs/pagination';
import { ref } from 'vue';
import { propState } from './iframe-bridge';

const offset = ref(0);

const load = (next: { offset: number }) => {
    offset.value = next.offset;
};
</script>

<template>
    <!--
      `v-bind="propState"` spreads every announced prop — `total`, `limit`,
      `busy`, `hideDisabled`, `themeVariant` (nested from `themeVariant.*`
      paths in the catalog). The local `offset` ref overrides the catalog's
      offset so the user-driven page change isn't clobbered by toolbar
      state on each tick.
    -->
    <VCPagination
        v-bind="propState"
        :offset="offset"
        @load="load"
    />
</template>
