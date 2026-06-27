# Breadcrumb

Hierarchical trail that shows where the current page sits in the site structure and lets users step back up the tree. Ships in `@vuecs/navigation` alongside the multi-level nav and stepper.

Two authoring shapes cover everything: a terse `:items` **driver** for the common case, and a **manual compound** (`<VCBreadcrumbList>` / `<VCBreadcrumbItem>` / …) escape hatch when a page needs full control over each crumb. On top of those, four composables wire the trail to your route (`route.matched` meta, a published nav's `activeTrail`, an imperative push/pop manager, and a leaf-label override for dynamic `/:id` pages).

```bash
npm install @vuecs/navigation
```

The breadcrumb follows the [W3C APG Breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/): a `<nav aria-label="Breadcrumb">` wrapping an `<ol>` of `<li>` crumbs, with `aria-current="page"` on the current crumb.

<Demo name="breadcrumb">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCBreadcrumb } from '@vuecs/navigation';
import type { BreadcrumbItem } from '@vuecs/navigation';

// Driver mode — the last crumb (no `to`/`href`) is treated as the
// current page automatically: `aria-current="page"` + non-navigable.
const items: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Robots', to: '/robots' },
    { label: 'Settings' },
];
</script>

<template>
    <VCBreadcrumb :items="items" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/navigation";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Authoring shapes

### 1. Driver (`:items`)

Pass a `BreadcrumbItem[]`. The component renders the `<nav>` / `<ol>` / `<li>` / separator scaffolding and picks the right inner element per crumb:

- A crumb with `to` or `href` → a navigable `<VCBreadcrumbLink>` (composes [`<VCLink>`](/components/link), so it resolves to `<RouterLink>` / `<NuxtLink>` / `<a>`).
- A crumb without `to`/`href` → a non-navigable `<VCBreadcrumbPage>`.
- The **last** crumb (or any crumb with `current: true`) is the current page → `aria-current="page"`.
- `disabled: true` → an `aria-disabled` non-interactive crumb.

```vue
<VCBreadcrumb
    :items="[
        { label: 'Home', to: '/', icon: 'lucide:house' },
        { label: 'Robots', to: '/robots' },
        { label: 'Settings' },
    ]"
/>
```

`<VCBreadcrumb>` is **generic over `Item extends BreadcrumbItem`**, so a richer entity passed via `:items` flows back through the `#item` / `#item-label` slot props with its extra fields typed — the component itself only reads the `BreadcrumbItem` keys.

### 2. Manual compound

When the driver doesn't fit (custom per-crumb markup, interleaved non-crumb content), write the parts by hand. Omit `:items` and supply the default slot:

```vue
<VCBreadcrumb>
    <VCBreadcrumbList>
        <VCBreadcrumbItem>
            <VCBreadcrumbLink to="/">Home</VCBreadcrumbLink>
        </VCBreadcrumbItem>
        <VCBreadcrumbSeparator />
        <VCBreadcrumbItem>
            <VCBreadcrumbLink to="/robots">Robots</VCBreadcrumbLink>
        </VCBreadcrumbItem>
        <VCBreadcrumbSeparator />
        <VCBreadcrumbItem>
            <VCBreadcrumbPage current>Settings</VCBreadcrumbPage>
        </VCBreadcrumbItem>
    </VCBreadcrumbList>
</VCBreadcrumb>
```

You own separator placement in this mode — drop a `<VCBreadcrumbSeparator>` `<li>` between crumbs.

### 3. Registry-derived (auto-follow the route)

A `<VCNavItems>` that publishes into the registry (`registry registry-id="…"`) exposes its `activeTrail` — the ordered root → leaf chain of the active branch. `:registry-id` derives the trail from it with **zero per-page wiring**: the breadcrumb follows the route and click-selection reactively.

```vue
<!-- Sidebar nav publishes its resolved tree under "main". -->
<VCNavItems :data="items" registry registry-id="main" />

<!-- Breadcrumb mirrors the active trail of that nav. -->
<VCBreadcrumb registry-id="main" />
```

Crumb labels come from each nav item's `name`; a crumb's `to` from the item's `url`; `current` from the item's exact-active flag. Returns an empty trail (renders nothing) when the navigation plugin isn't installed or the id has no occupant yet — the read is empty-safe. See [Navigation → the registry](/components/navigation#dependent-navs-the-registry).

## Ellipsis collapse

Long trails collapse their middle into a single `<VCBreadcrumbEllipsis>` once the crumb count exceeds `:max-items`. `:items-before-collapse` / `:items-after-collapse` control how many crumbs stay visible on each end (both default to `1`).

```vue
<VCBreadcrumb
    :items="longTrail"
    :max-items="3"
    :items-before-collapse="1"
    :items-after-collapse="1"
/>
```

With `:max-items="3"` a six-crumb trail renders as `Home … R2-D2 / Settings`. By default the ellipsis is a decorative glyph (the collapsed crumbs are unreachable). `:max-items` is `undefined` by default (never collapse).

### Reveal the collapsed crumbs in a dropdown

The `#ellipsis="{ hidden }"` slot receives the collapsed crumbs, so you can make them reachable — e.g. behind a dropdown (the same composition Nuxt UI uses). When the slot is present, `<VCBreadcrumbEllipsis>` is **not** `aria-hidden`, so your trigger stays in the accessibility tree. This keeps the interactive overlay an opt-in composition rather than a built-in dependency of `@vuecs/navigation`:

```vue
<script setup lang="ts">
import { VCBreadcrumb, VCBreadcrumbLink } from '@vuecs/navigation';
import {
    VCDropdownMenu,
    VCDropdownMenuContent,
    VCDropdownMenuItem,
    VCDropdownMenuTrigger,
} from '@vuecs/overlays';
</script>

<template>
    <VCBreadcrumb :items="longTrail" :max-items="3">
        <template #ellipsis="{ hidden }">
            <VCDropdownMenu>
                <VCDropdownMenuTrigger :aria-label="`Show ${hidden.length} collapsed crumbs`">
                    …
                </VCDropdownMenuTrigger>
                <VCDropdownMenuContent>
                    <VCDropdownMenuItem v-for="(crumb, i) in hidden" :key="i">
                        <VCBreadcrumbLink :to="crumb.to" :href="crumb.href">
                            {{ crumb.label }}
                        </VCBreadcrumbLink>
                    </VCDropdownMenuItem>
                </VCDropdownMenuContent>
            </VCDropdownMenu>
        </template>
    </VCBreadcrumb>
</template>
```

## Dynamic `/:id` leaf labels

Route-derived trails know the path but not a record's *resolved title* (a `/robots/:id` segment is `:id` in `route.matched`, not the robot's name). `useBreadcrumbLeaf()` overrides the **current (leaf) crumb's** label imperatively — the one route-scoped seam for this. The override **auto-clears when the route changes**, so you never leak a stale title onto the next page.

```vue
<script setup lang="ts">
import { useBreadcrumbLeaf, useBreadcrumbItems } from '@vuecs/navigation';
import { watchEffect } from 'vue';

const items = useBreadcrumbItems({ home: { label: 'Home', to: '/' } });
const { set } = useBreadcrumbLeaf();

// e.g. after `useAsyncData(() => fetchRobot(route.params.id))`
watchEffect(() => {
    if (robot.value) set(robot.value.name);
});
</script>

<template>
    <VCBreadcrumb :items="items" />
</template>
```

With **no `id`** the nearest-ancestor `<VCBreadcrumb>` is targeted (the 99% case). When two breadcrumbs co-exist (a layout one + a section-local one), give the target `<VCBreadcrumb :leaf-id="…">` and pass the same id to `useBreadcrumbLeaf('id')`. Called outside any `<VCBreadcrumb>` with no id, it is a safe no-op (a page `setup` can call it unconditionally).

## The imperative manager

For genuinely non-route flows (wizards, stack-style UIs) reach for the app-scoped manager. Derivation (driver / registry / route-meta) is the recommended floor — use the manager only when you really push and pop the trail by hand.

```vue
<script setup lang="ts">
import { useBreadcrumb } from '@vuecs/navigation';

// Provided by `app.use(navigation)`. Destructure so the template unwraps `items`.
const { items, push, pop, replace, reset } = useBreadcrumb();

push({ label: 'Robots', to: '/robots' }); // descend
pop();                                     // ascend (returns the removed crumb)
</script>

<template>
    <VCBreadcrumb :items="items" />
</template>
```

| Method | Description |
|---|---|
| `items` | Reactive trail (`Ref<BreadcrumbItem[]>`). Destructure before binding so the template unwraps it. |
| `push(item)` | Append a crumb. |
| `pop()` | Remove and return the last crumb. |
| `replace(items)` | Replace the whole trail. |
| `reset()` | Reset to the trail passed at creation. |

The manager is **app-scoped** (one per app via `provide`/`inject`, not a module singleton — a singleton would leak the trail across concurrent SSR requests). `app.use(navigation)` provides a default one; `createBreadcrumbManager(initial)` + `provideBreadcrumbManager()` seed a custom initial trail.

## Composables

| Composable | Returns | Use for |
|---|---|---|
| `useBreadcrumbItems({ home? })` | `ComputedRef<BreadcrumbItem[]>` | Derive crumbs from `vue-router`'s `route.matched`, reading each record's `meta.breadcrumb`. The route-meta floor — SSR-correct, self-heals on back/forward + deep-link. Router-free apps degrade to `[]` (plus the optional `home`). |
| `useBreadcrumbFromRegistry(id)` | `ComputedRef<BreadcrumbItem[]>` | Derive crumbs from a published nav's `activeTrail`. `<VCBreadcrumb :registry-id>` wraps this; call it directly to transform the trail before binding. |
| `useBreadcrumb()` | `BreadcrumbManager` | The imperative push/pop manager (above). |
| `useBreadcrumbLeaf(id?)` | `{ set, clear }` | Override the leaf crumb's label for dynamic `/:id` pages (above). |

`meta.breadcrumb` accepts a string (shorthand for `{ label }`), a partial `BreadcrumbItem`, a `BreadcrumbItem[]`, or a function `(route) => …` that returns one or more — or `undefined` to omit that record:

```ts
const routes = [
    { path: '/robots', meta: { breadcrumb: 'Robots' } },
    { path: '/robots/:id', meta: { breadcrumb: (r) => ({ label: `Robot #${r.path}` }) } },
];
```

## `BreadcrumbItem` shape

```ts
type BreadcrumbItem = {
    label: string;                          // visible crumb text (required)
    to?: string | Record<string, unknown>;  // vue-router target → renders a link
    href?: string;                          // plain href (ignored when `to` is set)
    icon?: string;                          // leading icon name (resolved by <VCIcon>)
    current?: boolean;                      // force aria-current="page" (else: last crumb)
    disabled?: boolean;                     // non-interactive, aria-disabled="true"
};
```

## Compound parts

| Component | Renders | Notes |
|---|---|---|
| `VCBreadcrumb` | `<nav aria-label="Breadcrumb">` | Root. Driver (`:items`) or manual-compound host. Generic over `Item`. |
| `VCBreadcrumbList` | `<ol>` | The ordered list of crumbs. |
| `VCBreadcrumbItem` | `<li>` | Per-crumb wrapper. |
| `VCBreadcrumbLink` | `<a>` (via `<VCLink>`) | A navigable crumb. Router-aware. |
| `VCBreadcrumbPage` | `<span>` | The current-page or url-less crumb. |
| `VCBreadcrumbSeparator` | `<li aria-hidden role="presentation">` | Between consecutive crumbs. Slot-overridable (auto-renders the `separatorIcon` / `separatorGlyph` default). |
| `VCBreadcrumbEllipsis` | `<span aria-hidden role="presentation">` | The collapsed-middle indicator. |

## Theme keys

The root, list, link, page, and ellipsis share the **`breadcrumb`** theme key; the `<li>` and the separator carry their own keys.

| Theme element | Slot | Default class |
|---|---|---|
| `breadcrumb` | `root` | `vc-breadcrumb` |
| `breadcrumb` | `list` | `vc-breadcrumb-list` |
| `breadcrumb` | `link` | `vc-breadcrumb-link` |
| `breadcrumb` | `page` | `vc-breadcrumb-page` |
| `breadcrumb` | `ellipsis` | `vc-breadcrumb-ellipsis` |
| `breadcrumbItem` | `root` | `vc-breadcrumb-item` |
| `breadcrumbSeparator` | `root` | `vc-breadcrumb-separator` |

## Behavioral defaults

Resolved via `useComponentDefaults('breadcrumb', …)` — overridable per instance OR app-wide through `app.use(vuecs, { defaults: { breadcrumb: { … } } })` for i18n.

| Key | Default | Description |
|---|---|---|
| `label` | `'Breadcrumb'` | Accessible name for the `<nav>` landmark (also via the `label` prop). |
| `separatorIcon` | `''` | Icon name for the auto-rendered separator. An installed icon preset (`icons: [lucide()]`) sets a chevron here, which then wins over the glyph. |
| `separatorGlyph` | `'/'` | Glyph used when no `separatorIcon` is resolvable. |
| `ellipsisLabel` | `'Show more'` | Screen-reader label for the collapsed-middle ellipsis. |
| `ellipsisGlyph` | `'…'` | Glyph rendered inside the ellipsis crumb. |

## API Reference

### `<VCBreadcrumb>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Item[]` | `undefined` | Crumb data (driver mode). When omitted, the default slot is the manual compound. |
| `registryId` | `string` | `undefined` | Derive crumbs from a published nav's `activeTrail` by registry id. Ignored when `:items` is set. |
| `leafId` | `string` | `undefined` | Disambiguator for `useBreadcrumbLeaf('id')` when more than one `<VCBreadcrumb>` is mounted. |
| `maxItems` | `number` | `undefined` | Collapse the middle into an ellipsis when the crumb count exceeds this. `undefined` = never collapse. |
| `itemsBeforeCollapse` | `number` | `1` | Crumbs kept before the ellipsis when collapsing. |
| `itemsAfterCollapse` | `number` | `1` | Crumbs kept after the ellipsis when collapsing. |
| `as` | `string \| Component` | `'nav'` | Root landmark tag. |
| `label` | `string` | from `breadcrumb.label` default | Accessible name for the `<nav>` (`aria-label`). |
| `themeClass` | `Partial<BreadcrumbThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

| Emit | Payload | Description |
|---|---|---|
| `select` | `(item: Item, index: number)` | Fired when a url-less crumb (no `to`/`href`, not the current page) is clicked — drive a non-navigating selection. |

| Slot | Props | Description |
|---|---|---|
| `default` | — | Manual-compound escape hatch (replaces the driver scaffolding). |
| `item` | `{ item, index, current }` | Replace a crumb's inner content (icon + label) per crumb. |
| `item-label` | `{ item, index }` | Replace just the label text, keeping the auto-rendered icon. |
| `separator` | — | Replace the separator content (e.g. a `›` glyph). |
| `ellipsis` | `{ hidden }` | Replace the collapsed-middle indicator; `hidden` is the array of collapsed crumbs. |

### `<VCBreadcrumbLink>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `to` | `string \| Record<string, unknown>` | `undefined` | vue-router target (composes `<VCLink>`). |
| `href` | `string` | `undefined` | Plain `href` (non-router). |
| `active` | `boolean` | `false` | Mark as the current page → `aria-current="page"` + `active` variant. APG keeps the current crumb a real link. |
| `disabled` | `boolean` | `false` | Genuinely disabled crumb. |
| `themeClass` / `themeVariant` | — | `undefined` | Per-instance overrides. |

### `<VCBreadcrumbPage>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string \| Component` | `'span'` | Tag to render. |
| `current` | `boolean` | `false` | Mark as the current page (`aria-current="page"`). Set for the last crumb. |
| `disabled` | `boolean` | `false` | `aria-disabled="true"`. |
| `asLink` | `boolean` | `false` | Render as a non-navigable link (`role="link" aria-disabled="true"`) — the shadcn idiom for a current crumb that looks like a link but isn't. |
| `themeClass` / `themeVariant` | — | `undefined` | Per-instance overrides. |

### `<VCBreadcrumbList>` / `<VCBreadcrumbItem>` / `<VCBreadcrumbSeparator>` / `<VCBreadcrumbEllipsis>`

Each takes `as` (render-target tag/component), `themeClass`, and `themeVariant`. The `as` defaults are `'ol'` / `'li'` / `'li'` / `'span'` respectively. `<VCBreadcrumbSeparator>` and `<VCBreadcrumbEllipsis>` render their default content (separator glyph / ellipsis glyph + screen-reader label) when given no slot.

## See also

- [Navigation](/components/navigation) — the registry whose `activeTrail` `:registry-id` mirrors
- [Link](/components/link) — the router-aware anchor each crumb link composes
- [Stepper](/components/stepper) — the other navigator in `@vuecs/navigation`
