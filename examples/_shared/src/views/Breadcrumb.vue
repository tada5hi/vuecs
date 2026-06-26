<script setup lang="ts">
import {
    VCBreadcrumb,
    VCBreadcrumbItem,
    VCBreadcrumbLink,
    VCBreadcrumbList,
    VCBreadcrumbPage,
    VCBreadcrumbSeparator,
} from '@vuecs/navigation';
import type { BreadcrumbItem } from '@vuecs/navigation';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

// The `:items` driver. The last crumb (no `to`/`href`) is treated as the
// current page automatically — `aria-current="page"` + non-navigable.
const items: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Robots', to: '/robots' },
    { label: 'Settings' },
];

// Crumbs with leading icons. The icon name resolves through `<VCIcon>` when
// an icon preset is installed (the example apps register one).
const iconItems: BreadcrumbItem[] = [
    {
        label: 'Home', 
        to: '/', 
        icon: 'fa6-solid:house', 
    },
    {
        label: 'Robots', 
        to: '/robots', 
        icon: 'fa6-solid:robot', 
    },
    { label: 'Settings', icon: 'fa6-solid:gear' },
];

// A long trail. With `:max-items="3"` the middle crumbs collapse behind an
// ellipsis (`itemsBeforeCollapse` / `itemsAfterCollapse` default to 1 each).
const longItems: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Workspace', to: '/workspace' },
    { label: 'Projects', to: '/workspace/projects' },
    { label: 'Robots', to: '/workspace/projects/robots' },
    { label: 'R2-D2', to: '/workspace/projects/robots/r2-d2' },
    { label: 'Settings' },
];
</script>

<template>
    <div class="vc-demo-stack">
        <section>
            <h3 class="vc-demo-h">
                Driver — last crumb is the current page
            </h3>
            <VCBreadcrumb
                :items="items"
                :theme-variant="themeVariant"
            />
        </section>

        <section>
            <h3 class="vc-demo-h">
                With leading icons
            </h3>
            <VCBreadcrumb
                :items="iconItems"
                :theme-variant="themeVariant"
            />
        </section>

        <section>
            <h3 class="vc-demo-h">
                Long trail — collapsed with <code>:max-items="3"</code>
            </h3>
            <VCBreadcrumb
                :items="longItems"
                :max-items="3"
                :theme-variant="themeVariant"
            />
        </section>

        <section>
            <h3 class="vc-demo-h">
                Manual compound — parts by hand
            </h3>
            <VCBreadcrumb :theme-variant="themeVariant">
                <VCBreadcrumbList>
                    <VCBreadcrumbItem>
                        <VCBreadcrumbLink to="/">
                            Home
                        </VCBreadcrumbLink>
                    </VCBreadcrumbItem>
                    <VCBreadcrumbSeparator />
                    <VCBreadcrumbItem>
                        <VCBreadcrumbLink to="/robots">
                            Robots
                        </VCBreadcrumbLink>
                    </VCBreadcrumbItem>
                    <VCBreadcrumbSeparator />
                    <VCBreadcrumbItem>
                        <VCBreadcrumbPage current>
                            Settings
                        </VCBreadcrumbPage>
                    </VCBreadcrumbItem>
                </VCBreadcrumbList>
            </VCBreadcrumb>
        </section>
    </div>
</template>

<style scoped>
.vc-demo-stack {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 36rem;
}
.vc-demo-h {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: var(--vc-color-fg-muted);
}
</style>
