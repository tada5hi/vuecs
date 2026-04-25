# Navigation

Multi-level navigation. Items are configured at plugin-install time and rendered by `<VCNavItems>`. A shared `NavigationManager` (provided by the plugin) tracks the active item per level and emits update events as the user navigates. See [Navigation Manager](/guide/navigation-manager) for the full state model.

```bash
npm install @vuecs/navigation
```

## Basic usage

```ts
// main.ts
import { createApp } from 'vue';
import navigation from '@vuecs/navigation';
import App from './App.vue';

const items = [
    { name: 'Home',     url: '/' },
    { name: 'Docs',     url: '/docs' },
    {
        name: 'Settings',
        children: [
            { name: 'Profile', url: '/settings/profile' },
            { name: 'Billing', url: '/settings/billing' },
        ],
    },
];

createApp(App).use(navigation, { items }).mount('#app');
```

```vue
<script setup lang="ts">
import { VCNavItems } from '@vuecs/navigation';
</script>

<template>
    <!-- Renders the top-level items registered at install time. -->
    <VCNavItems :level="0" />
</template>
```

To render items inline (without registering them at install time), pass `:data` directly with normalized items.

## Active state

`@vuecs/navigation` watches the current `vue-router` route. When the route matches an item's `url` (or its optional `activeMatch` regex), the item is added to `itemsActive` at its level — and the rendered `<a>` element receives `router-link-active` / `router-link-exact-active` classes from `vue-router` directly. Style them via the `navLink` theme element. See [theme-tailwind](/themes/tailwind) for an example.

## Manager API

For programmatic control, inject the manager:

```ts
import { injectNavigationManager } from '@vuecs/navigation';
import type { NavigationItemNormalized } from '@vuecs/navigation';

const manager = injectNavigationManager();

// Select an item at a level (e.g. activate "Settings" at the root)
await manager.select(0, settingsItem as NavigationItemNormalized);

// Toggle the expansion of a parent item
await manager.toggle(0, settingsItem as NavigationItemNormalized);
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `select(level, item)` | `(number, NavigationItemNormalized) => Promise<void>` | Make `item` the active item at `level`. Children below are rebuilt. |
| `toggle(level, item)` | `(number, NavigationItemNormalized) => Promise<void>` | Toggle `item`'s expansion at `level`. Same item twice collapses. |
| `getItems(level)` | `(number) => NavigationItemNormalized[]` | Read the currently visible items at the given level. |

The manager extends `EventEmitter` and emits `built`, `updated`, and per-level events — useful for reacting to route changes outside the rendered tree.

## NavigationItem shape

```ts
type NavigationItem<META = any> = {
    name: string;          // required
    url?: string;          // route to navigate to (matches against router for active state)
    urlTarget?: string;    // anchor target (e.g. '_blank')
    default?: boolean;     // first-paint default
    type?: string;         // ElementType — for non-link items
    icon?: string;
    active?: boolean;
    activeMatch?: string;  // regex string for matching the active state
    display?: boolean;     // hide from rendering
    displayChildren?: boolean;
    children?: NavigationItem<META>[];
    meta?: META;           // arbitrary per-item metadata
};
```

There is no required `id` field — items are identified by their position (level + name) within the tree.

## Slot props

`<VCNavItems>` exposes a typed `item` slot for rendering each item:

```ts
import type { NavItemLinkSlotProps, NavItemsItemSlotProps } from '@vuecs/navigation';
```

`@vuecs/navigation` also exports `NavItemLinkSlotProps`, `NavItemTextSlotProps`, `NavItemIconSlotProps` for typing slot consumers in render functions.

## See also

- [Navigation Manager](/guide/navigation-manager) — full state model
- [Link](/components/link)
