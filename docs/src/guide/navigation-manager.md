# Navigation Manager

`@vuecs/navigation` ships its own state manager — separate from the theme/defaults systems — for tracking the navigation tree, the active item per level, and reacting to `vue-router` route changes.

## Why a manager?

Multi-level navigation has cross-component state:

- The visible items at level N depend on which item is active at level N-1
- Toggling a branch open replaces the rendered tree below it
- `vue-router` route changes have to flow into the tree

A flat per-component approach (each `<VCNavItem>` reading from props) doesn't scale. The manager centralizes the state and lets `<VCNavItems>` instances subscribe to just the level they render.

## Provide / inject

The manager is provided at plugin install time — `app.use(navigation, { items })` registers items and creates a single shared manager.

```ts
import { injectNavigationManager } from '@vuecs/navigation';

const manager = injectNavigationManager();
```

`<VCNavItems>` instances inject the same manager; nested levels do not create new ones.

## State shape

The manager (built on [`@posva/event-emitter`](https://github.com/posva/event-emitter)) holds:

- `items` — the resolved tree of `NavigationItemNormalized` (with `level` and `trace` filled in)
- `itemsActive` — the active item per level, ordered by ascending level (the "breadcrumb" through the tree)
- An async `itemsFn` for lazily loading children at deeper levels

There is no per-item id — items are addressed by `(level, item)` and identified internally by their `trace` (an array of names from root to leaf).

## Methods

| Method | Description |
|--------|-------------|
| `select(level, item)` | Mark `item` as active at `level`. Children below are rebuilt. |
| `toggle(level, item)` | Toggle expansion of `item` at `level`. Calling twice on the same item collapses it. |
| `getItems(level)` | Read the currently visible items at the given level. |

## Events

| Event | Payload | When |
|-------|---------|------|
| `building` | `()` | Manager started rebuilding the tree |
| `built` | `()` | Initial build finished |
| `updated` | `(items)` | Top-level items changed (after install or after `select`) |
| `levelUpdated` | `(level, items)` | Items at a specific level changed (e.g. after expanding a branch) |

## vue-router integration

When the route changes, the manager walks items looking for one whose `url` (or `activeMatch` regex) matches the new path. The match becomes the active item at its level; `vue-router`-active CSS classes (`router-link-active`, `router-link-exact-active`) fire on the corresponding `<a>` element naturally — the manager doesn't override them.

The CSS for the active state is themeable via the `navLink` element — see [theme-tailwind source](https://github.com/tada5hi/vuecs/tree/master/packages/theme-tailwind/src) for examples.

## Custom integration

If you're not using `vue-router`, drive the manager imperatively:

```ts
import { injectNavigationManager } from '@vuecs/navigation';

const manager = injectNavigationManager();
const settings = manager.getItems(0).find((it) => it.name === 'Settings');
if (settings) await manager.select(0, settings);
```

## See also

- [Components → Navigation](/components/navigation) — component reference
- [Theme System](/guide/theme-system) — overriding nav classes
