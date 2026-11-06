# Breadcrumb compound

Semantic-HTML breadcrumb compound, shipped beside `<VCStepper>` (same
"registry-independent nav/IA pattern bundled with the registry"
rationale). **No `reka-ui` dep** — no headless breadcrumb primitive
exists upstream (Radix #2050 open, Reka/Ark none), so it's pure
semantic HTML + theme: `<nav aria-label="Breadcrumb"> > <ol> > <li>`
with `aria-current="page"` on the current crumb.

### Component set (7 parts)

`<VCBreadcrumb>` (root + driver) + `<VCBreadcrumbList>` (`<ol>`) /
`<VCBreadcrumbItem>` (`<li>`) / `<VCBreadcrumbLink>` (composes `VCLink`)
/ `<VCBreadcrumbPage>` (current / url-less `<span>`) /
`<VCBreadcrumbSeparator>` (`<li aria-hidden role="presentation">`) /
`<VCBreadcrumbEllipsis>`. Only `<VCBreadcrumb>` is **generic over
`Item extends BreadcrumbItem`** (the `GenericComponentShape` facade from
`@vuecs/core` — same cast as `<VCTable>` / `<VCList>`; the inference
source is `:items`, surfaced back through `#item` / `#item-label`
slots). The other six read context and stay non-generic. Drift-guarded
by `packages/navigation/test/types/breadcrumb.test-d.ts`.

### Three sources, one render path

`<VCBreadcrumb>` resolves an effective trail with precedence: explicit
**`:items`** (the floor) → **`:registry-id`** derivation → empty
(manual-compound `default` slot). Per-crumb rendering: `item.disabled`
→ `<VCBreadcrumbPage aria-disabled>`; has `to`/`href` → live
`<VCBreadcrumbLink active>` (APG keeps the current crumb a real link
carrying `aria-current="page"`); url-less → `<VCBreadcrumbPage>` that
can still fire the root's `@select`. Index-based ellipsis collapse via
`:max-items` + `itemsBeforeCollapse` / `itemsAfterCollapse`. The
default ellipsis is a decorative glyph; the `#ellipsis="{ hidden }"`
slot exposes the collapsed crumbs so a consumer can reveal them
(e.g. a `@vuecs/overlays` dropdown — the Nuxt-UI "custom slot"
pattern, kept a call-site composition rather than a built-in overlays
dep). When that slot is present, `<VCBreadcrumbEllipsis>` drops its
`aria-hidden` so the interactive trigger stays in the a11y tree.

### Registry derivation (the `activeTrail` bridge)

`useBreadcrumbFromRegistry(id)` maps a published nav's
`registry.get(id).activeTrail` (a reactive, empty-safe
`ComputedRef<NavigationItemNormalized[]>`) → `BreadcrumbItem[]`
(`node.name`→`label`, `node.url`→`to`, `node.icon`, `node.active`→
`current`). Decoupled (helper-first) so the standalone `:items` path is
always the floor. Honest seams documented in the plan: the crumb label
is the nav item's `name` (a route's dynamic title isn't in the trail —
use `useBreadcrumbLeaf()`); url-less section nodes render as
non-navigable crumbs.

### Dynamic items — derive, never mutate (+ opt-in manager)

The trail is a pure `computed` off path state, so it is SSR-correct on
first paint and self-heals on back/forward + deep-link with **no
push/pop**. The one imperative seam for dynamic `/:id` page titles is
`useBreadcrumbLeaf(id?)` → `{ set, clear }`: `<VCBreadcrumb>` owns its
own `currentPath` (soft `$route` read, no static `vue-router` import)
and **auto-clears the override on route change**. Targeting is "both" —
nearest-ancestor injection by default, an optional `:leaf-id` (resolved
through an app-scoped `BreadcrumbLeafRegistry`) for the rare
two-breadcrumb case. `useBreadcrumbItems({ home? })` is the route-meta
floor (derives from `route.matched` + `meta.breadcrumb`).

An **opt-in** `useBreadcrumb()` push/pop/replace/reset manager exists
for genuinely non-route-driven (wizard-style) flows. It is
**app-scoped** (`provideBreadcrumbManager` in `install()` via
`@vuecs/core`'s app-aware provide/inject), deliberately **not** a
module singleton — a singleton would leak the trail across concurrent
SSR requests (the documented `useToast()` hazard, which for breadcrumbs
is realized on every render). Consumers bind its reactive `items` into
`<VCBreadcrumb :items>`.

### Theme keys + i18n

Three theme keys: `breadcrumb` (`root` / `list` / `link` / `page` /
`ellipsis`), `breadcrumbItem` (`root`), `breadcrumbSeparator` (`root`),
shipped across all three themes. theme-tailwind uses `aria-[current=
page]:` / `aria-[disabled=true]:` attribute variants; theme-bootstrap /
theme-bulma bridge `.breadcrumb` natively and gap-fill the
attribute-selector states in `assets/index.css` (Bulma additionally
suppresses its native `li + li::before` divider so only the explicit
`<VCBreadcrumbSeparator>` element paints). Behavioral defaults
(`useComponentDefaults('breadcrumb', …)`): `label` (the `<nav>` aria
name), `separatorIcon` / `separatorGlyph`, `ellipsisLabel` /
`ellipsisGlyph`. The lucide / font-awesome icon presets register a
chevron `separatorIcon`.
