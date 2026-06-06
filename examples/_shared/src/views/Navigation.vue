<script setup lang="ts">
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationItem } from '@vuecs/navigation';
import { ref } from 'vue';

// Standalone usage — no registry needed. VCNavItems takes its items via the
// `:data` prop (here a plain array) + the current `path`, normalizes
// internally, scores each item against the path, and marks exactly one best
// match active. The index item ("/robots") no longer stays lit on the child
// route ("/robots/add") the way a prefix match would.
const items: NavigationItem[] = [
    { name: 'Overview', url: '/robots' },
    { name: 'Add', url: '/robots/add' },
    { name: 'Settings', url: '/robots/settings' },
];

// Items with `children` render their submenu in place. A horizontal nav
// (or `submenu="dropdown"`) shows each group as a Reka NavigationMenu
// flyout; the children are NEVER lifted into a different nav.
const menuItems: NavigationItem[] = [
    { name: 'Overview', url: '/robots' },
    {
        name: 'Manage',
        icon: 'fa6-solid:gear',
        children: [
            { name: 'Add', url: '/robots/add' },
            { name: 'Settings', url: '/robots/settings' },
        ],
    },
];

// Multi-level dropdown. A dropdown bar is a SINGLE Reka NavigationMenu
// root, so a group nested *inside* a flyout panel can't be a second
// flyout — it degrades to an inline `collapse` (an expandable sub-list)
// within the flyout. Here "Manage" opens a flyout whose "Advanced" child
// is itself a group: it renders as a collapsible sub-section inside the
// "Manage" panel.
const multiLevelItems: NavigationItem[] = [
    { name: 'Overview', url: '/robots' },
    {
        name: 'Manage',
        icon: 'fa6-solid:gear',
        children: [
            { name: 'Add', url: '/robots/add' },
            { name: 'Settings', url: '/robots/settings' },
            {
                name: 'Advanced',
                icon: 'fa6-solid:sliders',
                children: [
                    { name: 'Logs', url: '/robots/logs' },
                    { name: 'Tokens', url: '/robots/tokens' },
                ],
            },
        ],
    },
];

// The docs site has no router, so we simulate the active route with a ref the
// buttons below mutate — in a real app you'd pass `useRoute().path`.
const path = ref('/robots/add');
const paths = ['/robots', '/robots/add', '/robots/settings', '/robots/logs', '/robots/tokens'];
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.875rem; color: var(--vc-color-fg-muted);">
                Simulated path:
            </span>
            <button
                v-for="p in paths"
                :key="p"
                type="button"
                :style="{
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid var(--vc-color-border)',
                    background: path === p ? 'var(--vc-color-primary-600)' : 'transparent',
                    color: path === p ? 'var(--vc-color-on-primary)' : 'inherit',
                }"
                @click="path = p"
            >
                {{ p }}
            </button>
        </div>

        <div>
            <h6>List variant (default)</h6>
            <VCNavItems
                :data="items"
                :path="path"
            />
        </div>

        <div>
            <h6>Pills variant — horizontal</h6>
            <VCNavItems
                :data="items"
                :path="path"
                variant="pills"
            />
        </div>

        <div>
            <h6>Pills variant — vertical</h6>
            <div style="max-width: 16rem;">
                <VCNavItems
                    :data="items"
                    :path="path"
                    variant="pills"
                    orientation="vertical"
                />
            </div>
        </div>

        <div>
            <h6>Dropdown submenu — horizontal</h6>
            <VCNavItems
                :data="menuItems"
                :path="path"
                orientation="horizontal"
                submenu="dropdown"
            />
        </div>

        <div>
            <h6>Multi-level dropdown — horizontal</h6>
            <VCNavItems
                :data="multiLevelItems"
                :path="path"
                orientation="horizontal"
                submenu="dropdown"
            />
        </div>

        <div>
            <h6>Collapse submenu — vertical</h6>
            <div style="max-width: 16rem;">
                <VCNavItems
                    :data="menuItems"
                    :path="path"
                    orientation="vertical"
                    submenu="collapse"
                />
            </div>
        </div>
    </div>
</template>
