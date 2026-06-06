# Navigation

`@vuecs/navigation` inverts the usual "central store" model. There is **no NavigationManager** and no install-time item list. Instead:

- The plugin provides **only an empty reactive registry**.
- Each `<VCNavItems>` **owns its items** via the `:resolver` prop.
- A nav opts into **publishing** its resolved output to the registry; other navs **read** it and derive their own lists.

This keeps every call site self-contained: a nav is either *independent* (it resolves its own items with no registry read) or *dependent* (it derives its own list by keying off another nav's published state). A nav never renders another nav's `children` subtree.

## Install

```ts
import navigation from '@vuecs/navigation';

// Registry-only — no `items` option exists anymore.
app.use(navigation, {});
```

## Owning items: `:resolver`

The `:resolver` prop is the single source of a nav's items. It accepts a plain array, a sync function, or an async function:

```vue
<VCNavItems :resolver="items" />
<VCNavItems :resolver="({ path }) => itemsFor(path)" />
<VCNavItems :resolver="async () => (await fetchMenu())" />
```

A function resolver receives a `NavigationResolverContext` (`{ path, registry }`) and may read reactive state freely. Reads **before the first `await`** are tracked automatically — the nav re-runs the resolver whenever they change. For state read **after** an `await`, list those sources in `:watch` so they still retrigger:

```vue
<VCNavItems :resolver="async () => loadFor(section.value)" :watch="[section]" />
```

An imperative `refresh()` is exposed on the component instance for manual re-runs.

## The registry

The registry is a reactive, app-wide map keyed by string id. A nav publishes by adding `registry` + `registry-id`:

```vue
<VCNavItems :resolver="primaryItems" registry registry-id="top" />
```

Publishing is **lifecycle-bound** (auto-deregister on unmount) and **ownership-token guarded**: each publishing nav holds a private token, and a nav can only release the id it currently occupies. During a route handoff — where Vue mounts the incoming page before unmounting the outgoing one — the departing nav holds a stale token and cannot evict the new occupant. Reassigning an occupied id logs a dev warning.

### Reading another nav's state

A dependent nav reads via the resolver context's `registry(id)`:

```vue
<VCNavItems
    :resolver="({ registry }) => sideItemsFor(registry('top').activeTrail.value[0]?.name)"
/>
```

`registry(id)` returns a `NavigationRegistryEntry`:

| Field | Description |
|-------|-------------|
| `items` | Full resolved tree (`Ref`). Each item carries `.active` and `.activeWithin`. |
| `active` | Exact active leaf item(s) (`ComputedRef`). Read `active.value[0]` for single-active. |
| `activeTrail` | Ordered root → leaf chain (`ComputedRef`). `activeTrail.value[0]` is the active top section. |

Reads are **empty-safe** — `registry(id)` never returns `undefined`. An absent id yields a stable empty entry, and the reader lights up automatically the moment a nav publishes that id (the backing map is `shallowReactive`, so occupancy changes are tracked dependencies).

## Active state

Active matching is path-scored. Three distinct concepts are surfaced:

- **`active`** — the exact current leaf. Scoring picks one best match, not a prefix match, so an index route (`/robots`) does not stay lit on a child route (`/robots/add`).
- **`activeWithin`** — an ancestor of the active branch; drives parent highlight + auto-opening a collapsed branch.
- **`activeTrail`** — the ordered root → leaf chain, useful for breadcrumbs and for keying dependent navs.

### Path source

When `:path` is omitted, the nav softly reads the current `vue-router` route via the `$route` global property. This is a soft lookup — no static `vue-router` import — so router-free apps degrade to `undefined` instead of failing. An explicit `:path` always wins. `vue-router` is an optional peer dependency.

### Selecting without navigating

A leaf item with **no `url`** can't navigate, so clicking it *selects* it instead: the nav records the item and folds it into its active state exactly as a route match would — lighting up `active` / `activeTrail` and, if the nav publishes, republishing through the registry with no extra wiring. This is what makes a top-nav tab swap a dependent sidebar without changing the route:

```ts
// `Admin` has no `url` — clicking it selects the section instead of navigating.
export const primaryItems: NavigationItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Admin', activeMatch: '/admin/' },
];
```

A real navigation supersedes the selection: as soon as the route changes, the nav clears the selection and hands active state back to path matching. Each root nav has its own selection scope; the registry remains the only channel between navs. The `select` callback is also exposed on the `#link` slot props if you render bespoke link markup.

## Two-call-site pattern (header + sidebar)

The canonical layout: a header nav publishes its top-level sections, and a sidebar nav derives its own list from whichever section is active.

```vue
<!-- Header -->
<VCNavItems :resolver="primaryItems" registry registry-id="top" />

<!-- Sidebar (dependent) -->
<VCNavItems
    :resolver="({ registry }) => sideItemsFor(registry('top').activeTrail.value[0]?.name)"
/>
```

```ts
// config/layout.ts
export const primaryItems: NavigationItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Admin', activeMatch: '/admin/' },
];

export function sideItemsFor(activeSection?: string): NavigationItem[] {
    return activeSection === 'Admin' ? adminItems : defaultItems;
}
```

The sidebar owns `defaultItems` / `adminItems`; it only borrows the *name* of the active section from the header — never the header's children.

## See also

- [Components → Navigation](/components/navigation) — component reference
- [Theme System](/guide/theme-system) — overriding nav classes
