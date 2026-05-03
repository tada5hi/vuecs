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

The plan-010 redesign of `@vuecs/list` eliminated this exact category of
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
| `@vuecs/design` | `nonce` (CSP nonce for `setPalette`'s `<style>`) | none — no sensible default |
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

## Design System (@vuecs/design, #1506)

Sits beside — not inside — the theme system. Themes resolve **CSS class
strings**; the design-system layer defines the **actual colors, radii and
other design primitives** those classes reference via CSS variables. This
lets a single set of tokens drive every theme package and enables runtime
palette switching without re-resolving theme classes.

### Layers, top-down

```
1. bg-primary-600          ← Tailwind v4 utility class emitted by theme-tailwind
2. --color-primary-600     ← @theme mapping in assets/index.css
3. --vc-color-primary-600  ← semantic-scale var (overridden by setPalette)
4. --color-blue-600        ← Tailwind's built-in palette (default binding)
5. concrete hex
```

`.dark` flips the semantic aliases (`--vc-color-bg`, `--vc-color-fg`,
`--vc-color-border`, `--vc-color-ring`) only — scales stay the same.
`setPalette({ primary: 'green' })` rewrites layer 3 to `var(--color-green-600)`
via a `<style id="vc-palette">` block, leaving layers 1-2 and 4-5 untouched.

### Package layout

```
@vuecs/design/
  assets/index.css       <- :root + .dark + @theme + @import "./animations.css"
  assets/animations.css  <- Motion primitives — vanilla-CSS port of tw-animate-css (MIT, attributed in header)
  src/
    types.ts                     <- PaletteConfig, SemanticScaleName, TailwindPaletteName
    constants.ts                 <- SEMANTIC_SCALES, TAILWIND_PALETTES, PALETTE_SHADES, PALETTE_STYLE_ELEMENT_ID
    palette.ts                   <- renderPaletteStyles() (pure), setPalette() (DOM)
    composables/
      use-palette.ts             <- bindPalette(ref), usePalette(opts) — Vue + VueUse
      use-color-mode.ts          <- bindColorMode(ref, opts), useColorMode(opts)
      index.ts                   <- composables barrel
    index.ts                     <- top-level barrel
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

**Pure / DOM-side:**
- **`renderPaletteStyles(palette): string`** — pure function. Returns a `:root { … }` block that remaps `--vc-color-<scale>-*` onto `var(--color-<palette>-*)` for every scale set in `palette`. Safe on server and client; used by `@vuecs/nuxt` for SSR pre-hydration.
- **`setPalette(palette, doc?)`** — client-only. Idempotently inserts or updates a `<style id="vc-palette">` element in `<head>`.
- **`PaletteConfig`** — `Partial<Record<SemanticScaleName, TailwindPaletteName>>`.
- **`SemanticScaleName`** — `'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'`.
- **`TailwindPaletteName`** — union of all 22 Tailwind v4 palettes.

**Vue composables (require Vue 3 + `@vueuse/core` as peer deps):**
- **`usePalette(options?)`** — reactive palette state with localStorage persistence. Wrapped via `createSharedComposable`, so every call site shares the same ref + watcher. Returns `{ current: ComputedRef<PaletteConfig>, set(palette), extend(partial) }`. Applies via `setPalette()` on init and on every change.
- **`bindPalette(source: Ref<PaletteConfig>)`** — building block. Wires any reactive ref into the design system (apply on init + watcher). The Nuxt module's `usePalette()` calls this with a cookie-backed ref; the default `usePalette()` calls it with a `useStorage`-backed ref.
- **`useColorMode(options?)`** — reactive light/dark/system mode with localStorage persistence + `<html>` class sync. Returns `{ mode, resolved, isDark, toggle }`. Uses `usePreferredDark` from VueUse to resolve `'system'`.
- **`bindColorMode(source: Ref<ColorMode>, options?)`** — building block; same pattern as `bindPalette`.

`@vueuse/core` is a **required peer dep**: the root `@vuecs/design` entry re-exports the composables, so the VueUse import is unconditional even for consumers who only use `setPalette` / `renderPaletteStyles`. The Vue composables sub-area is intentionally kept on the root export (no subpath) — flat surface area matches `@vuecs/core`'s convention.

### Requirements

- **Tailwind CSS v4+.** `assets/index.css` uses `@theme { … }` and references Tailwind's default `--color-<name>-<shade>` vars. Tailwind v3 is not supported.
- **Dark mode toggle via `.dark` class.** Consumers wire this however they prefer (Nuxt's `@nuxtjs/color-mode`, a Pinia store, vanilla JS). No `prefers-color-scheme` media query layer ships today.

### Runtime palette safelist

`@vuecs/design`'s `assets/index.css` ends with:

```css
@source inline("bg-{red,orange,...,neutral}-{50,100,...,950}");
```

This force-includes all 22 Tailwind palettes × 11 shades in the JIT output. Without it, Tailwind v4 only emits `--color-<palette>-*` tokens for palettes referenced by used utility classes — so `setPalette({ primary: 'emerald' })` would silently fail because `--color-emerald-*` was tree-shaken.

The directive depends on Tailwind v4's documented behavior of emitting `--color-<palette>-<shade>` as a side effect of safelisting `bg-<palette>-<shade>`. If a future Tailwind major changes how palette emission works, this directive needs to update too. See the inline comment in `assets/index.css` for the full rationale.

### Nuxt integration (@vuecs/nuxt)

```
@vuecs/nuxt/
  src/
    module.ts                                  <- defineNuxtModule; auto-imports assets/index.css, registers composables + SSR plugins
    runtime/
      plugins/palette.server.ts                <- emits <style id="vc-palette"> into head via useHead (palette override)
      plugins/colorMode.server.ts              <- emits class="dark"|"light" on <html> via useHead (cookie-driven)
      composables/usePalette.ts                <- thin wrapper: bindPalette(useCookie<PaletteConfig>(...)) — { current, set }
      composables/useColorMode.ts              <- thin wrapper: bindColorMode(useCookie<ColorMode>(...)) — { mode, resolved, isDark, toggle }
```

Consumer usage:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        palette: { primary: 'green', neutral: 'zinc' },
        // colorMode: true (default) ships the in-house useColorMode().
        // Set to false to disable and wire @nuxtjs/color-mode yourself.
    },
});
```

```vue
<!-- in a component -->
<script setup>
const { current, set, extend } = usePalette();
const { resolved, toggle } = useColorMode();
</script>
```

The Nuxt module's auto-imports point at thin wrappers that swap the
storage layer for `useCookie` (so the SSR plugins can read the same
cookie at request time), then delegate to `bindPalette()` /
`bindColorMode()` from `@vuecs/design`. The return shape matches the
default composables exactly, so Nuxt and non-Nuxt consumers see the
same `{ current, set, extend }` / `{ mode, resolved, isDark, toggle }`
API.

On the server, both plugins render their state into the head before first
paint (palette `<style>` block + `html.dark`/`html.light` class). The client
hydrates against the same DOM and continues to manage them reactively —
effectively zero-cost palette switching and zero-FOUC dark mode (except
first visits with `preference: 'system'` and no cookie, where the OS
preference can't be read on the server).

The dark-mode integration is built on `@vueuse/core`'s `usePreferredDark`
plus a Nuxt cookie (`vc-color-mode` by default). It's NOT
`@nuxtjs/color-mode` under the hood — that module remains an alternative
for consumers who prefer it (set `vuecs: { colorMode: false }` to opt out).

### Bootstrap bridge (theme-bootstrap)

`@vuecs/theme-bootstrap` ships an optional CSS file at `assets/index.css`
that wires Bootstrap's `:root` theme-color variables onto `--vc-color-*`.
The package's `package.json` exposes a `style` conditional export, so a
bare `@import "@vuecs/theme-bootstrap"` in a CSS file resolves to the
bridge. The explicit subpath form (`@vuecs/theme-bootstrap/index.css`)
also works. Currently targets Bootstrap 5 — remaps `--bs-primary`,
`--bs-success`, etc. Bootstrap 5 components read `--bs-*` at runtime, so
runtime palette switches via `setPalette()` propagate.

`@vuecs/theme-bootstrap-v4` was removed in vuecs 3.0 — Bootstrap 4
component CSS is Sass-compiled to literal hex, so the design-token
bridge had no practical effect on Bootstrap-rendered widgets, only on
consumer-authored CSS that referenced `var(--primary)`.

### Short-form CSS imports

All style-carrying packages use the `style` conditional export so
consumers can write bare imports:

```css
@import "@vuecs/design";              /* → assets/index.css */
@import "@vuecs/theme-bootstrap";     /* → assets/index.css (bridge) */
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
      tooltip/                <- TooltipProvider / Tooltip / Trigger / Content / Arrow
      dropdown-menu/          <- DropdownMenu / Trigger / Content / Item / Label / Separator / Group / Arrow
      context-menu/           <- ContextMenu / Trigger / Content / Item / Label / Separator / Group
    vue.ts                  <- GlobalComponents augmentation (every VC* part)
    index.ts                <- install() (themes, defaults, config; registers all VC* components)
```

Every overlay family follows the same per-folder layout: each component is a
small SFC, plus `theme.ts` (single shared defaults), `types.ts`
(`<Family>ThemeClasses` + `ThemeElements` augmentation), and `index.ts`
re-export barrel. Tooltip additionally exposes `<VCTooltipProvider>` for
app-level `delayDuration` / `skipDelayDuration` config; the other families
read state from their own root (`v-model:open` on Modal/Popover/Dropdown,
right-click on ContextMenu).

The `useModal()` composable is the vuecs-specific value-add on top of
Reka's Dialog. It exposes a **view stack** (`pushView` / `popView` /
`replaceView`) and an `onClose` hook so consumers can build flows like
"list view → push detail view → pop back" without stacking modals or
fighting z-index. Originally proposed in
[issue #1480](https://github.com/tada5hi/vuecs/issues/1480); the
roadmap-scoped Reka-wrapped compound API is layered on top of it (the
composable owns the state, `<VCModal>` v-binds to it). Equivalent
composables for the other families haven't shipped — most of those don't
need stateful flows, and consumers can wire `:open`/`@update:open`
manually when they do.

Theme entries for all five families (`modal`, `popover`, `tooltip`,
`dropdownMenu`, `contextMenu`) ship in **both** `@vuecs/theme-tailwind` AND
`@vuecs/theme-bootstrap` with `data-state` animation hooks (`open|closed`
for modal/popover/menu, `delayed-open|closed` for tooltip). Menu items also
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
