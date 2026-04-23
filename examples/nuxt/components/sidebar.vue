<script lang="ts">
import { VCNavItems } from '@vuecs/navigation';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({ components: { VCNavItems } });
</script>

<template>
    <aside class="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
        <VCNavItems
            class="py-3 pl-3 pr-0"
            :level="1"
        />
    </aside>
</template>
