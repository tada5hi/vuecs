<script lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
import { computed, defineAsyncComponent } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';

export default defineNuxtComponent({
    setup() {
        const route = useRoute();
        const name = computed(() => String(route.params.name ?? ''));
        const match = computed(() => sharedRoutes.find((r) => r.name === name.value));

        // Lazy-import the shared view via the route's view loader.
        // defineAsyncComponent gives us suspense + error boundaries
        // without spelling them out per route.
        const View = computed(() => match.value ?
            defineAsyncComponent(match.value.view) :
            null);

        return {
            name, 
            match, 
            View, 
        };
    },
});
</script>

<template>
    <div class="mx-auto max-w-5xl space-y-4">
        <h3 class="flex items-center gap-2 text-2xl font-semibold">
            <VCIcon
                name="fa6-solid:cube"
                class="text-primary-500"
            />
            <span>{{ match?.label ?? name }}</span>
            <span class="text-sm font-normal text-fg-muted">
                /components/{{ name }}
            </span>
        </h3>
        <div
            v-if="View"
            class="rounded-md border border-border bg-bg p-4"
        >
            <component :is="View" />
        </div>
        <div
            v-else
            class="rounded-md border border-warning-500 bg-warning-50 p-4 text-sm text-warning-900 dark:bg-warning-950 dark:text-warning-100"
        >
            No shared view registered for <code>{{ name }}</code>.
        </div>
    </div>
</template>
