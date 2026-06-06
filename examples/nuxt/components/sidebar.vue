<script lang="ts">
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationResolverContext } from '@vuecs/navigation';
import { defineNuxtComponent } from '#app';
import { sideItemsFor } from '~/config/layout';

export default defineNuxtComponent({
    components: { VCNavItems },
    setup() {
        // Dependent nav: derive this call site's OWN item list by keying
        // off the header nav's published active section (registry id
        // `top`). It never borrows the header's `.children` subtree.
        const sideResolver = ({ registry }: NavigationResolverContext) =>
            sideItemsFor(registry('top').activeTrail.value[0]?.name);

        return { sideResolver };
    },
});
</script>

<template>
    <aside class="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-bg">
        <VCNavItems
            class="py-3 pl-3 pr-0"
            :resolver="sideResolver"
        />
    </aside>
</template>
