# Navigation

Multi-level navigation. Every `<VCNavItems>` call site **owns its own items** via the `:data` prop — a plain array, a sync function, or an async function. There is no install-time item list and no shared manager; the plugin provides only an empty reactive **registry** that navs can opt into publishing to / reading from. See the [Navigation guide](/guide/navigation) for the full model.

```bash
npm install @vuecs/navigation
```

## Basic usage

```ts
// main.ts
import { createApp } from 'vue';
import navigation from '@vuecs/navigation';
import App from './App.vue';

// Registry-only install — no items here.
createApp(App).use(navigation, {}).mount('#app');
```

```vue
<script setup lang="ts">
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationItem } from '@vuecs/navigation';

const items: NavigationItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Docs', url: '/docs' },
    {
        name: 'Settings',
        children: [
            { name: 'Profile', url: '/settings/profile' },
            { name: 'Billing', url: '/settings/billing' },
        ],
    },
];
</script>

<template>
    <VCNavItems :data="items" />
</template>
```

The nav normalizes the items, scores each against the current path, and marks exactly one best match active. When `:path` is omitted it **softly reads the current `vue-router` route** (via the `$route` global property) if a router is installed; router-free apps simply get no active item until you pass `:path` yourself.

::: tip Children render in place
A nav item's direct children render **only** as that item's own submenu — a dropdown for horizontal navs, an indented collapse for vertical navs. They are never lifted out and rendered by a different `<VCNavItems>`. Every call site supplies its own items.
:::

## Resolver forms

```vue
<!-- 1. plain array -->
<VCNavItems :data="items" />

<!-- 2. sync function — receives the resolver context -->
<VCNavItems :data="({ path }) => itemsFor(path)" />

<!-- 3. async function — the nav re-runs it and renders the result -->
<VCNavItems :data="async () => (await fetchMenu())" />
```

A function resolver receives a `NavigationResolverContext`:

```ts
type NavigationResolverContext<META = any> = {
    path: string | undefined;                          // current active-match path
    registry: (id: string) => NavigationRegistryEntry; // reactive, empty-safe
};
```

Reactive reads inside the resolver (before the first `await`) are tracked automatically — the nav re-runs whenever they change. For state read **after** an `await` in an async resolver, list those sources in the `:watch` prop so they still retrigger.

```vue
<VCNavItems
    :data="async () => loadFor(section.value)"
    :watch="[section]"
/>
```

## Dependent navs (the registry)

A nav opts into **publishing** its resolved output by adding `registry` + a `registry-id`. Another nav **reads** it via the resolver context's `registry(id)` and derives its own list — it never borrows the published nav's `children`.

```vue
<!-- Header: publishes its output under the id "top" -->
<VCNavItems :data="primaryItems" registry registry-id="top" />

<!-- Sidebar: dependent — derives its OWN items from the active top section -->
<VCNavItems :data="({ registry }) => sideItemsFor(registry('top').activeTrail.value[0]?.name)" />
```

Registration is lifecycle-bound (auto-deregisters on unmount) and ownership-token guarded, so a route handoff (Vue mounts the new page before unmounting the old) doesn't let a departing nav evict the incoming occupant.

A `NavigationRegistryEntry` exposes three reactive handles:

| Field | Type | Description |
|-------|------|-------------|
| `items` | `Ref<NavigationItemNormalized[]>` | Full resolved tree. Each item carries `.active` (exact current item) and `.activeWithin` (ancestor on the active branch). |
| `active` | `ComputedRef<NavigationItemNormalized[]>` | Exact active leaf item(s). Single-active consumers read `active.value[0]`. |
| `activeTrail` | `ComputedRef<NavigationItemNormalized[]>` | Ordered active trail, root → leaf. `activeTrail.value[0]` is the active top-level section; `.at(-1)` is the active leaf. |

Reads are **empty-safe**: `registry(id)` returns a stable empty entry even before any nav publishes that id, and the reader lights up the moment an occupant registers.

## Submenu presentation

Items with children render a submenu whose presentation is controlled by `submenu`:

| Value | Effect |
|-------|--------|
| `auto` (default) | Horizontal orientation → `dropdown`; otherwise → `collapse`. |
| `collapse` | Indented, in-place expand/collapse (Reka `Collapsible`). |
| `dropdown` | Flyout menu (Reka `NavigationMenu`) with hover-grace + edge-aware content. |

An active descendant auto-opens its parent branch.

::: tip Nested groups inside a dropdown flyout
A dropdown bar is a **single** Reka `NavigationMenu` root. The flyout panel is plain content — a list of links — so a group nested *inside* a flyout renders as an inline `collapse` (an expandable sub-list) rather than a second nested flyout. This keeps the hover state machine intact (one root per bar); a deeper dropdown-in-dropdown would break reopen-on-hover.
:::

## Variants

| Prop | Values | Default | Effect |
|------|--------|---------|--------|
| `variant` | `list`, `pills` | `list` | `pills` renders each item as a rounded pill. |
| `orientation` | `horizontal`, `vertical` | `horizontal` | `vertical` stacks items in a column. |

Both feed the `navigation` theme's variant system. Themes override the accent via the `navigation` variant slot classes.

## Active state

Active state is path-scored, with three distinct concepts surfaced on normalized items / registry entries:

- **`active`** — the exact current leaf (one best match, not a prefix match — so `/robots` does not stay lit on `/robots/add`).
- **`activeWithin`** — an ancestor of the active branch; drives parent highlight.
- **`activeTrail`** — the ordered root → leaf chain.

The active link receives the explicit `active` class, so a single `.active` selector styles it. Style via the `navLink` theme element — see [theme-tailwind](/themes/tailwind).

A leaf item with **no `url`** becomes a *section switcher*: clicking it selects the item (folding it into `active` / `activeTrail` and republishing through the registry) instead of navigating. A later navigation supersedes the selection. See [Selecting without navigating](/guide/navigation#selecting-without-navigating).

## NavigationItem shape

```ts
type NavigationItem<META = any> = {
    name: string;          // required
    url?: string;          // route to navigate to (matched for active state)
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

There is no required `id` field — items are identified by their `trace` (the array of names from root to leaf) within the tree.

## Slot props

```ts
import type {
    NavItemsItemSlotProps,
    NavItemLinkSlotProps,
    NavItemTextSlotProps,
    NavItemIconSlotProps,
} from '@vuecs/navigation';
```

`<VCNavItems>` exposes a typed `item` slot for rendering each item; the link / text / icon slot-prop types are exported for typing slot consumers in render functions.

## See also

- [Navigation guide](/guide/navigation) — resolver + registry model
- [Link](/components/link)
