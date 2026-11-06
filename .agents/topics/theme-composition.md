# Theme Architecture

Theme packages (`theme-bootstrap`, `theme-tailwind`) are functions returning `Theme` objects with an `elements` map. They configure component appearance via CSS class mappings and optional variant definitions. Multiple themes are merged in array order. `@vuecs/theme-tailwind` ships a `twMerge`-backed `merge` function pre-wired as its `classesMergeFn` and exports it as `merge: ClassesMergeFn` for reuse in overrides.

```typescript
// Theme type structure
type Theme = {
    elements: Partial<ThemeElements>;    // component name -> ThemeElementDefinition
    classesMergeFn?: ClassesMergeFn;     // optional merge function for extend()
};

// Element definition in themes/overrides
type ThemeElementDefinition<T> = {
    classes?: ThemeClassesOverride<T>;   // slot class overrides
    variants?: VariantDefinitions<T>;    // variant definitions
    compoundVariants?: CompoundVariantDefinition<T>[];
    defaultVariants?: DefaultVariants;
};

// Component defaults (concrete strings, not overrides)
type ComponentThemeDefinition<T> = {
    classes: T;                          // slot class defaults
    variants?: VariantDefinitions<T>;
    compoundVariants?: CompoundVariantDefinition<T>[];
    defaultVariants?: DefaultVariants;
};
```

### Variant System

Variants allow declarative state-based and size-based class variations. Variant definitions can be provided in component defaults, themes, and overrides.

**Merge rules across layers:**
- `variants`: deep merge at variant-value level (later layer wins per variant name + value)
- `compoundVariants`: concatenate from all layers
- `defaultVariants`: shallow merge (later layer wins per key)

**Boolean variants** use string keys `'true'`/`'false'` in definitions. At resolution, boolean values are coerced via `String(value)`.

**Compound variants** match when all conditions in their `variants` field match current values:

```typescript
compoundVariants: [
    { variants: { busy: true, size: 'lg' }, class: { root: 'cursor-wait' } },
]
```

**Where variants live.** Variant definitions overwhelmingly live in
the **theme packages** (`@vuecs/theme-tailwind` / `@vuecs/theme-bootstrap`)
rather than in component defaults — the component declares the slot
shape (`ThemeClasses`), the theme decides what each variant value
adds to each slot. This keeps component code minimal and lets two
themes ship dramatically different visuals (Tailwind utilities vs
Bootstrap class names) for the same axis. Components that compose
into the theme do NOT need their own `variants:` entry in defaults
unless the variant is structural (e.g. orientation-driven layout).

### Per-component variant catalog

| Component | Axis | Values | Notes |
|---|---|---|---|
| Button | `variant` × `color` × `size` | solid/outline/soft/ghost/link × primary/neutral/success/warning/error/info × xs/sm/md/lg | Full matrix via `compoundVariants` |
| Badge | `variant` × `color` × `size` | solid/soft/outline × six semantic colors × xs/sm/md/lg | Mirrors button |
| Card | `variant` × `interactive` | outline/soft/elevated × boolean | theme-tailwind uses `border + bg-bg` / `bg-bg-muted` / `shadow-md`; theme-bootstrap composes `.card` + `shadow` / `bg-body-tertiary`; theme-bulma uses `.box` + `vc-card-outline` gap-fill |
| CardHeader / CardBody / CardFooter | `padding` | compact/normal/spacious | Set once on `<VCCard padding="…">` and propagated to bands via `provideCardContext()`; per-band props win over the inherited value |
| Alert | `variant` × `color` × `size` | solid/soft/outline × neutral/info/success/warning/error × xs/sm/md/lg | 15-cell `compoundVariants` matrix; `<VCAlertClose>` reuses `closeIcon` / `close` slots on the `alert` element (no separate theme key) |
| CollapseTrigger | `chevron` | auto/none | Drives visibility of the auto-rendered chevron icon (Iconify name from `ComponentDefaults['collapseTrigger'].chevronIcon`) |
| Tag | `size` | xs/sm/md/lg | Matches badge sizing |
| Avatar | `size` | xs/sm/md/lg | Theme-bootstrap uses `vc-avatar-{sm,lg}` helpers |
| Pagination | `variant` × `size` | outline/soft/ghost × xs/sm/md/lg | |
| Table | `density` × `striped` × `bordered` × `hover` × `stickyHeader` | compact/normal/spacious × boolean × boolean × boolean × boolean | Whole-table chrome; sortable headers driven by per-column `:sortable` |
| TableRow | `disabled` / `selected` / `focused` / `rowVariant` | boolean × boolean × boolean × success/warning/error/info/neutral/primary | `rowVariant` resolved from `row._rowVariant` |
| TableCell | `align` / `stickyColumn` / `cellVariant` | left/center/right × boolean × six semantic colors | `cellVariant` resolved from `row._cellVariants[columnKey]` |
| TableHeadCell | `align` / `stickyColumn` / `sorted` | left/center/right × boolean × asc/desc/none | `sorted` drives the indicator span + `aria-sort` |
| TableEmpty | `filtered` | boolean | Distinct copy / style for empty-after-filter vs empty-no-data |
| TableLoading | `overlay` | boolean | In-table band default vs absolute overlay for refresh-feedback |
| FormInput / FormTextarea / FormSelect / FormNumber / FormTags | `size` × `severity` | xs/sm/md/lg × error/warning | theme-tailwind uses padding+font utilities + `border-error/warning-500` rings; theme-bootstrap uses `form-control-{sm,lg}` (+ `is-invalid` for both severities — BS5 doesn't ship a soft variant); theme-bulma uses `is-small/large` + native `is-danger`/`is-warning`. `severity` is folded in automatically from the surrounding `<VCFormGroup>` via `provideFormGroupContext` — no per-input wiring. |
| FormSelectSearch | `severity` only | error/warning | No `size` axis (theme entry ships `severity` only) — the search box inherits its sizing from surrounding layout, not a size variant. |
| FormCheckbox / FormSwitch / FormRadio | `size` | xs/sm/md/lg | theme-bootstrap uses `vc-form-{checkbox,switch,radio}-{sm,lg}` helpers from @vuecs/forms structural CSS |
| Modal | `size` | xs/sm/md/lg/xl | theme-tailwind uses `max-w-*`; theme-bootstrap uses `modal-{sm,lg,xl}` |
| AlertDialog | `size` × `tone` | xs/sm/md/lg × six semantic colors | `size` sizes the `content`; `tone` colors the `action` button (drives `useAlertDialog({ tone })`). No `danger` alias |
| Popover / HoverCard | `size` | xs/sm/md/lg | Width + padding tier |
| Tooltip | `size` | xs/sm/md/lg | Padding + font-size only |
| DropdownMenu / ContextMenu | `size` | xs/sm/md/lg | Item padding + min-width |
| Toast | `color` × `variant` | six semantic colors × solid/soft/outline | Mirrors Badge color × variant matrix |
| ToastViewport | `position` | top-{left,right,center}/bottom-{left,right,center} | Six positions; default `top-right` |
| List / ListItem | `density` | compact/normal/spacious | Gap + per-row padding |
| ListItem | `disabled` / `active` / `selected` | boolean | Folded into `themeVariant` from `<VCListItem>`'s props + derived selection state |
| ListLoading | `overlay` | boolean | Refresh-feedback mode — absolute-positioned overlay |
| Navigation | `size` | xs/sm/md/lg | Link padding + icon size |
| Stepper | `size` | xs/sm/md/lg | Indicator + title scale; theme-bootstrap uses `vc-stepper-indicator-{sm,lg}` |
| TreeItem | `size` | xs/sm/md/lg | Row padding + font size. theme-tailwind only today. Set it via `<VCTree :item-theme-variant="{ size }">` — rows are rendered by the driver, so there is no `<VCTreeItem>` call site to put `themeVariant` on |

Components with NO theme variants today: VCSeparator, VCAspectRatio,
VCVisuallyHidden, VCFormPin, VCFormSlider, VCGravatar, VCCountdown,
VCTimeago, VCLink (Link has no theme system at all yet).

#### The `xs` size tier

The `size` axis runs `xs / sm / md / lg` (Modal additionally has `xl`);
`md` is the default; `xs` is the tier below `sm`.
The five typed size unions carry it (`ButtonSize`, `BadgeSize`,
`TagSize`, `AvatarSize`, `AlertSize`); every other size-axis component
takes size via the loose `themeVariant` record, so only the theme
entries needed touching.

Because **Bootstrap 5 and Bulma ship no native size step below `sm`**
(`btn-sm` / `is-small` are the floor), the `xs` tier is gap-fill:

- **Structural helpers** (theme-agnostic, in the component packages) gain
  an `xs` peer beside the existing `sm` / `lg`:
  `vc-avatar-xs`, `vc-form-{checkbox,switch,radio}-xs`,
  `vc-form-select-trigger-xs`, `vc-stepper-indicator-xs`. All three
  themes reference these by name.
- **theme-tailwind** needs no CSS — it emits one-notch-smaller utility
  classes inline (e.g. button `px-2 py-0.5 text-[0.7rem]`).
- **theme-bootstrap** / **theme-bulma** each ship a small set of bridge
  helpers in their `assets/index.css` (`vc-fs-xs`, plus
  `vc-btn-xs` / `vc-pagination-xs` / `vc-form-control-xs` for Bootstrap,
  and `vc-size-xs` for Bulma's `--bulma-control-size`-driven controls).
  Modal `xs` is a distinct narrower tier (260px) added via
  `.vc-modal-content.vc-modal-xs`, following each bridge's existing
  `.vc-modal-content.modal-{sm,lg,xl}` width re-implementation (Reka's
  dialog content has no `.modal-dialog` wrapper for native BS/Bulma
  modal sizing).
  The Bootstrap helpers tighten the relevant `--bs-*` CSS variables;
  the Bulma helpers reduce font-size (Bulma scales control padding in
  `em`). Same "bridge what the framework exposes, gap-fill what it
  doesn't" doctrine as the rest of those bridges.

### Type-Safe Theme Slots (ThemeElements)

`ThemeElements` is an empty augmentable interface with no index signature. Each component package extends it via TypeScript declaration merging to register its component name and typed slot keys. `Theme.elements` uses `Partial<ThemeElements>` so each theme only needs to provide a subset of known components. Internal runtime code casts to `Record<string, ThemeElementDefinition>` for dynamic dispatch by component name.

```typescript
// In @vuecs/core — empty interface for declaration merging
export interface ThemeElements {}

// In a component package (e.g., @vuecs/pagination/src/component.ts)
declare module '@vuecs/core' {
    interface ThemeElements {
        pagination?: ThemeElementDefinition<PaginationThemeClasses>;
    }
}
```

When consumers install component packages, the augmented `ThemeElements` provides:
- Autocomplete for component names in `app.use(vuecs, { overrides: { elements: { /* autocomplete here */ } } })`
- Type checking for slot keys within each component's theme override
- Typo detection for both component names and slot keys in theme definitions

### Composing themes

`@vuecs/core` exposes `defineTheme(config)` for authoring themes that
inherit from one or more existing themes. Config-object form mirroring
`tsconfig`'s `extends` and Vue/Vite's `define*()` doctrine:

```ts
import tailwindTheme from '@vuecs/theme-tailwind';
import { defineTheme, extend } from '@vuecs/core';

export const acmeTheme = () => defineTheme({
    extends: tailwindTheme(),                  // single base
    elements: {
        button: { classes: { root: extend('shadow-2xl') } },
        acmeDataTable: { classes: { /* … */ } },
    },
});
```

Multi-base composition is natural — `extends: [a, b, c]` resolves
left-to-right (rightmost wins), matching `themes: [a, b, c]`
install-time stacking semantics. The current config's own fields apply
last (i.e. they win over everything in `extends`).

**Merge semantics** (per-component `elements[name]` entry):

| Field | Merge rule |
|---|---|
| `classes` | Per-slot: later plain replaces accumulator; `extend()` marker merges via `classesMergeFn` |
| `variants` | Deep merge per variant **name**; last-wins per `(variantName, variantValue)` pair (the slot-class map for that value is replaced wholesale, not merged per-slot) |
| `compoundVariants` | Concatenate from all chain layers |
| `defaultVariants` | Shallow merge per key (later wins) |
| `classesMergeFn` | Last-wins across the chain |
| `colorMode.handle` | Compose: each layer's handler runs in chain order |
| `palette.handle` / `palette.names` | Last-wins (one renderer owns the runtime `<style>` block) |

`useColorMode` and `useColorPalette` dispatch through installed themes' runtime hooks. `mergeThemes()` composes color-mode handlers in chain order and selects the last palette hook for a composed theme.

`defineTheme` is a thin facade over the lower-level pure reducer
`mergeThemes(themes: Theme[]): Theme`, which is also exported for
advanced composition. The reducer is pure (no Vue dependency) and
tested in `packages/core/test/unit/theme/define.spec.ts`.

The primary unblock is **third-party theme publishing**: a library
like `@acme/admin-kit` can publish a single self-contained theme that
builds on `tailwindTheme()` without forcing every consumer to install
Tailwind separately AND remember to stack the override entry. See
plans 022, 023, and 024 (step 4) for the full design rationale.

### Themable-component helpers

`@vuecs/core` ships two small helpers that collapse most of the
themable-component boilerplate without wrapping Vue's `defineComponent`
— so slot typing via `SlotsType<...>`, `expose`, `emits` validators,
generic component types, and `vue-tsc` inference all keep working
unchanged:

- **`themableProps<T>()`** — returns the standard `themeClass` /
  `themeVariant` prop declarations, typed against the slot map `T`.
  Spread into your component's `props` block.
- **`useThemeProps(props, ...shorthandKeys)`** — returns the reactive
  `{ themeClass, themeVariant }` getter pair that `useComponentTheme`
  expects. Folds shorthand variant props (e.g. `color`, `size`,
  `density`) into `themeVariant` so consumers can write either
  `<VCBadge color="primary">` or
  `<VCBadge :theme-variant="{ color: 'primary' }">`.

```ts
const badgeProps = {
    color: { type: String as PropType<BadgeColor>, default: undefined },
    variant: { type: String as PropType<BadgeVariant>, default: undefined },
    size: { type: String as PropType<BadgeSize>, default: undefined },
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'span' },
    // `tag` kept as a deprecated alias (wins over `as` when set) — see #1642.
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    ...themableProps<BadgeThemeClasses>(),
};

export default defineComponent({
    name: 'VCBadge',
    inheritAttrs: false,
    props: badgeProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'badge',
            useThemeProps(props, 'color', 'variant', 'size'),
            badgeThemeDefaults,
        );
        return () => h(props.tag ?? props.as, mergeProps(attrs, { class: theme.value.root }), slots.default?.());
    },
});
```

Eliminates ~12 mechanical lines per themable component (duplicated
prop declarations + the `themeProps` reactive-getter object + manual
shorthand-variant folding) and removes the easy-to-mis-write
reactive-getter pattern. Authoring stays inside Vue's standard
`defineComponent`, so all of Vue's typing machinery applies.

`@vuecs/elements`'s `<VCBadge>` shows the standard helper composition.

Do not wrap `defineComponent` in a `defineThemableComponent` factory: wrapping `defineComponent` would require replicating Vue's
overload-based slot/expose/generic-component inference machinery
(brittle vs. future Vue versions), and the marginal additional savings
(~3 lines per component beyond the helpers) didn't justify the risk
of `vue-tsc` inference regressions.

### Theme-configurable runtime hooks

The `Theme` type carries two optional runtime-hook slots that themes
use to attach framework-specific side effects to color-mode and
palette switching. Both slots are no-ops by default — themes opt in
when they need framework-specific mirroring.

```ts
type Theme = {
    elements: Partial<ThemeElements>;
    classesMergeFn?: ClassesMergeFn;
    colorMode?: { handle(doc: Document, mode: 'light' | 'dark'): void };
    palette?: {
        handle(palette: Record<string, string>): string;
        names?: readonly string[];
        scaleAliases?: Record<string, string>;
    };
};
```

Both hooks are named `handle` (not `apply` / `render`): `apply` would
collide with `Function.prototype.apply` on every object method, and a
symmetric verb across the two slots makes the contract easier to
discover for third-party theme authors.

**`colorMode.handle`** fires after `useColorMode` toggles `.dark` /
`.light` on `<html>`. theme-bootstrap declares it to mirror the
resolved mode onto `data-bs-theme` (so Bootstrap 5.3+ chrome flips
alongside vuecs's `--vc-color-*`); theme-bulma declares it for
`data-theme`. theme-tailwind doesn't declare it — Tailwind reads
`.dark` directly. Multiple hooks compose: every layer's `handle` runs
in install order on every change.

**`palette.{handle, names, scaleAliases}`** is the declarative half
of runtime palette switching. Each theme exposes its renderer (the
function that converts a palette config into a CSS string) plus the
catalog of names it accepts. theme-tailwind and theme-bulma both
declare this against the shared 22-name Tailwind palette catalog.
Themes whose internal scale naming diverges from the canonical six
(community themes using e.g. `brand` instead of `primary`) declare a
`scaleAliases` rename map; the dispatcher translates input keys
before calling `handle` so the public-facing palette config stays
canonical.

`@vuecs/design`'s `useColorPalette()` walks installed themes and
**concatenates** every theme's `palette.handle` output into the
`<style id="vc-color-palette">` block. Per-theme `useColorPalette` exports are deprecated re-exports; import from `@vuecs/design` directly and supply the CSP nonce explicitly:

```ts
import { useColorPalette } from '@vuecs/design';
import { useConfig } from '@vuecs/core';

const { current, set } = useColorPalette({
    nonce: () => useConfig('nonce').value,
});
```

The default sanitizer in `@vuecs/design`'s `useColorPalette` filters
to the canonical catalog (six semantic scales × 22 palette names) —
sufficient for the shipping themes. Themes that widen the palette-
name union via `ExtraColorPaletteNames` pass their own `sanitize`.
The canonical type lives at `@vuecs/design`:

```ts
type ColorPaletteConfig = Partial<Record<SemanticScaleName, ColorPaletteName>>;
```

Concat (rather than last-wins) is the doctrinal semantic: when an
app stacks multiple palette-aware themes (the docs-site case where
Tailwind and Bulma components share the same picker UI), each
theme's renderer emits its own non-overlapping CSS rules — Tailwind
rebinds `--vc-color-*`, Bulma writes per-variant HSL channel vars
+ explicit selectors. The CSS cascade resolves any incidental
overlap with later-rule-wins semantics, so concat behaves like
last-wins for overlapping properties AND emits both themes' unique
properties. Walking `manager.themes` inside the `watchEffect`
subscribes to `setThemes()`, so runtime theme swaps automatically
re-render the `<style>` block.

The hooks bridge across packages without coupling `@vuecs/design` to
`@vuecs/core`: both packages reference the same
`Symbol.for('VCThemeManager')` registry key, and `@vuecs/design`'s
`useThemeRuntimeManager()` looks the manager up via `inject()` with
a structural projection of the slots it needs. No runtime dep, no
type dep — just shared symbol convention.

Bootstrap and Bulma themes own their `data-bs-theme` / `data-theme` synchronization; application code must not duplicate those watchers.

#### SSR dispatch (slice 3)

For Nuxt apps the same hooks need to flow into the rendered head
before first paint, otherwise BS / Bulma chrome flashes light → dark
on hydration. `@vuecs/design` exposes two pure utilities the SSR
plugins consume:

- **`captureColorModeAttrs(themes, mode)`** — runs every theme's
  `colorMode.handle` against a synthetic `Document` whose
  `documentElement.setAttribute` writes into a plain record. The
  record is plumbed into `useHead({ htmlAttrs })` so themes that
  toggle `data-bs-theme` / `data-theme` flow on first paint, not
  just after hydration. Errors per theme are caught + warned so a
  single broken theme can't crash SSR.
- **`renderColorPaletteFromThemes(themes, palette)`** — concatenates
  every theme's `palette.handle` output into a single CSS string.
  Mirrors the client-side `useColorPalette` semantic.

`@vuecs/nuxt`'s `colorMode.server.ts` and `colorPalette.server.ts`
plugins both declare `enforce: 'post'` so they run after user-defined
plugins that install vuecs (`app.use(vuecs, { themes })`) — or after
the module's own auto-generated `vuecs-themes` plugin when
`vuecs: { themes: [...] }` is set. They look up the ThemeManager via
`nuxtApp.vueApp.runWithContext(() => inject(THEME_MANAGER_SYMBOL))`
— same shared-symbol bridge as the client side. Without an installed
manager, both plugins gracefully no-op (color mode still emits
`html.dark`; palette emits no `<style>` block — same semantic as the
client-side dispatcher).

Themes that need DOM operations beyond `setAttribute` /
`removeAttribute` / `classList` (e.g. inserting child nodes during
SSR) are not covered by `captureColorModeAttrs`; those themes
should guard their CSR-only logic with `if (typeof window ===
'undefined') return;` and split the SSR-flowing bits into
declarative `setAttribute` calls.

### Theme audit

`@vuecs/core` exports a pure `auditTheme(theme, expected): AuditResult`
function that compares a `Theme` against an expected catalog of
component defaults. Designed for CI use — drift fails loudly so a
future PR that drops a slot (or adds a typo) doesn't sneak past
review.

```ts
type AuditResult = {
    missingElements: string[];     // expected component names not in theme
    unknownElements: string[];     // theme component names not in expected
    missingSlots: Record<string, string[]>;     // per-element drift
    unknownSlots: Record<string, string[]>;     // per-element typos
    redundantStructural: Record<string, string[]>;  // theme value === default (no value-add; missed extend())
};
```

The expected catalog is `Record<string, ComponentThemeDefinition>` —
the same shape each component package's `*ThemeDefaults` export
already has. Tests build the catalog by importing defaults from each
component package directly:

```ts
import { auditTheme, isAuditClean, formatAuditResult } from '@vuecs/core';
import { badgeThemeDefaults } from '@vuecs/elements';
import { buttonThemeDefaults } from '@vuecs/button';
import tailwindTheme from '@vuecs/theme-tailwind';

const result = auditTheme(tailwindTheme(), {
    badge: badgeThemeDefaults,
    button: buttonThemeDefaults,
    // …
});
if (!isAuditClean(result)) {
    throw new Error(formatAuditResult(result, { title: 'theme-tailwind audit' }));
}
```

Companion APIs:
- **`isAuditClean(result)`** — predicate; `true` only when every
  category is empty.
- **`formatAuditResult(result, { title?, skip? })`** — pretty-prints
  the report for test assertions and CI logs. Empty string when
  clean. The `skip` option suppresses categories during in-progress
  migrations (e.g. accept `redundantStructural` warnings while
  rolling out a refactor).

The audit checks `theme.elements[name].classes` only — variants and
compound variants are out of scope for v1. Slots wrapped in
`extend()` markers are never flagged as `redundantStructural` (the
marker signals deliberate augmentation, not redefinition).

Per-theme audit tests ship in
`themes/{tailwind,bootstrap,bulma}/test/unit/audit.spec.ts`. Each spec imports the exposed
`*ThemeDefaults` from every component package — `@vuecs/{button,
countdown, elements, forms, gravatar, list, navigation, overlays,
pagination, timeago}` — and runs `auditTheme()` against the theme.
The catalog covers **43 components total**.

The enforced categories (audit fails on these): `redundantStructural`
(theme passes a no-value-add class string that matches the component
default — flags missed `extend()` markers), `unknownElements` (theme
entries for component names that don't exist — typo catch), and
`unknownSlots` (theme entries with slot names that don't exist —
typo catch).

The suppressed categories (skip-listed, surface drift but don't fail
the spec): `missingElements` (theme has no entry for a component —
many components have empty `vc-*` defaults that themes legitimately
don't need to override) and `missingSlots` (theme entry exists but
doesn't override every default slot — themes commonly inherit
structural slots like `vc-button-leading` without re-styling them).

A pinned `isAuditClean(result) === false` assertion in each spec
serves as a "drift still exists" marker. When a theme catches up to
full coverage, that assertion starts failing and prompts the
suppression to be tightened (or removed) in the same PR.

Every component package's `*ThemeDefaults` is importable from the
top-level barrel — third-party theme authors can reference vuecs's
canonical class strings via `extend()` to layer on top without
duplicating them.

### CSP nonce wiring

Runtime palette switching writes inline CSS into a
`<style id="vc-color-palette">` block. Under a strict
Content-Security-Policy that disallows `style-src 'unsafe-inline'`,
the browser blocks the block unless it carries a matching `nonce`
attribute issued by the server per-request.

vuecs threads a CSP nonce end-to-end:

1. **`@vuecs/theme-tailwind` and `@vuecs/theme-bulma`** each augment
   `Config['nonce']` via TypeScript declaration merging — consumers
   set it once via `app.use(vuecs, { config: { nonce } })` or
   subtree-scope via `<VCConfigProvider :config="{ nonce }">`.
2. **`applyColorPaletteCss(css, doc?, nonce?)`** in `@vuecs/design`
   takes the nonce as a third positional parameter, writes it to the
   `<style>` element on creation, updates it on subsequent calls when
   the value changes, and clears it when the new value is `undefined`
   (so consumers can revoke a stale nonce on policy update).
3. **`BindColorPaletteOptions.nonce` and `UseColorPaletteOptions.nonce`**
   accept `string | (() => string | undefined)`. The getter form is
   invoked on each `<style>` re-apply so reactive `setConfig({ nonce })`
   propagates.
4. **CSP-strict consumers pass `nonce` explicitly** to
   `useColorPalette` from `@vuecs/design`:
   ```ts
   useColorPalette({ nonce: () => useConfig('nonce').value })
   ```
5. **`@vuecs/nuxt`'s palette SSR plugin** resolves the nonce via
   `nuxtApp.vueApp.runWithContext(() => useConfig('nonce').value)` and
   emits it via `useHead({ style: [{ ..., nonce }] })` so the
   server-rendered block matches the per-request CSP header on first
   paint.

`setColorPalette(palette, doc?, nonce?)` from each theme accepts the
nonce as a third positional parameter for direct (non-composable)
callers.
