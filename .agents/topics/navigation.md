# Navigation registry + resolver

`@vuecs/navigation` 3.0 is a clean break from the old NavigationManager
model. There is **no manager** and **no install-time item list** — the
core inversion is:

- `install(app, options)` provides ONLY an **empty reactive registry**
  (`provideNavigationRegistry(new NavigationRegistry(), app)`). `Options`
  carries no `items`. The `@posva/event-emitter` dependency is gone.
- Each `<VCNavItems>` **owns its items** via the single `:data` prop — a
  plain `NavigationItem[]`, a sync fn, or an async fn (`NavigationResolver`).
  A fn receives a `NavigationResolverContext` (`{ path, registry }`).
  Reactive reads before the first `await` retrigger the resolver
  automatically (`watchEffect`); state read after an `await` needs the
  `:watch` prop. `refresh()` is exposed for imperative re-runs. When
  `:data` is omitted, the nav is a **nested submenu renderer**: it injects
  its parent `<VCNavItem>`'s already-scored children (via
  `NAVIGATION_NODES_KEY`) and renders them as-is, skipping
  resolve / score / select / registry. An explicit `:data` always wins
  (treated as a resolving root even when nested in markup).
- A nav opts into **publishing** its resolved output via `registry` +
  `registry-id`. Other navs **read** it through the resolver context's
  `registry(id)` and derive their OWN list — they NEVER render another
  nav's `.children` subtree. Every call site is either *independent* or
  *dependent* (keys off another nav's published state).

`NavigationRegistry` (`registry/module.ts`) is a `shallowReactive`
`Map<string, Occupant>`:

- `register(id, entry)` — last-wins, dev-warns on collision. Generates
  an internal ownership token and returns a token-guarded **unregister
  closure**: it releases the id ONLY if this registration is still the
  occupant, so a route handoff (Vue mounts the incoming page before
  unmounting the outgoing one) can't let the departing nav evict the
  new occupant. (There is no separate `unregister(id, token)` method —
  the returned closure is the only release path.)
- `get(id)` — reactive, **empty-safe** read; never `undefined`. Absent
  ids return a per-id memoized empty entry, so a subscriber to an absent
  id keeps its dependency and lights up when an occupant registers.
- Symbol key `Symbol.for('VCNavigationRegistry')`;
  `tryInjectNavigationRegistry()` returns `undefined` when no plugin is
  installed (standalone navs fall back to a local empty registry).

A `NavigationRegistryEntry` exposes three reactive handles: `items`
(full resolved tree; each item carries `.active` + `.activeWithin`),
`active` (exact active leaf item(s) — read `active.value[0]` for
single-active), and `activeTrail` (ordered root → leaf chain).

**Three active concepts**: `active` (exact current leaf, one best
path-score match — not a prefix match), `activeWithin` (ancestor of the
active branch — drives parent highlight + auto-opens a collapsed
branch), `activeTrail` (ordered root → leaf chain).

**Click-driven selection (url-less section switchers)**: a leaf item
with **no `url`** can't navigate, so a click instead *selects* it. The
root `<VCNavItems>` (resolver mode; `data` undefined) holds a
`selectedTrace` ref and provides a `select(item)` bridge
(`NAVIGATION_SELECT_KEY`, `components/select-context.ts`); each
`<VCNavItem>` injects it and the leaf link fires it on click (via
`VCLink`'s `clicked` emit). The root folds the selected trace into its
active-state derivation —
`trace = selectedTrace.value ?? routeMatch.trace` — so the selected
item lights up `.active`/`activeTrail` exactly as a route match would,
and a publishing nav republishes it through the registry with **zero
app wiring**. The canonical use is a top-nav tab that swaps a dependent
sidebar without navigating (the `examples/nuxt` header → sidebar pair).
A real navigation supersedes the selection: when `currentPath` changes
the root clears `selectedTrace`, handing active state back to path
matching. Only the root nav provides the bridge; nested `<VCNavItems>`
(rendering a parent's injected `.children` via `NAVIGATION_NODES_KEY`)
let the click bubble up
to their owning root, so each root nav has its own selection scope and
the registry stays the only cross-nav channel. The `select` callback is
also exposed on the `#link` slot props for bespoke markup.

**Submenu presentation**: items with children render in place —
`submenu="collapse"` (indented Reka `Collapsible`), `submenu="dropdown"`
(Reka `NavigationMenu` flyout), or `auto` (horizontal → dropdown,
otherwise collapse). A dropdown bar is a **single** `NavigationMenuRoot`:
`<VCNavItem>`'s `renderChildren()` renders a flyout panel's contents in
`collapse` mode (`submenu: props.submenu === 'dropdown' ? 'collapse' :
props.submenu`), NOT by recursing with `submenu="dropdown"`. Nesting a
second `NavigationMenuRoot` inside a flyout's `NavigationMenuContent`
breaks Reka's hover state machine — the panel opens on the first hover
and never reopens — so a group nested inside a flyout degrades to an
inline collapsible instead of a buggy sub-root. (Proper multi-level
flyouts would need Reka's `NavigationMenuSub`, which vuecs does not wire
today.) The structural absolute-flyout CSS lives under the
`[data-reka-navigation-menu]` marker in `assets/index.css`, scoping it
entirely off the collapse/vertical path. Both the dropdown
`NavigationMenuContent` and the collapse `CollapsibleContent` slots are
fed a **per-mount thunk** (`{ default: () => renderChildren() }`), NOT a
pre-computed VNode. Reka's content primitives use `unmountOnHide`, so
they unmount on close and remount on reopen; a VNode can only be
rendered once, so handing back a captured `children` tree mounts an
empty flyout on the second open. The thunk re-runs `renderChildren()`
for each mount so the panel re-renders its links every time it reopens.

**Path source**: when `:path` is omitted, the nav softly reads
`vue-router`'s `$route` global property inside a computed (no static
`vue-router` import), so router-free apps degrade to `undefined`.
`vue-router` is an optional peer dependency.

**Container / item tags (`as` / `itemAs`)**: `<VCNavItems>` renders a
`<ul>` whose items are `<li>` by default. The `as` prop (default `'ul'`,
the list container) and `itemAs` prop (default `'li'`, each item wrapper)
override both — string tag or component, widened to `[String, Object]`
per the wrap convention. `<VCNavItem>` carries the **mirror** pair so the
`as` prop always names the element *that* component renders: `<VCNavItem>`'s
`as` (default `'li'`) is its own wrapper (the separator / leaf / sub-slot
wrapper and the collapse `CollapsibleRoot`'s `as`), and `itemsAs`
(default `'ul'`) is the container tag for its nested submenu list. The two
pairs cross at each forwarding boundary: `<VCNavItems>` passes its `itemAs`
→ `<VCNavItem>`'s `as` and its `as` → `<VCNavItem>`'s `itemsAs`; in
`renderChildren()` the nested `<VCNavItems>` receives `as ← itemsAs` and
`itemAs ← as`. So every nesting level renders the same tags while each
component's `as` describes its own root element. Honored in **collapse
mode only** — dropdown mode keeps Reka's `NavigationMenuRoot` / `List` /
`Item` primitives untouched (their hover/focus machinery requires their
own elements).
