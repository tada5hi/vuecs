# Architecture

## Vue Plugin Pattern

All component packages follow the standard Vue 3 plugin pattern. Each exports an `install` function and a default plugin object:

```typescript
// Typical package entry (src/index.ts)
import { installDefaultsManager, installThemeManager } from '@vuecs/core';

export * from './components';
export * from './type';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);
    // Register components globally
}

export default { install } satisfies Plugin<[Options?]>;
```

Consumers can use either `app.use(plugin)` for global registration or import components individually.

## Theme System (@vuecs/core)

The core package provides a theme resolution system for CSS class management across all component packages, with support for structured variants.

### Theme Definition Shape

Theme definitions use a `classes` sub-object to separate slot classes from variant configuration:

```typescript
// Component defaults
const listItemDefaults = {
    classes: {
        root: 'vc-list-item',
        icon: 'vc-list-item-icon',
        actions: 'vc-list-item-actions',
    },
    variants: {
        size: {
            sm: { root: 'py-1', icon: 'size-4' },
            lg: { root: 'py-3', icon: 'size-6' },
        },
        busy: {
            true: { root: 'opacity-50' },
        },
    },
    compoundVariants: [
        { variants: { busy: true, size: 'lg' }, class: { root: 'cursor-wait' } },
    ],
    defaultVariants: { size: 'md' },
};
```

### Theme Resolution

CSS classes for named **elements** (logical parts of a component like `root`, `icon`, `actions`) are resolved through four layers:

```
1. Component defaults (vc-* structural classes, co-located in each component)
2. Themes (merged in array order)
3. Overrides (passed to app.use())
4. Instance `themeClass` prop (per-component override)
```

After slot class resolution, **variant resolution** applies:

```
5. Extract variant definitions from defaults, themes, overrides (merge across layers)
6. Apply variant values against merged definitions
7. Evaluate compound variant conditions
8. Merge variant classes into resolved slot classes
```

**Themes** (layer 2) always **merge** with component defaults — the `vc-*` structural classes are always preserved. Between themes, a later plain value replaces the earlier theme's contribution but still keeps defaults. **Overrides** (layer 3) and **instance props** (layer 4) **replace** by default. To merge instead, wrap the value with `extend()`.

### Key APIs

- **`ThemeManager`** — Holds config state (themes, overrides) as `shallowRef`s, delegates to `resolveComponentTheme()` and `resolveVariantClasses()`. Supports runtime updates via `setThemes()` and `setOverrides()`.
- **`installThemeManager(app, options)`** — Vue plugin that provides ThemeManager via `app.provide()`
- **`injectThemeManager()`** — Retrieves ThemeManager from Vue inject
- **`useComponentTheme(name, props, defaults)`** — Vue composable. `props` is the component's reactive props object; the composable reads `props.themeClass` and `props.themeVariant` internally. Returns `ComputedRef<T>` that recomputes when `props.themeClass`, `props.themeVariant`, or ThemeManager state changes. Throws if ThemeManager is not installed.
- **`extend(value)`** — Marker function: merge with lower layer instead of replacing (only needed in overrides and instance props; themes always merge with defaults)
- **`resolveComponentTheme()`** — Pure function (no Vue dependency): resolves 4 layers into final class strings
- **`extractVariantConfig()`** — Pure function: merges variant definitions from all layers
- **`resolveVariantClasses()`** — Pure function: applies variant values to resolved definitions

### Architecture

```
@vuecs/core/src/theme/
  constants.ts   <- EXTEND_SYMBOL
  types.ts       <- Type definitions (ThemeClasses, ThemeElements, ComponentThemeDefinition, etc.)
  extend.ts      <- extend() marker, isExtendValue() guard
  resolve.ts     <- Pure function: resolves defaults + themes + overrides + instance -> classes
  variant.ts     <- Pure functions: extractVariantConfig(), resolveVariantClasses()
  manager.ts     <- ThemeManager class (shallowRef state, delegates to resolve + variant)
  composable.ts  <- useComponentTheme() - Vue composable wrapping resolve()
  install.ts     <- installThemeManager() / injectThemeManager() - Vue provide/inject
```

The resolution logic (`resolve.ts`, `variant.ts`) has zero Vue imports — testable with plain unit tests, no `createApp()` needed. The `ThemeManager` uses Vue's `shallowRef` for reactive state, enabling `computed()` in composables to automatically track theme changes.

### Setup API

```typescript
import vuecs, { extend } from '@vuecs/core';
import bootstrap from '@vuecs/theme-bootstrap';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    themes: [bootstrap()],
    icons:  [lucide()],
    overrides: {
        elements: {
            listItem: { classes: { root: extend('border-b') } },
            button: { classes: { root: 'my-custom-btn' } },
        },
    },
});
```

### Component Internals

Each component calls `useComponentTheme(name, props, defaults)` in setup. The composable reads `props.themeClass` and `props.themeVariant` directly — Vue's reactive props proxy makes the returned `ComputedRef` reactive without `toRef` wrapping:

```typescript
setup(props) {
    const theme = useComponentTheme('listItem', props, {
        classes: {
            root: 'vc-list-item',
            actions: 'vc-list-item-actions',
        },
        variants: {
            size: {
                sm: { root: 'py-1' },
                lg: { root: 'py-3' },
            },
        },
        defaultVariants: { size: 'md' },
    });
    // theme.value.root -> reactive resolved class string
    // Recomputes when props.themeClass, props.themeVariant, or ThemeManager state changes
    return () => h('div', { class: theme.value.root }, [...]);
}
```

Components expose two theme-related props (on every component that uses the theme system):
- **`themeClass`** — Slot class overrides (flat: `{ root: 'my-class' }`)
- **`themeVariant`** — Variant values (flat: `{ size: 'sm', busy: true }`)

The composable signature `(name, props, defaults)` matches `useComponentDefaults(name, props, hardcoded)` — both read convention-named keys off the component's reactive `props` object.

## Theme Architecture

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
| Button | `variant` × `color` × `size` | solid/outline/soft/ghost/link × primary/neutral/success/warning/error/info × sm/md/lg | Full matrix via `compoundVariants` |
| Badge | `variant` × `color` × `size` | solid/soft/outline × six semantic colors × sm/md/lg | Mirrors button |
| Card | `variant` × `interactive` | outline/soft/elevated × boolean | theme-tailwind uses `border + bg-bg` / `bg-bg-muted` / `shadow-md`; theme-bootstrap composes `.card` + `shadow` / `bg-body-tertiary`; theme-bulma uses `.box` + `vc-card-outline` gap-fill |
| CardHeader / CardBody / CardFooter | `padding` | compact/normal/spacious | Set once on `<VCCard padding="…">` and propagated to bands via `provideCardContext()`; per-band props win over the inherited value |
| Tag | `size` | sm/md/lg | Matches badge sizing |
| Avatar | `size` | sm/md/lg | Theme-bootstrap uses `vc-avatar-{sm,lg}` helpers |
| Pagination | `variant` × `size` | outline/soft/ghost × sm/md/lg | |
| Table | `density` × `striped` × `bordered` × `hover` × `stickyHeader` | compact/normal/spacious × boolean × boolean × boolean × boolean | Whole-table chrome; sortable headers driven by per-column `:sortable` |
| TableRow | `disabled` / `selected` / `focused` / `rowVariant` | boolean × boolean × boolean × success/warning/error/info/neutral/primary | `rowVariant` resolved from `row._rowVariant` (plan 028) |
| TableCell | `align` / `stickyColumn` / `cellVariant` | left/center/right × boolean × six semantic colors | `cellVariant` resolved from `row._cellVariants[columnKey]` |
| TableHeadCell | `align` / `stickyColumn` / `sorted` | left/center/right × boolean × asc/desc/none | `sorted` drives the indicator span + `aria-sort` |
| TableEmpty | `filtered` | boolean | Distinct copy / style for empty-after-filter vs empty-no-data |
| TableLoading | `overlay` | boolean | In-table band default vs absolute overlay for refresh-feedback |
| FormInput / FormTextarea / FormSelect / FormNumber / FormTags | `size` | sm/md/lg | theme-tailwind uses padding+font utilities; theme-bootstrap uses `form-control-{sm,lg}` (and input-group-{sm,lg} for groups) |
| FormCheckbox / FormSwitch / FormRadio | `size` | sm/md/lg | theme-bootstrap uses `vc-form-{checkbox,switch,radio}-{sm,lg}` helpers from @vuecs/forms structural CSS |
| Modal | `size` | sm/md/lg/xl | theme-tailwind uses `max-w-*`; theme-bootstrap uses `modal-{sm,lg,xl}` |
| Popover / HoverCard | `size` | sm/md/lg | Width + padding tier |
| Tooltip | `size` | sm/md/lg | Padding + font-size only |
| DropdownMenu / ContextMenu | `size` | sm/md/lg | Item padding + min-width |
| Toast | `color` × `variant` | six semantic colors × solid/soft/outline | Mirrors Badge color × variant matrix |
| ToastViewport | `position` | top-{left,right,center}/bottom-{left,right,center} | Six positions; default `top-right` |
| List / ListItem | `density` | compact/normal/spacious | Gap + per-row padding |
| ListItem | `disabled` / `active` / `selected` | boolean | Folded into `themeVariant` from `<VCListItem>`'s props + derived selection state |
| ListLoading | `overlay` | boolean | Refresh-feedback mode — absolute-positioned overlay |
| Navigation | `size` | sm/md/lg | Link padding + icon size |
| Stepper | `size` | sm/md/lg | Indicator + title scale; theme-bootstrap uses `vc-stepper-indicator-{sm,lg}` |

Components with NO theme variants today: VCSeparator, VCAspectRatio,
VCVisuallyHidden, VCFormPin, VCFormSlider, VCGravatar, VCCountdown,
VCTimeago, VCLink (Link has no theme system at all yet).

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

### Composing themes (`defineTheme`, plan 022)

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
| `colorMode.handle` (plan 021 forward-compat) | Compose: each layer's handler runs in chain order |
| `palette.handle` / `palette.names` (plan 021 forward-compat) | Last-wins (one renderer owns the runtime `<style>` block) |

The `colorMode` and `palette` slots are reserved on `Theme` ahead of
plan 021's runtime; they type-check today but are no-ops until plan
021 ships the `useColorMode` / `useColorPalette` runtime that walks
installed themes and dispatches through them.

`defineTheme` is a thin facade over the lower-level pure reducer
`mergeThemes(themes: Theme[]): Theme`, which is also exported for
advanced composition. The reducer is pure (no Vue dependency) and
tested in `packages/core/test/unit/theme/define.spec.ts`.

The primary unblock is **third-party theme publishing**: a library
like `@acme/admin-kit` can publish a single self-contained theme that
builds on `tailwindTheme()` without forcing every consumer to install
Tailwind separately AND remember to stack the override entry. See
plans 022, 023, and 024 (step 4) for the full design rationale.

### Themable-component helpers (`themableProps` / `useThemeProps`, plan 024 step 5b)

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
    tag: { type: String, default: 'span' },
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
        return () => h(props.tag, mergeProps(attrs, { class: theme.value.root }), slots.default?.());
    },
});
```

Eliminates ~12 mechanical lines per themable component (duplicated
prop declarations + the `themeProps` reactive-getter object + manual
shorthand-variant folding) and removes the easy-to-mis-write
reactive-getter pattern. Authoring stays inside Vue's standard
`defineComponent`, so all of Vue's typing machinery applies.

`@vuecs/elements`'s `<VCBadge>` is the canonical dogfood site —
60 lines collapsed to 44, with no behavioural change.

A higher-level `defineThemableComponent` factory was prototyped and
rejected: wrapping `defineComponent` would require replicating Vue's
overload-based slot/expose/generic-component inference machinery
(brittle vs. future Vue versions), and the marginal additional savings
(~3 lines per component beyond the helpers) didn't justify the risk
of `vue-tsc` inference regressions.

### Theme-configurable runtime hooks (`Theme.colorMode` / `Theme.palette`, plan 021)

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
canonical (plan 026).

`@vuecs/design`'s `useColorPalette()` walks installed themes and
**concatenates** every theme's `palette.handle` output into the
`<style id="vc-color-palette">` block. Since plan 026 the per-theme
`useColorPalette` exports in `@vuecs/theme-tailwind` and
`@vuecs/theme-bulma` are deprecated re-exports from `@vuecs/design`
— consumers import from `@vuecs/design` directly. The CSP nonce
that the deprecated wrappers used to auto-wire via
`useConfig('nonce')` is now opt-in:

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

Net effect: BS / Bulma example apps no longer need per-app
`watchEffect` mirrors for `data-bs-theme` / `data-theme`. The pattern
that previously repeated for every consumer now lives in the theme
exactly once.

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

### Theme audit (`auditTheme`, plan 015 P5 / plan 024 step 7)

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
`themes/{tailwind,bootstrap,bulma}/test/unit/audit.spec.ts` (plan 024
slice 7b + slice 7b expansion). Each spec imports the exposed
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

### CSP nonce wiring (plan 017 known gap / plan 024 step 8)

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
   (Plan 026 collapsed the per-theme `useColorPalette` wrappers that
   previously auto-wired this — see the SPA composables section
   above. The trade-off: ~80 LOC of wrapper duplication removed in
   exchange for opt-in nonce wiring at CSP-relevant call sites.)
5. **`@vuecs/nuxt`'s palette SSR plugin** resolves the nonce via
   `nuxtApp.vueApp.runWithContext(() => useConfig('nonce').value)` and
   emits it via `useHead({ style: [{ ..., nonce }] })` so the
   server-rendered block matches the per-request CSP header on first
   paint.

`setColorPalette(palette, doc?, nonce?)` from each theme accepts the
nonce as a third positional parameter for direct (non-composable)
callers.

## Global Behavioral Defaults (#1491)

Alongside the theme system, `@vuecs/core` exposes a parallel `DefaultsManager` for
non-class behavioral props (button text, placeholder strings, visibility toggles,
content strings). This is the mechanism for i18n and project-wide customization
without per-instance overrides.

### Resolution order

For each resolved key, the composable walks three layers:

```
1. Instance prop (non-undefined)            ← highest priority
2. Global defaults (from app.use() config)  ← may be MaybeRef (ref / computed)
3. Hardcoded fallback (passed to composable) ← lowest priority
```

Global default values are wrapped via `MaybeRef`, so reactive sources
(`computed(() => t('actions.create'))`) unwrap transparently and the returned
`ComputedRef` recomputes on locale changes.

### Resolution contract (important for component authors)

Two rules govern what ends up on `defaults.value`:

- **`hardcoded` drives the shape.** The composable iterates `Object.keys(hardcoded)`;
  any global-default key that isn't listed in `hardcoded` is silently dropped.
  Treat the `hardcoded` object as the source of truth when adding new
  configurable keys — if you register a new key on `ComponentDefaults` via
  declaration merging, add it to `hardcoded` too.
- **Only `undefined` triggers fallthrough.** `null` on the instance prop wins
  over both global and hardcoded layers. This lets consumers deliberately
  "unset" a value, but means `null` cannot be used to toggle a boolean off
  (pass `false` instead).

### Composite components must forward `undefined`

When a composite component forwards behavioral props to a child component
whose prop is resolved via `useComponentDefaults`, the composite's own Vue
`prop.default` must be `undefined`. A composite with
`prop: { default: 'something' }` that forwards `something` to the child will
always win layer 1 on the child and shadow the child's global defaults.

The compound redesign of `@vuecs/list` eliminated this exact category of
forwarding (each part now reads from context directly), so there is no
in-tree example today. Reach for this pattern when wrapping a vuecs
component in your own composite that opts into the same behavioral-defaults
flow.

### Setup API

```typescript
import vuecs from '@vuecs/core';
import bootstrap from '@vuecs/theme-bootstrap';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    themes: [bootstrap()],
    icons: [lucide()],
    defaults: {
        submitButton: {
            createText: computed(() => t('actions.create')),
            updateText: 'Aktualisieren',
        },
        listEmpty: {
            content: 'Keine Einträge vorhanden...',
        },
        formSelect: {
            placeholder: '-- Auswählen --',
        },
    },
});
```

### Component consumption

Components drop Vue-level prop defaults (so `undefined` means "fall through") and
resolve via the composable. The same composable powers experimental
*standalone* hooks like `useSubmitButton()` in `@vuecs/forms` —
the only difference is that the "props" arg is an empty object so every
key falls through to the global defaults / hardcoded layer.

```typescript
const behavioralDefaults = { createText: 'Create', updateText: 'Update', createIcon: '' };

// Inside a Vue composable (no `setup` props):
const defaults = useComponentDefaults('submitButton', {}, behavioralDefaults);
// defaults.value.createText → reactive resolved value
```

### Key APIs

- **`DefaultsManager`** — Holds the `Partial<ComponentDefaults>` map in a `shallowRef`. Supports runtime updates via `setDefaults()`.
- **`installDefaultsManager(app, options)`** — Vue plugin that provides DefaultsManager via `app.provide()`. Called from the top-level `install()` in `@vuecs/core` and from every component package's `install()`.
- **`injectDefaultsManager()`** — Retrieves the DefaultsManager from Vue inject.
- **`useComponentDefaults(name, props, hardcoded)`** — Vue composable. Returns `ComputedRef<T>` that recomputes when props or DefaultsManager state change. Throws if the DefaultsManager is not installed.

### Type-Safe Component Defaults (ComponentDefaults)

`ComponentDefaults` is an empty augmentable interface with no index signature.
Each component package extends it via TypeScript declaration merging to register
its component name and typed default shape. Values are wrapped with
`ComponentDefaultValues<T>`, which maps each field to `MaybeRef<T[K] | undefined>`
so reactive and plain values are both accepted.

```typescript
// In @vuecs/core
export interface ComponentDefaults {}
export type ComponentDefaultValues<T> = {
    [K in keyof T]?: MaybeRef<T[K] | undefined>;
};

// In a component package (or composable module)
declare module '@vuecs/core' {
    interface ComponentDefaults {
        submitButton?: ComponentDefaultValues<SubmitButtonDefaults>;
    }
}
```

### Architecture

```
@vuecs/core/src/defaults/
  types.ts       <- ComponentDefaults (augmentable), ComponentDefaultValues<T>, DefaultsManagerOptions
  manager.ts     <- DefaultsManager class (shallowRef state, get() by component name)
  install.ts     <- installDefaultsManager() / injectDefaultsManager() — Vue provide/inject
  composable.ts  <- useComponentDefaults() — Vue composable; unref's MaybeRef values per key
```

The theme and defaults systems are intentionally decoupled: themes handle CSS
classes, defaults handle everything else. The top-level `CoreOptions` type and
`install()` function tie them together so consumers configure both in one call.

### Migrated components

The following components resolve the listed behavioral props via
`useComponentDefaults`:

| Component / hook | Keys |
|------------------|------|
| `useSubmitButton()` (`submitButton`) | `createText`, `updateText`, `createIcon`, `updateIcon`, `createColor`, `updateColor` |
| `VCFormSelect` | `placeholder` |
| `VCFormGroup` | `validation` |
| `VCFormCheckbox` | `labelContent` |
| `VCFormSwitch` | `labelContent` |
| `VCListEmpty` | `content` |
| `VCPagination` | `firstIcon`, `prevIcon`, `nextIcon`, `lastIcon`, `firstLabel`, `prevLabel`, `nextLabel`, `lastLabel` |

For these props the Vue `prop.default` is `undefined`; the effective default now
lives in the component's `behavioralDefaults` constant, which is passed to the
composable as the lowest-priority layer. The `submitButton` row is unusual —
it's the only entry without a corresponding `VC*` component. The previous
`VCFormSubmit` was decomposed into `VCButton` (in `@vuecs/button`) plus a
`useSubmitButton()` reactive bind-object helper (in `@vuecs/forms`,
marked `@experimental`); the defaults registration moved with the helper.

## Icons (@vuecs/icon + presets)

Icons are an **icon-name vocabulary** layer that sits beside themes and
behavioral defaults. Components expose icon-name props (Iconify strings like
`'lucide:plus'`) which `<VCIcon>` resolves at render time. Themes don't inject
icon classes anymore — that responsibility split out into the icon presets.

### Layers

```
1. <VCIcon name="lucide:plus" />          ← runtime component (@vuecs/icon)
2. component prop (e.g. VCPagination.prevIcon)
3. icons: [lucide()] preset               ← populates DefaultsManager keys
4. consumer defaults (defaults: { pagination: { prevIcon: '…' } })
5. behavioralDefaults (component-local, lowest priority)
```

The `icons:` slot in `CoreOptions` accepts an array of `Icon` objects:

```ts
import type { Icon } from '@vuecs/core';

export type Icon = {
    defaults?: Partial<ComponentDefaults>;
};
```

`@vuecs/core`'s top-level `install()` merges every preset's `defaults` into the
DefaultsManager (in array order, with consumer-supplied `defaults:` winning).
After merge, the icon-prop layer disappears — every prop resolves through the
existing behavioral-defaults pipeline. So presets are pure config; no new
manager, no new composable.

### `<VCIcon>`

Thin wrapper around `@iconify/vue`'s `<Icon>`. Single required prop `name`
(Iconify string), all other attrs forwarded. Globally registered when
`@vuecs/icon`'s plugin is installed. Lives in `packages/icon/`.

`<VCIcon>` does NOT bundle icon data. Consumers wire delivery via:
- `@nuxt/icon` (Nuxt apps)
- Manual `addCollection()` from an `@iconify-json/<collection>` package (Vite/SPA)
- Iconify's runtime CDN (default fallback)

### Presets

Pure-data packages in the top-level `icons/` directory (parallel to `packages/`
and `themes/`). Each is a function returning `Icon`:

```ts
// icons/lucide/src/index.ts
import type { Icon } from '@vuecs/core';

export default function lucideIcons(): Icon {
    return {
        defaults: {
            pagination: {
                firstIcon: 'lucide:chevrons-left',
                prevIcon: 'lucide:chevron-left',
                nextIcon: 'lucide:chevron-right',
                lastIcon: 'lucide:chevrons-right',
            },
            submitButton: {
                createIcon: 'lucide:plus',
                updateIcon: 'lucide:save',
            },
        },
    };
}
```

Two presets ship today: `@vuecs/icons-lucide` (modern default) and
`@vuecs/icons-font-awesome` (replaces the removed `@vuecs/theme-font-awesome`).
Other Iconify collections work without a preset — pass the icon name directly
to a component prop.

## Cross-cutting Config (@vuecs/core, Phase 3 prerequisite)

The third manager alongside theme and defaults. Carries cross-cutting state
that vuecs components (and future RTL-aware features) need to read at runtime.

```
@vuecs/core/src/config/
  types.ts       <- Config (augmentable interface), ConfigManagerOptions, Direction
  manager.ts     <- ConfigManager (shallowRef state, withDefaults(), per-instance defaults map)
  install.ts     <- installConfigManager(app, options) / provideConfigManager(manager) / injectConfigManager()
  composable.ts  <- useConfig(key) — reactive ComputedRef<Config[K] | undefined>;
                    useConfig(key, fallback) overload returns NonNullable<Config[K]>
  provider/
    Provider.vue <- <VCConfigProvider> SFC for subtree-scoped config
```

### Federated schema (declaration merging)

`Config` is an empty-by-default augmentable **interface** (mirrors
`ThemeElements` and `ComponentDefaults`). Core declares only the truly
cross-cutting keys:

```ts
// @vuecs/core/src/config/types.ts
export interface Config {
    dir?: Direction;       // 'ltr' | 'rtl'
    locale?: string;       // BCP-47
}
```

Child packages augment via TypeScript declaration merging AND register
runtime defaults via `manager.withDefaults()`:

| Package | Augments | `withDefaults` registers |
|---|---|---|
| `@vuecs/core` | `dir`, `locale` | `dir: 'ltr'`, `locale: 'en-US'` |
| `@vuecs/theme-tailwind` | `nonce` (CSP nonce for `setColorPalette`'s `<style>`) | none — no sensible default |
| `@vuecs/overlays` | `scrollLockTarget` (selector / element receiving scroll-lock) | `scrollLockTarget: 'body'` |

Each augmentation lives in `<package>/src/config.ts`, side-effect imported
from the package's `index.ts` so the augmentation loads whenever the
package is depended on. Augmentations need a type-only anchor import
(`import type {} from '@vuecs/core'`) so TypeScript can resolve the target
module. Each augmenting package adds `@vuecs/core` as a `devDependency`
(type-only — no runtime cost beyond the existing peer dep).

### Resolution order

```
1. Consumer config (setConfig / install options / <VCConfigProvider :config>)
2. Registered defaults (withDefaults from child packages + CORE_DEFAULTS)
3. undefined
```

`useConfig(key)` returns `Config[K] | undefined` (honest — augmented keys
may have no default). The overload `useConfig(key, fallback)` returns
`NonNullable<Config[K]>` when a fallback is provided, mirroring how
`useComponentDefaults`'s `hardcoded` arg works.

Values may be `MaybeRef`, so reactive sources (e.g. `useLocale()` from an
i18n integration) unwrap transparently via Vue's `isRef`/`unref` (NOT a
`'value' in raw` heuristic — that would accidentally unwrap any object
with a `.value` property like `HTMLInputElement`).

### Subtree scoping with `<VCConfigProvider>`

Two ways to install config:

```ts
// App-level (most common)
app.use(vuecs, { config: { dir: 'rtl' } });

// Subtree-scoped (for an RTL block in an LTR app, etc.)
<VCConfigProvider :config="{ dir: 'rtl' }">
    <RestOfSubtree />
</VCConfigProvider>
```

`<VCConfigProvider>` creates a child `ConfigManager` and **inherits the
parent's defaults at mount time** (snapshot, not reactive). Calls to
`withDefaults` inside the subtree affect only the local manager — the
parent stays untouched. The component uses Vue's raw `provide` (bypassing
vuecs's `provide` helper, which short-circuits on existing keys) so it
properly overrides the parent inject.

Mirrors Reka UI's `<ConfigProvider>` shape but layered on top of the
manager pattern (you get both the install API for global config AND the
component API for subtree overrides).

## Design System (@vuecs/design + theme palette layer, #1506, plan 017)

Sits beside — not inside — the theme system. Themes resolve **CSS class
strings**; the design-system layer defines the **actual colors, radii and
other design primitives** those classes reference via CSS variables. This
lets a single set of tokens drive every theme package and enables runtime
palette switching without re-resolving theme classes.

The system splits across packages by concern (plan 017):

- **`@vuecs/design`** — `--vc-color-<scale>-*` semantic defaults
  referencing the Tailwind palette catalog (primary→blue, neutral→
  neutral, success→green, warning→amber, error→red, info→sky),
  light/dark `.dark` flips, radius tokens, motion primitives, and
  theme-agnostic helpers. The right-hand `--color-<palette>-*` source
  comes from EITHER Tailwind (`@import "tailwindcss"`) OR
  `@vuecs/design/standalone` — single-source for the OKLCH literals,
  no duplication between design and theme-tailwind. JS surface:
  - `useColorMode` / `bindColorMode` — light/dark/system mode
  - `applyColorPaletteCss(css, doc?)` — DOM upsert for the
    `<style id="vc-color-palette">` block
  - `bindColorPalette<T>(source, render): UseColorPaletteReturn<T>` — generic
    reactive wiring for any theme's palette config
  - `COLOR_PALETTE_STYLE_ELEMENT_ID` — DOM id constant

  Tailwind-free path supported via `@vuecs/design/standalone` (plan
  015 P3) — works with BS / Bulma without requiring Tailwind v4.
- **`@vuecs/theme-tailwind`** — exposes vuecs tokens as Tailwind names
  via an `@theme` block (`bg-primary-600`, `text-fg`, …), force-includes
  all 22 catalog palettes via `@source inline()`, and ships the
  Tailwind-specific palette runtime (`setColorPalette`, `useColorPalette`,
  `renderColorPaletteStyles`, and the `ColorPaletteConfig` value-shape
  type). The catalog vocabulary itself — `SEMANTIC_SCALES`,
  `COLOR_PALETTES`, `COLOR_PALETTE_SHADES` and their companion types —
  lives in `@vuecs/design` and is imported here, not redeclared.
  Composes design's generic helpers (`applyColorPaletteCss`,
  `bindColorPalette<ColorPaletteConfig>`) rather than reimplementing
  them. The `--vc-color-<scale>-*: var(--color-<palette>-*)` rebind
  that used to live here moved into `@vuecs/design/assets/index.css`
  (single source of truth). Required only when consumers want Tailwind
  utility classes AND/OR Tailwind-catalog palette switching.
  Nuxt integration for palette switching is handled by `@vuecs/nuxt`
  itself — the per-theme Nuxt sub-module split (originally introduced
  in plan 017 Phase 2.5) collapsed in plan 025 once the runtime
  dispatch became fully theme-agnostic. The SSR plugin walks installed
  themes' `palette.handle` hooks; the auto-imported `useColorPalette()`
  composable is cookie-backed and shape-identical to the SPA variant.

Future themes with their own palette catalogs (corporate fork,
community preset, Material-You-style theme) compose design's generic
helpers directly:

```ts
import { applyColorPaletteCss, bindColorPalette } from '@vuecs/design';

type AcmePalette = { primary?: 'acme-blue' | 'acme-orange'; ... };
const renderAcme = (p: AcmePalette) => /* emit --vc-color-* CSS */;
const setAcmePalette = (p: AcmePalette) => applyColorPaletteCss(renderAcme(p));
const useAcmePalette = (src: Ref<AcmePalette>) => bindColorPalette(src, renderAcme);
```

### Layers, top-down

When `@vuecs/theme-tailwind` is loaded:

```text
1. bg-primary-600          ← Tailwind v4 utility class
2. --color-primary-600     ← @theme mapping in theme-tailwind/assets/index.css
3. --vc-color-primary-600  ← semantic-scale var (overridden by setColorPalette)
4. --color-blue-600        ← design/assets/index.css references the palette catalog
5. oklch(...)              ← concrete OKLCH literal (Tailwind palette source)
```

When `@vuecs/design/standalone` is loaded (BS / Bulma):

```text
3. --vc-color-primary-600  ← design/assets/index.css
4. --color-blue-600        ← design/assets/index.css references the palette catalog
5. oklch(54.6% 0.245 262.881)  ← design/assets/palettes.css supplies the literal
```

`.dark` flips the semantic aliases (`--vc-color-bg`, `--vc-color-fg`,
`--vc-color-border`, `--vc-color-ring`) only — scales stay the same.
`setColorPalette({ primary: 'green' })` rewrites layer 3 to `var(--color-green-600)`
via a `<style id="vc-color-palette">` block, leaving layers 1-2 and 4-5 untouched.
`setColorPalette` is a no-op when `@vuecs/theme-tailwind` isn't loaded (no
`--color-<palette>-*` source to point at).

### Package layout

```
@vuecs/design/
  assets/index.css       <- :root (concrete OKLCH defaults) + .dark + @import "./animations.css"
  assets/animations.css  <- Motion primitives — vanilla-CSS port of tw-animate-css (MIT, attributed in header)
  src/
    palette.ts                   <- applyColorPaletteCss(), bindColorPalette<T>(), COLOR_PALETTE_STYLE_ELEMENT_ID
    composables/
      use-color-mode.ts          <- bindColorMode(ref, opts), useColorMode(opts)
      index.ts                   <- composables barrel
    index.ts                     <- top-level barrel (re-exports composables + palette primitives)

@vuecs/theme-tailwind/
  assets/index.css       <- @theme { --color-primary-*: var(--vc-color-primary-*) }
                             + @source inline("bg-{...}-{...}") safelist
  src/
    types.ts             <- deprecated `ColorPaletteConfig` re-export from @vuecs/design (plan 026)
    palette.ts           <- renderColorPaletteStyles() (pure), setColorPalette() (composes applyColorPaletteCss)
                          (plan 026 removed the per-theme useColorPalette wrapper —
                           consumers import useColorPalette from @vuecs/design)
    config.ts            <- Config['nonce'] augmentation (CSP nonce for setColorPalette's <style>)
    index.ts             <- top-level barrel + tailwindTheme() default export
                             (re-exports applyColorPaletteCss / bindColorPalette / COLOR_PALETTE_STYLE_ELEMENT_ID
                              from @vuecs/design for backward compat)

```

### Motion primitives (animations.css)

A vanilla-CSS port of [`tw-animate-css`](https://github.com/Wombosvideo/tw-animate-css)
v1.4.0 (MIT). Auto-imported by `assets/index.css` so the bare
`@import "@vuecs/design"` brings tokens AND motion in one go. Subpath
exports `@vuecs/design/animations.css` (motion only) and
`@vuecs/design/index.css` (= bare import) are also available.

**Why a port instead of a runtime dep:** `tw-animate-css` ships its
classes as Tailwind v4 `@utility` / `@theme inline` directives — they
only compile inside Tailwind. Bootstrap-themed (or theme-less) consumers
can't use it. The vanilla rewrite uses the same class names so any theme
can reference them. Tailwind users keep using `data-[state=open]:fade-in-0
zoom-in-95` (Tailwind's `data-[state=]:` variant prefix points at the
same vanilla CSS classes); Bootstrap users get them via unconditional
class application in their theme entries.

**Class catalog:** `animate-in` / `animate-out` (master triggers),
`fade-{in,out}-{0,25,50,75,90,95,100}`, `zoom-{in,out}-{0,50,75,90,95,100,105,110,125,150}`,
`slide-{in-from,out-to}-{top,bottom,left,right,start,end}` (with size stops),
`spin-{in,out}` ± negatives, `blur-{in,out}` (sm/md/lg/xl/2xl/3xl),
`accordion-{down,up}`, `collapsible-{down,up}`, `caret-blink`,
`duration-*`, `delay-*`, `repeat-*`, `direction-*`, `fill-mode-*`,
`running`, `paused`. Plus a `prefers-reduced-motion: reduce` block that
disables every animation.

**Maintenance:** when tw-animate-css adds new animations upstream, port
them here using the same naming and bump the version comment in the file
header.

**Reka Presence handles unmount delay automatically.** All five Reka
overlay `*Content` primitives (DialogContent, PopoverContent,
TooltipContent, MenuContent — used by both DropdownMenu and ContextMenu)
already wrap themselves in Reka's `Presence` component internally:
`Presence` reads the element's computed `animation-name` when
`data-state` flips, suspends unmount until `animationend`, and then
removes the element. So consumers don't need to wire Presence themselves
for exit animations to play — the theme's exit-state classes (`animate-out`
+ `fade-out-0` etc. for theme-tailwind, or the `vc-overlay-anim` /
`vc-overlay-fade-anim` / `vc-tooltip-anim` dual-state helpers for
theme-bootstrap) just need to be in place. `<VCPresence>` is still
exported for ad-hoc use (e.g. animating a custom panel that isn't a Reka
overlay), but isn't required for the shipped overlay families.

**Vuecs dual-state helper classes** (`vc-overlay-anim`,
`vc-overlay-fade-anim`, `vc-tooltip-anim`) live in `animations.css`
alongside the tw-animate-css port. They package `data-state`-gated
enter+exit animations into a single class so theme strings without
attribute-selector capability (theme-bootstrap, custom CSS-only themes)
can drive overlay animations. theme-tailwind keeps using the more
flexible `data-[state=open]:animate-in fade-in-0 zoom-in-95
data-[state=closed]:animate-out fade-out-0 zoom-out-95` composition.

### Key exports

**`@vuecs/design` (theme-agnostic):**
- **`applyColorPaletteCss(css: string, doc?: Document, nonce?: string)`** — DOM helper. Inserts or updates a `<style id="vc-color-palette">` element in `<head>` with the given CSS string. Theme-agnostic; accepts whatever the caller wants to render.
- **`bindColorPalette<T>(source: Ref<T>, render: (T) => string): UseColorPaletteReturn<T>`** — generic reactive wiring. Apply on init, re-apply on watch. Themes compose this with their own renderer.
- **`COLOR_PALETTE_STYLE_ELEMENT_ID`** — constant `'vc-color-palette'`. SSR plugins emit a matching id so client hydration replaces atomically.
- **`SEMANTIC_SCALES` / `SemanticScaleName`** — the six semantic scale names (`primary`, `neutral`, `success`, `warning`, `error`, `info`) that `--vc-color-<scale>-*` is keyed on. Themes import these — they're not redeclared per-theme.
- **`COLOR_PALETTES` / `ColorPaletteName`** — the 22 catalog palette names (sourced from Tailwind v4). Both supported palette sources — `@import "tailwindcss"` AND `@vuecs/design/standalone` — define `--color-<palette>-*` for each one, so `setColorPalette()` resolves regardless of whether Tailwind is loaded.
- **`COLOR_PALETTE_SHADES` / `ColorPaletteShade`** — the 11-stop shade ladder (`'50' | '100' | … | '950'`).
- **`ColorPaletteConfig`** — `Partial<Record<SemanticScaleName, ColorPaletteName>>`. Canonical palette-config type since plan 026; both keys come from this package's catalog.
- **`useColorPalette(options?)`** — theme-aware reactive palette state with localStorage persistence. Wrapped via `createSharedComposable`, so every call site shares the same ref + watcher. Walks installed themes' `palette.handle` hooks and concatenates the rendered CSS into the `<style id="vc-color-palette">` block. Default sanitizer filters input to the canonical catalog; default `extend` is shallow merge. CSP-strict consumers pass `nonce: () => useConfig('nonce').value` explicitly (no auto-wiring — see [SSR dispatch (slice 3)](#ssr-dispatch-slice-3) and the deprecation note on theme `useColorPalette` re-exports below).
- **`useColorPaletteUnshared(options?)`** — un-shared variant. Same surface; one watcher per call. Accepts a custom `source: Ref<T>` for SSR-aware persistence (Nuxt cookie, IndexedDB, etc.). Used internally by `@vuecs/nuxt`'s cookie-backed wrapper.
- **`useColorMode(options?)`** — reactive light/dark/system mode with localStorage persistence + `<html>` class sync. Returns `{ mode, resolved, isDark, toggle }`. Uses `usePreferredDark` from VueUse to resolve `'system'`.
- **`bindColorMode(source: Ref<ColorMode>, options?)`** — building block; same pattern as `bindColorPalette`.

**`@vuecs/theme-tailwind` (Tailwind-specific palette + class strings):**
- **`renderColorPaletteStyles(palette): string`** — pure function. Returns a `:root { … }` block that remaps `--vc-color-<scale>-*` onto `var(--color-<palette>-*)` for every scale set in `palette`. Safe on server and client.
- **`setColorPalette(palette, doc?, nonce?)`** — one-line composition: `applyColorPaletteCss(renderColorPaletteStyles(palette), doc, nonce)`.
- ⚠ **`useColorPalette` (deprecated)** — re-exports from `@vuecs/design` for backwards compat. The per-theme wrapper that previously auto-wired `useConfig('nonce')` was removed in plan 026; consumers import from `@vuecs/design` and pass `nonce` explicitly when needed.
- **`ColorPaletteConfig` (deprecated re-export)** — re-exports the canonical type from `@vuecs/design`. Will be removed in the next major.
- Also re-exports `applyColorPaletteCss` / `bindColorPalette` / `COLOR_PALETTE_STYLE_ELEMENT_ID` from `@vuecs/design` for backward compat with code that picked them up from theme-tailwind in earlier versions.

**`@vuecs/nuxt` (theme-agnostic Nuxt integration):**
- **`useColorPalette()`** — auto-imported in Nuxt apps. Cookie-backed (SSR-safe) variant; same `{ current, set, extend }` shape as the SPA `useColorPalette` from `@vuecs/design`. Composes the generic `useColorPaletteUnshared` from `@vuecs/design` with a cookie-backed `Ref<T>` passed as `source`. Dispatches through whichever themes the consumer installs — Tailwind, Bulma, and any future palette-aware theme all share the same composable (plan 025).
- **`useColorMode()`** — auto-imported. SSR-safe color-mode composable backed by a Nuxt cookie. Reads the cookie name + initial value from `runtimeConfig.public.vuecs.colorMode`.

All packages require **Vue 3** as a peer dep. `@vuecs/design` and `@vuecs/theme-tailwind` additionally require **`@vueuse/core`**. The composables sub-area is intentionally kept on each package's root export (no subpath) — flat surface area matches `@vuecs/core`'s convention.

### Requirements

- **Tailwind CSS v4+** — required only if consumers import `@vuecs/theme-tailwind` (utility classes) or use `setColorPalette()` / `useColorPalette()`. BS-only / Bulma-only consumers can ship without Tailwind.
- **Dark mode toggle via `.dark` class.** Consumers wire this however they prefer (`@vuecs/design`'s `useColorMode`, Nuxt's `@nuxtjs/color-mode`, a Pinia store, vanilla JS). No `prefers-color-scheme` media query layer ships today.

### Runtime palette safelist

`@vuecs/theme-tailwind`'s `assets/index.css` ends with:

```css
@source inline("bg-{red,orange,...,neutral}-{50,100,...,950}");
```

This force-includes all 22 Tailwind palettes × 11 shades in the JIT output. Without it, Tailwind v4 only emits `--color-<palette>-*` tokens for palettes referenced by used utility classes — so `setColorPalette({ primary: 'emerald' })` would silently fail because `--color-emerald-*` was tree-shaken.

The directive depends on Tailwind v4's documented behavior of emitting `--color-<palette>-<shade>` as a side effect of safelisting `bg-<palette>-<shade>`. If a future Tailwind major changes how palette emission works, this directive needs to update too. See the inline comment in `themes/tailwind/assets/index.css` for the full rationale.

### Nuxt integration

One theme-agnostic Nuxt module (`@vuecs/nuxt`) handles both color-mode
and palette runtime — same module regardless of theme. Plan 025
collapsed the previous per-theme Nuxt sub-module split (formerly
`@vuecs/theme-tailwind-nuxt`) once the runtime dispatch became fully
theme-agnostic via plan 021's `palette.handle` / `colorMode.handle`
hooks.

```text
@vuecs/nuxt/                                    (theme-agnostic)
  src/
    module.ts                                  <- defineNuxtModule (configKey: 'vuecs')
                                                  Options: injectTokens, colorMode, colorPalette,
                                                           cookie, paletteCookie, themes
                                                  Auto-imports @vuecs/design/index.css
                                                  Generates a `vuecs-themes` plugin when
                                                  `themes: string[]` is set (auto-loads listed
                                                  theme packages via no-arg default factories)
    runtime/
      plugins/colorMode.server.ts              <- emits class="dark"|"light" + per-theme
                                                  data-* attrs via captureColorModeAttrs
      plugins/colorPalette.server.ts           <- emits <style id="vc-color-palette"> via
                                                  renderColorPaletteFromThemes + useHead
      composables/useColorMode.ts              <- bindColorMode(useCookie<ColorMode>(...))
      composables/useColorPalette.ts           <- useColorPaletteUnshared({
                                                      source: useCookie<NuxtColorPaletteConfig>(...),
                                                      nonce: () => useConfig('nonce').value,
                                                  })
```

Consumer usage:

```ts
// nuxt.config.ts — same shape for every theme
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        // Optional: auto-install themes via a generated plugin.
        // Themes that need factory args skip this and install via
        // a user-authored plugin file under `plugins/`.
        themes: ['@vuecs/theme-tailwind'],

        colorMode: { value: 'system' },                       // 'light' | 'dark' | 'system'
        colorPalette: { value: { primary: 'green' } },        // initial palette
        cookie: { maxAge: 31536000, sameSite: 'lax' },        // color-mode cookie attrs
        paletteCookie: { /* attrs; falls back to `cookie` */ },
    },
});
```

```vue
<!-- in a component (any theme) -->
<script setup>
const { current, set, extend } = useColorPalette();   // from @vuecs/nuxt
const { resolved, toggle } = useColorMode();          // from @vuecs/nuxt
</script>
```

The auto-imported `useColorPalette` thin-wraps `useColorPaletteUnshared`
from `@vuecs/design` with a cookie-backed `Ref<T>` passed as `source`.
The dispatch walks installed themes' `palette.handle` hooks and
concatenates outputs — same semantic as the SPA composables in
`@vuecs/theme-tailwind` / `@vuecs/theme-bulma`. The return shape is
shape-identical so consumers move between SPA + Nuxt without API drift.

On the server, both plugins render their state into the head before
first paint (palette `<style>` block + `html.dark`/`html.light` class +
per-theme data-* attributes from `colorMode.handle`). The client
hydrates against the same DOM and continues to manage them reactively —
effectively zero-cost palette switching and zero-FOUC dark mode (except
first visits with `colorMode.value: 'system'` and no cookie, where the
OS preference can't be read on the server).

The dark-mode integration is built on `@vueuse/core`'s `usePreferredDark`
plus a Nuxt cookie (`vc-color-mode` by default). It's NOT
`@nuxtjs/color-mode` under the hood — that module remains an alternative
for consumers who prefer it (set `vuecs: { colorMode: false }` to opt out).

`vuecs.cookie` governs color-mode cookie attributes; `vuecs.paletteCookie`
governs palette cookie attributes. The palette cookie inherits from
`cookie` when `paletteCookie` is unset — most apps want consistent
retention across UI-state cookies.

### Bootstrap bridge (theme-bootstrap)

`@vuecs/theme-bootstrap` ships an optional CSS file at `assets/index.css`
that wires Bootstrap's `:root` theme-color variables onto `--vc-color-*`.
The package's `package.json` exposes a `style` conditional export, so a
bare `@import "@vuecs/theme-bootstrap"` in a CSS file resolves to the
bridge. The explicit subpath form (`@vuecs/theme-bootstrap/index.css`)
also works. Currently targets Bootstrap 5 — remaps `--bs-primary`,
`--bs-success`, etc. Bootstrap 5 components read `--bs-*` at runtime, so
runtime palette switches via `setColorPalette()` propagate.

Pair with `@vuecs/design/standalone` (plan 015 P3) to drop the Tailwind
dependency entirely while keeping `setColorPalette()` functional —
the standalone subpath inlines the Tailwind palette catalog as plain
CSS variables.

`@vuecs/theme-bootstrap-v4` was removed in vuecs 3.0 — Bootstrap 4
component CSS is Sass-compiled to literal hex, so the design-token
bridge had no practical effect on Bootstrap-rendered widgets, only on
consumer-authored CSS that referenced `var(--primary)`.

### Bulma bridge (theme-bulma)

`@vuecs/theme-bulma` ships an optional CSS file at `assets/index.css`
that wires Bulma 1.0+'s `:root` theme-color variables onto `--vc-color-*`.
Same shape as the Bootstrap bridge: `style` conditional export so a bare
`@import "@vuecs/theme-bulma"` resolves to the bridge. Bulma 1.0+
components read `--bulma-*` at runtime, so runtime palette switches via
`setColorPalette()` propagate.

Pair with `@vuecs/design/standalone` (plan 015 P3) to drop Tailwind
entirely from a Bulma-only stack — same rationale as theme-bootstrap.

Notable mapping decisions:
- `--bulma-link → --vc-color-info-500` (preserves Bulma's two-tone
  palette where `link` is a separate "informational" axis from
  `primary`; differs from the BS bridge's `--bs-link-color → primary-600`).
- `ghost` / `link` button-variant mappings are reversed vs. Bootstrap.
  Bulma's `is-ghost` is the underlined-anchor button (= our `link`);
  Bulma's `is-text` is the borderless transparent button (= our `ghost`).
- DropdownMenu / FormSelect content uses `.dropdown-content` (Bulma's
  inner box-styled element) rather than `.dropdown-menu`, because
  `.dropdown-menu` is gated by parent `.dropdown.is-active` and Reka's
  portal-mounted content has no parent.
- Stepper and Switch are hand-rolled via gap-fill rules in the bridge
  CSS — neither ships in Bulma core. Same approach as the BS bridge,
  using design-system tokens for color.

Bulma 1.0 routes per-variant theming through HSL **channel** vars
(`--bulma-button-h/s/l`), not named color tokens. A `.button.is-primary`
sets `--bulma-button-h: var(--bulma-primary-h)` etc., and the base
`.button` rule resolves `background-color: hsl(--bulma-button-h, …)`.
Pure CSS can't decompose `var(--vc-color-primary-600)` into H/S/L
channels, so we can't bridge that path — overriding
`--bulma-button-background-color` is a no-op because Bulma never reads
it. The bridge instead overrides the **resolved** `background-color` /
`border-color` / `color` properties directly on each per-variant
selector. Specificity 0,2,0 beats Bulma's base `.button` (0,1,0); no
`!important` needed.

Trade-off: Bulma's auto-computed hover/active lightness deltas are
short-circuited. The bridge re-specifies hover (`-700`) and active
(`-800`) shades manually per variant — same pattern as the BS bridge's
explicit `--bs-btn-hover-bg` overrides.

Utility classes that read HSL channels (`.has-background-light`,
`.has-text-grey`, `.has-background-dark`) keep Bulma's default palette
— `setColorPalette()` doesn't reach them. The variant matrix uses these
utilities sparingly (avatar bg, stepper indicator default state,
tooltip dark bg) where Bulma's defaults are visually acceptable.

### Short-form CSS imports

All style-carrying packages use the `style` conditional export so
consumers can write bare imports:

```css
@import "@vuecs/design";              /* → assets/index.css */
@import "@vuecs/design/standalone";   /* → assets/standalone.css (Tailwind-free, plan 015 P3) */
@import "@vuecs/theme-bootstrap";     /* → assets/index.css (bridge) */
@import "@vuecs/theme-bulma";         /* → assets/index.css (bridge) */
@import "@vuecs/forms";       /* → dist/style.css */
@import "@vuecs/navigation";          /* → dist/style.css */
@import "@vuecs/pagination";          /* → dist/style.css */
```

The component-package CSS bundles ship the structural rules that the JS
entry doesn't auto-import (extracted at build time by tsdown). Consumers
who don't import these will see the bundled JS render correctly but lose
component-specific structural styling — checkbox switch variant,
range-slider track and thumbs, search-dropdown panel, nav tree-line, etc.

Explicit subpath forms (`@vuecs/design/index.css`, `@vuecs/forms/style.css`,
`@vuecs/forms/dist/style.css`) remain supported for clarity when
mixing multiple CSS entry points.

### `@vuecs/design/standalone` subpath (plan 015 P3)

Tailwind-free entry point for Bootstrap / Bulma consumers (and anyone
who doesn't want Tailwind v4 in their bundle). Brings two things on
top of the default entry:

1. **Full Tailwind v4 palette catalog** — `--color-<palette>-<shade>`
   for the 22 catalogued palettes (`slate`/`gray`/`zinc`/`neutral`/
   `stone`/`red`/`orange`/`amber`/`yellow`/`lime`/`green`/`emerald`/
   `teal`/`cyan`/`sky`/`blue`/`indigo`/`violet`/`purple`/`fuchsia`/
   `pink`/`rose`) × 11 shades (50…950) = 242 OKLCH literals. Lives
   at `assets/palettes.css`.
2. **All of `@vuecs/design`'s default content** — `--vc-color-*`
   semantic scales, light/dark aliases, radius tokens, motion
   primitives. Inherited via `@import "./index.css"`.

Mutually exclusive with the default entry — never load both. The
default entry already has the semantic scales; layering standalone on
top would duplicate them.

```css
/* Tailwind app — default entry */
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";

/* Bootstrap / Bulma app — Tailwind-free */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bootstrap";
```

**Why this matters.** `setColorPalette()` writes `--vc-color-primary-600:
var(--color-emerald-600)` (or whichever palette) into the runtime
`<style>` block. Without `--color-emerald-600` defined somewhere,
that resolves to the var's fallback (none → invalid). On a
Tailwind-loaded app the var comes from Tailwind itself; on a
Tailwind-free app the standalone subpath supplies it.

**Build pipeline.** `packages/design/assets/palettes.css` is generated
by `packages/design/scripts/build-standalone.ts` which parses
`node_modules/tailwindcss/theme.css` and emits the 242 OKLCH literals
as a single `:root { ... }` block. The script ships with two scripts:

| Script | Purpose |
|---|---|
| `npm run --workspace=packages/design standalone:build` | Regenerate `assets/palettes.css` from the locally-installed Tailwind |
| `npm run --workspace=packages/design standalone:check` | CI guard — diff committed file vs freshly regenerated; non-zero exit on drift |

The 22-palette list lives in `src/core/color-palette/catalog.ts`
(`COLOR_PALETTES`) and is imported by both this script and the
runtime renderers in `@vuecs/theme-tailwind` / `@vuecs/theme-bulma`.
Single source of truth — when Tailwind adds a new palette and we
want to expose it via `setColorPalette()`, update the catalog and
re-run `standalone:build` (plus `palette-catalog:build` in
`@vuecs/theme-bulma` to refresh the HSL table).

Re-run `standalone:build` after bumping the `tailwindcss` devDep and
commit the regenerated `palettes.css`. The `standalone:check` script
is suitable for a CI matrix step (catches forgotten regenerations).

## NavigationManager (@vuecs/navigation)

The navigation package has its own manager pattern using `@posva/event-emitter`:

- `NavigationManager` maintains the navigation tree state
- Provided to the component tree via `provideNavigationManager()`
- `VCNavItems` and `VCNavItem` components consume the manager
- Integrates with `vue-router` for active state tracking

## Component Rendering

Components use TypeScript render functions (not `.vue` SFCs) via `defineComponent` + `h()`. This avoids the Vue template compiler dependency in most packages. The `@vitejs/plugin-vue` plugin is only enabled for packages that contain `.vue` files (forms, pagination, overlays).

## CSS Strategy

Components emit minimal structural CSS via co-located `vc-*` default classes. Visual styling is delegated to theme packages. CSS is extracted into separate `dist/style.css` files during build, so consumers can import styles independently.

## Dependency Flow

```
Themes        ──configure──> ThemeManager    (in @vuecs/core)
Defaults      ──configure──> DefaultsManager (in @vuecs/core)
Design tokens ──configure──> CSS custom properties (--vc-color-*, --vc-radius-*) from @vuecs/design
                          |
Components ──read─────────┘ (via useComponentTheme / useComponentDefaults;
                             CSS resolves token vars at browser time)
     |
     └──> @vuecs/link (navigation uses link for route-aware anchors)
```

## Building blocks (Reka UI)

Some components compose [Reka UI](https://reka-ui.com/) primitives internally for accessibility heavy lifting (focus management, keyboard nav, edge-aware rendering). Consumers don't see this — the public API (props, emits, theme classes) is the vuecs contract; Reka is an implementation detail. Today this applies to `@vuecs/pagination` (wraps `PaginationRoot` / `PaginationList` / `PaginationListItem` / `PaginationFirst|Prev|Next|Last` / `PaginationEllipsis`). The roadmap for broader Reka adoption (overlays, form-controls migration, headless composables) lives at [`.agents/plans/009-reka-ui-adoption-roadmap.md`](plans/009-reka-ui-adoption-roadmap.md). See [`.agents/references/reka-ui.md`](references/reka-ui.md) for the conceptual mapping.

## Headless composables (@vuecs/core, Phase 2)

Alongside `useComponentTheme` and `useComponentDefaults`, `@vuecs/core` exposes
a set of small, framework-friendly composables ported from Reka UI's shared
utilities. They live at the root export (no subpath) so consumers see one flat
import surface. Re-implemented in-tree rather than vendored so `@vuecs/core`
stays zero-dep beyond Vue 3.

| Composable | Purpose |
|---|---|
| `useForwardProps(props)` | `ComputedRef` of props with `undefined` keys dropped — for `v-bind`-ing onto an inner component without overriding its defaults |
| `useEmitAsProps(emit)` | Maps the wrapper's declared `emits` to `onEventName` handler props |
| `useForwardPropsEmits(props, emit?)` | `useForwardProps` + `useEmitAsProps` in one call |
| `useForwardExpose()` | Re-exposes the inner element/component on the wrapper's `expose`. Returns `{ forwardRef, currentRef, currentElement }` |
| `useArrowNavigation(event, current, parent, options?)` | Resolves the next focusable item for arrow / Home / End keys. Default attribute selector: `[data-vc-collection-item]` (vuecs-namespaced; Reka uses `[data-reka-collection-item]`) |
| `useTypeahead(callback?)` | Accumulates keystrokes for ~1 s and focuses the next item whose text starts with the buffer. Also exports `getNextMatch` and `wrapArray` for custom matching loops |
| `useId(deterministicId?, prefix?)` | Wraps Vue 3.5's native `useId()` with a default `vc-` prefix |
| `useStateMachine(initial, machine)` | Tiny state machine on top of `ref()`. Unknown events leave state unchanged. Phase-3 prerequisite for `@vuecs/overlays` |

Source under `packages/core/src/utils/composables/`. Tests under
`packages/core/test/unit/composables/`. All eight composables ship in
`@vuecs/core` 2.x as the Phase-2 deliverable of the Reka UI adoption
roadmap. `@vuecs/navigation` consumes `useArrowNavigation` in `VCNavItems`
to provide vertical arrow / Home / End keyboard navigation across
sibling items at any depth.

## Overlays (@vuecs/overlays, Phase 3)

The first compound-component package. Wraps Reka's Dialog / Popover /
Tooltip / DropdownMenu / ContextMenu primitives. Each part is a thin
SFC that renders the matching Reka component and threads our
`useComponentTheme(<family>, props, <familyThemeDefaults>)` over it for
theme class resolution. Content components (`*Content`) bundle the
matching `*Portal` so consumers don't have to compose them manually
(an `inline` prop bypasses the portal for testing or custom mounting).

```
@vuecs/overlays/
  src/
    components/
      modal/
        Modal.vue           <- DialogRoot wrapper (v-model:open)
        ModalTrigger.vue    <- DialogTrigger
        ModalContent.vue    <- DialogPortal + DialogOverlay + DialogContent
        ModalTitle.vue
        ModalDescription.vue
        ModalClose.vue        <- close trigger; slotless OR `icon` prop → theme `closeIcon` (corner-X); otherwise neutral `close`
        theme.ts            <- shared modalThemeDefaults (single source for all parts)
        types.ts            <- ModalThemeClasses + ThemeElements augmentation
        use-modal.ts        <- useModal() view-stack composable (issue #1480)
        index.ts
      popover/                <- Popover / Trigger / Content / Arrow / Close (with `icon` prop)
      hover-card/             <- HoverCard / Trigger / Content / Arrow (plan 013) — hover-with-grace-area; trigger defaults to `as="a"`
      tooltip/                <- TooltipProvider / Tooltip / Trigger / Content / Arrow
      dropdown-menu/          <- DropdownMenu / Trigger / Content / Item / Label / Separator / Group / Arrow
      context-menu/           <- ContextMenu / Trigger / Content / Item / Label / Separator / Group
      toast/                  <- ToastProvider / Toaster / Toast / Title / Description / Action / Close
                                   + useToast() shared queue composable (plan 029)
    vue.ts                  <- GlobalComponents augmentation (every VC* part)
    index.ts                <- install() (themes, defaults, config; registers all VC* components)
```

Every overlay family follows the same per-folder layout: each component is a
small SFC, plus `theme.ts` (single shared defaults), `types.ts`
(`<Family>ThemeClasses` + `ThemeElements` augmentation), and `index.ts`
re-export barrel. Tooltip and Toast additionally expose
`<VCTooltipProvider>` / `<VCToastProvider>` for app-level config
(delays, default duration, swipe direction); the other families read
state from their own root (`v-model:open` on Modal/Popover/Dropdown,
right-click on ContextMenu).

The `useModal()` composable is the vuecs-specific value-add on top of
Reka's Dialog. It exposes a **view stack** (`pushView` / `popView` /
`replaceView`) and an `onClose` hook so consumers can build flows like
"list view → push detail view → pop back" without stacking modals or
fighting z-index. Originally proposed in
[issue #1480](https://github.com/tada5hi/vuecs/issues/1480); the
roadmap-scoped Reka-wrapped compound API is layered on top of it (the
composable owns the state, `<VCModal>` v-binds to it).

The `useToast()` composable (plan 029) plays the same role for the Toast
family: a **shared, module-level queue** with `add` / `dismiss` / `update`
/ `clear` methods. Every call site reads from the same `entries` ref, so
a notification fired from a Pinia store, an axios interceptor, or a deep
component lands in the same `<VCToaster>` viewport. Unlike `useModal()`
(per-call instance), `useToast()` is a module singleton — the queue is
app-wide on purpose. The `<VCToaster>` component reads the queue and
renders one `<VCToast>` per entry, with the canonical
title/description/action/close layout as the default slot fallback and a
`{ entry, dismiss }` slot prop for per-toast customization.

Equivalent composables for the other families haven't shipped — most of
those don't need stateful flows, and consumers can wire `:open` /
`@update:open` manually when they do.

Theme entries for all seven families (`modal`, `popover`, `hoverCard`,
`tooltip`, `dropdownMenu`, `contextMenu`, `toast` + the four `toast*`
sub-keys) ship across `@vuecs/theme-tailwind`,
`@vuecs/theme-bootstrap`, and `@vuecs/theme-bulma` with `data-state`
animation hooks (`open|closed` for modal/popover/hover-card/menu/toast,
`delayed-open|closed` for tooltip). Toast additionally exposes
`data-swipe="move|cancel|end"` for swipe gestures, gated via the
`vc-toast-anim` dual-state helper in `animations.css`. Menu items also
expose `data-highlighted` (hover/focus) and `data-disabled`. Animation
classes (`animate-in`, `fade-in-0`, `zoom-in-95`, etc.) come from
`@vuecs/design`'s `animations.css` (vanilla-CSS port of `tw-animate-css`)
— see "Motion primitives" under the Design System section above.
- Tailwind theme references the per-state classes via the `data-[state=open]:`
  / `data-[state=closed]:` variant prefix (Tailwind compiles each variant
  into a selector that scopes the class to the matching state).
- Bootstrap-v5 theme uses vuecs's dual-state helper classes
  (`vc-overlay-anim`, `vc-overlay-fade-anim`, `vc-tooltip-anim` from
  `animations.css`) which package `data-state`-gated enter+exit
  animations into a single class. Required because BS5 theme strings
  can't carry `data-[state=]:` attribute selectors.

**Both enter AND exit animations fire** today. Reka's `*Content`
primitives wrap themselves in `Presence` internally — when `data-state`
flips to `closed`, Presence reads the element's computed `animation-name`,
suspends unmount, and waits for `animationend` before removing the
element. So the theme's exit-state classes (the `data-[state=closed]:`
variants on theme-tailwind, the `[data-state="closed"]` rules in the
`vc-*-anim` helpers for BS5) actually play. No additional wiring on the
vuecs side is required.

Reka stays an internal dependency; consumers don't touch `reka-ui`
directly — the `<VC*>` parts are the vuecs contract.

DropdownMenu and ContextMenu ship the **full surface** including
`CheckboxItem`, `RadioGroup`, `RadioItem`, `ItemIndicator`, `Sub`,
`SubTrigger`, and `SubContent` parts.

### Close-trigger pattern: `close` + `closeIcon` slots

`<VCModalClose>` and `<VCPopoverClose>` each own two theme slots and pick
between them per render:

| Call shape | Slot read | Intent |
|---|---|---|
| `<VCModalClose />` (slotless) | `closeIcon` | Default `×` glyph in the corner |
| `<VCModalClose>Cancel</VCModalClose>` | `close` | Labelled close button — neutral baseline so consumer `class=` composes cleanly |
| `<VCModalClose icon>...</VCModalClose>` | `closeIcon` | Force corner-X even with custom slot content |

The `close` slot ships neutral (just focus ring) so consumer classes don't
fight absolute positioning; `closeIcon` carries the corner-X positioning
+ sizing (`absolute right-3 top-3 h-7 w-7` in theme-tailwind, `btn-close`
in theme-bootstrap). Slot-presence as the smart default means bare
slotless usages — the most common pattern — keep working without an
explicit prop. The same pattern applies to future overlay families (e.g.
HoverCard) when they ship.

`<VCHoverCard>` doesn't carry a Close part — the panel auto-dismisses
when the pointer leaves the trigger + content (Reka manages the
grace-area travel via `closeDelay`). Click-triggered floating panels
that need an explicit close button use `<VCPopover>` instead.

## Atomic Elements (@vuecs/elements, plan 013)

Atomic, presentation-only UI elements. Each component is small (≤150
LOC), wraps zero or one Reka primitive, ships its own theme key, and
has no relationships with other vuecs packages beyond `@vuecs/core` for
the theme system.

```text
@vuecs/elements/
  src/
    components/
      separator/        <- VCSeparator (Reka Separator) — horizontal/vertical, `decorative`
      tag/              <- VCTag (pure CSS) + VCTags (renders chips per items array)
      avatar/           <- VCAvatar (Reka AvatarRoot+Image+Fallback) — `src` + #fallback slot
      aspect-ratio/     <- VCAspectRatio (Reka AspectRatio) — `ratio` prop
      visually-hidden/  <- VCVisuallyHidden (Reka VisuallyHidden) — a11y label slot
      badge/            <- VCBadge (pure CSS) — solid/soft/outline × semantic-color matrix
      card/             <- VCCard + VCCardHeader / Title / Description / Body / Footer
                           Compound surface with provideCardContext() for padding inheritance (plan 030)
    vue.ts              <- GlobalComponents augmentation
    index.ts            <- install() (themes, defaults; registers all VC* components)
  assets/
    separator.css       <- structural defaults per element (sizing, layout)
    tag.css
    avatar.css
    aspect-ratio.css
    badge.css
    card.css            <- structural defaults for card + bands + title / description
```

### Card compound (plan 030)

A six-part compound for grouping related content into a bounded
panel: `<VCCard>` outer + optional `<VCCardHeader>` /
`<VCCardTitle>` / `<VCCardDescription>` / `<VCCardBody>` /
`<VCCardFooter>`. Pure-CSS, no Reka primitive needed — each part
is a thin themed wrapper over `reka-ui`'s `Primitive` (so the
`asChild` pattern works on every part for render-as-link cases).

Padding is set ONCE on `<VCCard padding="compact|normal|spacious">`
and propagates to every band via `provideCardContext()`. Children
read context via `useCardContext()` and merge it with their
per-instance `themeVariant` (per-instance wins). Per-band padding
overrides are still possible by passing `:theme-variant="{ padding:
'spacious' }"` on the specific band. The context bridge is
optional — children render bare when mounted outside `<VCCard>`
for unit tests / ad-hoc composition.

Theme entries ship in **all three** shipping themes
(`tailwind` / `bootstrap` / `bulma`). Variant axes:

- `card.variant`: `outline` / `soft` / `elevated` — border vs
  tinted bg vs shadow.
- `card.interactive`: hover + focus-within ring; pairs with
  `:as-child` + `<NuxtLink>` for whole-card link rows.
- `cardHeader.padding` / `cardBody.padding` / `cardFooter.padding`:
  `compact` / `normal` / `spacious`.

theme-bulma uses Bulma's `.box` as the host since Bulma's native
`.card` has a different structural ladder; gap-fill helpers in
`themes/bulma/assets/index.css` (`vc-card-outline`,
`vc-card-interactive`, header / body / footer separator borders)
paint the bands. theme-bootstrap maps directly onto `.card` /
`.card-header` / `.card-body` / `.card-footer`. theme-tailwind
emits design-token utilities (`bg-bg`, `border-border`, `text-fg`).

`<VCTag>` and `<VCBadge>` look similar but have distinct semantics:
**Tag** is a removable, value-bound chip (paired with `<VCFormTags>`
for read-only summaries); **Badge** is a static status indicator. They
deliberately stay separate components even though theme strings could
overlap.

`<VCFormTags>` does NOT compose `<VCTag>` internally — it's built on
Reka's `TagsInputItem` / `ItemText` / `ItemDelete` compound (which
provides keyboard handling + per-chip focus ring). Sharing visual style
between the two happens at the *theme* level (`formTags.item` and
`tag.root` in each theme entry), not via cross-package imports.

`TagItem` (the shape `<VCTags :items>` accepts) is structurally
compatible with `@vuecs/forms`' `FormOption` — same `value` / `label` /
`icon` / `disabled` keys — so the same array can drive a select and a
chip summary. The type is duplicated locally rather than imported to
keep `@vuecs/elements` free of cross-package deps.

Theme entries ship in **both** `@vuecs/theme-tailwind` and
`@vuecs/theme-bootstrap`. `badge.root` uses the variant system —
`size: 'sm'|'md'|'lg'` × `variant: 'solid'|'soft'|'outline'` ×
`color: <semantic>`. `compoundVariants` cover every cell of the
3 × 6 matrix in each theme so a `<VCBadge variant="soft" color="error">`
renders correctly in either ecosystem.

## Stepper (@vuecs/navigation, plan 013)

`<VCStepper>` and friends live in `@vuecs/navigation` because a stepper
is a navigation/progress pattern (wizard, checkout flow, onboarding) —
the pattern fit, not the manager. The Stepper compound does NOT use
`NavigationManager`; it owns its own state via Reka's `StepperRoot`.

```text
@vuecs/navigation/src/components/stepper/
  Stepper.vue              <- StepperRoot (v-model:modelValue, orientation, linear)
  StepperItem.vue          <- StepperItem (step prop required; data-state)
  StepperTrigger.vue       <- StepperTrigger (clickable; disabled in linear mode when unreachable)
  StepperIndicator.vue     <- StepperIndicator (circle: number / check / icon)
  StepperTitle.vue
  StepperDescription.vue
  StepperSeparator.vue     <- StepperSeparator (carries data-state="completed" when prev step is done)
  context.ts               <- provideStepperContext / useStepperContext (theme-class + theme-variant inheritance)
  theme.ts                 <- shared stepperThemeDefaults
  types.ts                 <- StepperThemeClasses + ThemeElements augmentation
  index.ts
```

`<VCStepper>` `provideStepperContext`s its `themeClass` + `themeVariant`
so descendant parts inherit them automatically — a single
`<VCStepper :theme-variant="{ size: 'sm' }">` resizes every indicator /
title / description / separator without per-part repetition. Children
read via `useStepperContext()` and merge with their own per-instance
props (per-instance values win). The context is optional so children
render bare for unit tests / Storybook. `provideStepperContext` /
`useStepperContext` / `StepperContext` are re-exported from
`@vuecs/navigation` for consumers building custom step parts.

Bootstrap theme strings can't carry `[data-state=…]` attribute
selectors, so `themes/bootstrap/assets/index.css` ships dedicated
`[data-state="active|completed"] .vc-stepper-…` rules with `!important`
(Bootstrap utility classes like `.bg-light` ship `!important`; the
attribute-selector specificity boost alone isn't enough). Both states
use the primary color so the trail of progress reads as one
continuous run; the Tailwind theme matches.

Adding stepper made `Options.items` optional in `@vuecs/navigation`'s
install — a stepper-only consumer can call `app.use(navigation, {})`
without wiring any nav items. NavigationManager still constructs (with
an empty items array) so existing nav code keeps working.

Theme entries ship in `@vuecs/theme-tailwind` (uses
`group-data-[state=active]:` / `group-data-[state=completed]:` variant
prefixes, scoped via the `group` utility added by `<VCStepperItem>`) and
`@vuecs/theme-bootstrap` (Bootstrap utility classes only, with
data-state visualization handled by the bridge CSS as noted above).

## Table compound (@vuecs/table, plan 028)

Semantic-HTML compound for entity-list pages. Outer `<VCTable>` + eight
parts (`<VCTableHeader>` / `<VCTableBody>` / `<VCTableFooter>` /
`<VCTableRow>` / `<VCTableCell>` / `<VCTableHeadCell>` / `<VCTableEmpty>` /
`<VCTableLoading>`). Layer 1 — `@vuecs/core` peer dep only; no Reka dep
(no Reka table primitive exists, semantic HTML covers it).

### Two authoring shapes

- **`:columns :data` driver** (primary): consumer passes `:columns`
  (array of `TableColumn` or bare-string shorthand) + `:data`; uses
  `#cell-<key>` / `#header-<key>` slots for per-column overrides.
  Direct lift-and-shift from `<BTable :fields :items>`.
- **Manual compound markup** (escape hatch): consumer writes
  `<VCTableHeader>` + `<VCTableBody>` + `<VCTableRow>` etc by hand for
  layouts that don't fit the driver (merged cells, custom row
  groupings, multi-line rows).

Both shapes can mix — pass `:columns` AND write `<VCTableHeader>` to
override only the header band, etc.

### Column shape (excerpt)

```ts
type TableColumnRaw<Row> = string | TableColumn<Row>;  // bare-string shorthand
interface TableColumn<Row, K extends string = string> {
    key: K;
    label?: string;                              // defaults to startCase(key)
    class?: VNodeClass;                           // applied to both <th> AND <td>
    headerClass?: VNodeClass;                     // additive on <th>
    cellClass?: VNodeClass;                       // additive on <td>
    sortable?: boolean;
    accessor?: string | ((row: Row) => unknown); // string supports dot-paths
    formatter?: (ctx: { value, key, row }) => string;
    isRowHeader?: boolean;                        // <th scope="row"> instead of <td>
    cellAttrs?: ... | (ctx) => ...;               // per-cell data-* / aria-* escape hatch
    headerAttrs?: ... | (ctx) => ...;             // per-header escape hatch
    headerTitle?: string;                         // native <th title>
    headerAbbr?: string;                          // native <th abbr>
    stickyColumn?: boolean;
    initialSortDirection?: 'asc' | 'desc';
}
```

Near-superset of bootstrap-vue-next's `TableField` so most field
entries copy verbatim from a migration. Auto-derive: when `:columns`
is omitted and `data[0]` is an object, columns come from
`Object.keys(data[0])` (skipping underscore-prefixed row-meta keys).

### Row-meta convention (`_rowVariant` / `_cellVariants`)

Underscore-prefixed fields on the data row tint rows / specific cells
without a function prop. Resolved by `<VCTableRow>` (via row context)
and `<VCTableCell>` (via `columnKey` lookup in `_cellVariants`):

```ts
const users: WithRowMeta<User>[] = [
    { id: 1, name: 'Alice', _rowVariant: 'warning' },
    { id: 2, name: 'Bob', _cellVariants: { email: 'error' } },
];
```

### Sorting

Single-column controlled sort via `v-model:sort`. The table never
sorts data — `setSort` cycles state (`null → asc → desc → null` or
`null → asc → desc → asc` when `:must-sort`) and emits intent.
Consumer sorts (typically via server-side query refetch). Clicks +
Enter/Space on a `:sortable` `<VCTableHeadCell>` cycle the state;
`aria-sort` flips to `"ascending"` / `"descending"` / `"none"` to
match.

Per-column `initialSortDirection` (`'asc'` default) sets the first
direction on activation. Defer to v1.x: client-side sort, multi-column,
custom comparators.

### Row click + keyboard navigation (D5 + plan 028 row-nav adoption)

`:row-clickable` opt-in adds `tabindex="0"` + `cursor-pointer` per row
and wires the keyboard ladder (`↓` / `↑` / `Home` / `End` + Shift, plus
Enter / Space for activation). The click handler runs through a shared
`filterRowClickEvent()` helper that suppresses the row-click when the
event originates inside an interactive descendant — `<a>`, `<button>`,
`<input>`, `<select>`, `<textarea>`, `<label for>`, `[role=button]`,
`[role=link]`, `[contenteditable]`, `[tabindex]:not([tabindex="-1"])`,
or `.vc-overlay-portal-content`. Ported from bootstrap-vue-next's
`utils/filterEvent.ts`; intended to migrate into `@vuecs/core/utils`
so `<VCListItem>`'s selection click can share it.

`useTable().focusedRow` tracks the current focus index — forward-compat
hook for future selection v1.x.

### Colspan resolution (D3 reversal)

`<VCTableEmpty>` and the default-mode `<VCTableLoading>` resolve their
`<td colspan="N">` from two parallel paths:

1. **Shape A** — `columns.length` when `:columns` is set on `<VCTable>`.
2. **Shape B** — auto-count from `<VCTableHeadCell>` siblings via a
   render-time `provide`/`inject` ref. `<VCTableFooter>` provides a
   no-op variant so footer cells don't double-register.

Per-instance `:colspan` on Empty / Loading wins over both. The originally-
proposed sentinel `9999` fallback was reversed during the bvnext research
pass — Firefox honors literal `colspan` values (no clamping), so
auto-counting + explicit prop covers every case correctly.

### Sortable header role (D4 reversal)

Sortable `<VCTableHeadCell>` renders as
`<th tabindex="0" role="columnheader" aria-sort="…">` — native
column-header semantics rather than a nested `<button>`. JAWS / NVDA /
VoiceOver announce column-header context more strongly than a wrapped
button; one focus stop per cell; DOM matches `<BTable>`'s output so
visual-regression baselines don't drift on migration. The originally-
proposed `<button>` wrapper was reversed during the bvnext research.

### Free-win a11y attributes

Applied unconditionally:

- `<table aria-busy="true">` while `:busy`.
- `aria-sort="ascending" | "descending" | "none"` on sortable `<th>`.
- Smart `<th scope>` default — `colgroup` for `colspan > 1`,
  `rowgroup` for `rowspan > 1`, else `'col'`.
- `data-label="<column.label>"` on every `<td>` — forward-compat for
  future stacked-mode CSS (responsive collapse to cards), out of
  scope for v0.1 but adding the attribute now means consumers don't
  rewrite cells later.
- `role="alert" aria-live="polite"` on `<VCTableEmpty>` and
  `role="status" aria-live="polite" aria-busy="true"` on
  `<VCTableLoading>`.

### Theme entries

Theme entries ship in **all three** shipping themes (tailwind /
bootstrap / bulma). theme-bootstrap composes Bootstrap's native
`.table` family (`table-striped`, `table-bordered`, `table-hover`,
`table-sm`, `table-success`, …). theme-bulma composes Bulma's
`.table` family (`is-striped`, `is-bordered`, `is-hoverable`,
`is-narrow`, `has-background-success-light`, …). theme-tailwind
emits utility classes via `@vuecs/design` semantic tokens
(`bg-bg-muted`, `border-border`, `text-fg`).

Bootstrap + Bulma theme strings can't carry `[aria-sort=…]` attribute
selectors, so sort-indicator state lives in dedicated
`vc-table-sort-{asc,desc}` helpers in each bridge's `assets/index.css`.
Sticky-header / sticky-column / row-focused / row-disabled use the
same gap-fill helper pattern (`vc-table-sticky-{header,column}`,
`vc-table-row-{focused,disabled}`) — Bootstrap's `.table-active`
inverts on hover and `.table-success/-warning/-danger` use Bootstrap's
runtime variables, both of which bridge correctly through
`--bs-*` → `--vc-color-*`.

### Out of scope for v0.1

Selection v-model + listbox / treegrid a11y (deferred to v1.x —
`<VCList>`'s selection precedent applies, but tables need a different
a11y model and authup doesn't use it today); expandable rows + nested
tables; virtual scrolling (tanstack-virtual on top of the compound is
the doctrinal path); drag-and-drop column reordering; the
`Simple`/`Lite`/Full three-tier layering (consider for v0.2 — adding
later is non-breaking).

## Visual regression CI (@vuecs-tests/visual-regression, plan 015 P2)

Playwright snapshots every shared demo view × every shipping theme
to catch unintentional visual drift. Lives in a private workspace at
`tests/visual-regression/` (workspace glob `tests/*` was added to the
root `package.json` for this).

```
tests/visual-regression/
  playwright.config.ts   <- webServer boots all 3 example apps
                             (:5180 tailwind, :5181 bootstrap, :5182 bulma)
  specs/themes.spec.ts   <- reads sharedRoutes from @vuecs-examples/shared/routes
                             generates 99 tests (3 themes × 33 routes)
  specs/__snapshots__/   <- committed baselines (one PNG per test)
  package.json           <- @vuecs-tests/visual-regression (private)
```

Adding a view to `examples/_shared/src/routes.ts` automatically lights
it up in this matrix on every theme — no separate registration step.

**CI wiring:**
- `.github/workflows/visual-regression.yml` — runs on PRs that touch
  packages / themes / icons / examples / the visual-regression
  workspace itself. Builds, installs Chromium, runs `playwright test`
  in compare-only mode. Uploads the HTML report as a workflow
  artefact on failure. Includes a **self-bootstrap guard**: if
  `specs/__snapshots__/` contains no `.png` files, the workflow emits
  a warning and skips comparison (rather than failing on missing
  baselines). The guard becomes a no-op once the first baseline run
  lands.
- `.github/workflows/visual-regression-update.yml` — manually
  triggered (`workflow_dispatch`). Runs `playwright test --update-snapshots`
  on Ubuntu, then opens a PR with the regenerated PNGs via
  `peter-evans/create-pull-request`.

**Why two workflows.** Baselines are platform-specific (font hinting +
subpixel rendering differs by OS). Generating them on macOS / Windows
produces baselines that won't match the Ubuntu CI runner. The update
workflow runs in the same Ubuntu environment as the compare workflow,
so the two stay aligned. Local iteration uses Docker — pin the image
tag to the exact Playwright version locked in `package-lock.json`
(e.g. `mcr.microsoft.com/playwright:v1.59.1-jammy` while
`@playwright/test@1.59.1` is locked). A mismatched image ships a
different Chromium build + font stack, defeating the whole point of
matching CI.

**Bootstrap status.** Infrastructure is shipped; the actual baseline
PNGs are not yet committed. Maintainer triggers the update workflow
once to generate the initial 99 baselines, then subsequent PRs
compare against them. Documented at
`tests/visual-regression/README.md`.

**Tolerance.** `maxDiffPixelRatio: 0.002` — 0.2% pixel difference is
Playwright's recommended default for theme-level diffs. Tighten in
`playwright.config.ts` once false positives prove rare.
