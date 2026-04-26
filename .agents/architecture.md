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
import bootstrapV5 from '@vuecs/theme-bootstrap-v5';
import fontAwesome from '@vuecs/theme-font-awesome';

app.use(vuecs, {
    themes: [bootstrapV5(), fontAwesome()],
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

Theme packages (`theme-bootstrap-v4`, `theme-bootstrap-v5`, `theme-font-awesome`, `theme-tailwind`) are functions returning `Theme` objects with an `elements` map. They configure component appearance via CSS class mappings and optional variant definitions. Multiple themes are merged in array order. `@vuecs/theme-tailwind` ships a `twMerge`-backed `merge` function pre-wired as its `classesMergeFn` and exports it as `merge: ClassesMergeFn` for reuse in overrides.

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

When a composite component (e.g. `VCList`) forwards behavioral props to a
child component whose prop is resolved via `useComponentDefaults`, the
composite's own Vue `prop.default` must be `undefined`. A composite with
`prop: { default: 'something' }` that forwards `something` to the child will
always win layer 1 on the child and shadow the child's global defaults.
See `VCList.noMoreContent` / `VCList.itemTextPropName` (both `default: undefined`)
for the pattern.

### Setup API

```typescript
import vuecs from '@vuecs/core';

app.use(vuecs, {
    themes: [bootstrapV5(), fontAwesome()],
    defaults: {
        submitButton: {
            createText: computed(() => t('actions.create')),
            updateText: 'Aktualisieren',
        },
        listNoMore: {
            content: 'Keine weiteren Einträge verfügbar...',
        },
        formSelect: {
            optionDefaultValue: '-- Auswählen --',
        },
    },
});
```

### Component consumption

Components drop Vue-level prop defaults (so `undefined` means "fall through") and
resolve via the composable. The same composable powers experimental
*standalone* hooks like `useSubmitButton()` in `@vuecs/form-controls` —
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
| `VCFormSelect` | `optionDefault`, `optionDefaultId`, `optionDefaultValue` |
| `VCFormGroup` | `validation` |
| `VCFormInputCheckbox` | `labelContent` |
| `VCListItem` | `textPropName` |
| `VCListNoMore` | `content` |

For these props the Vue `prop.default` is `undefined`; the effective default now
lives in the component's `behavioralDefaults` constant, which is passed to the
composable as the lowest-priority layer. The `submitButton` row is unusual —
it's the only entry without a corresponding `VC*` component. The previous
`VCFormSubmit` was decomposed into `VCButton` (in `@vuecs/button`) plus a
`useSubmitButton()` reactive bind-object helper (in `@vuecs/form-controls`,
marked `@experimental`); the defaults registration moved with the helper.

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
  assets/index.css    <- :root + .dark + @theme (pure CSS, no build step)
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

### Bootstrap bridges (theme-bootstrap-v{4,5})

Both Bootstrap theme packages ship an optional CSS file at
`assets/index.css` that wires Bootstrap's `:root` theme-color variables
onto `--vc-color-*`. Each package's `package.json` exposes a `style`
conditional export, so a bare `@import "@vuecs/theme-bootstrap-v5"`
(and `-v4`) in a CSS file resolves to the bridge. Explicit subpath
imports (`@vuecs/theme-bootstrap-v5/index.css`) also work.

| Package | Scope | Affects Bootstrap components? |
|---------|-------|-------------------------------|
| `theme-bootstrap-v5` | Remaps `--bs-primary`, `--bs-success`, ... | ✅ Yes — Bootstrap 5 components read `--bs-*` at runtime |
| `theme-bootstrap-v4` | Remaps `--primary`, `--success`, ... | ⚠️ No — Bootstrap 4 component CSS is Sass-compiled to literal hex; the bridge only affects consumer-authored rules that reference `var(--primary)` |

The v4 bridge is intentionally shipped for API parity and for custom-CSS
use cases, but its practical surface is limited; full Bootstrap 4
repaletting requires rebuilding Bootstrap from Sass.

### Short-form CSS imports

All style-carrying packages use the `style` conditional export so
consumers can write bare imports:

```css
@import "@vuecs/design";              /* → assets/index.css */
@import "@vuecs/theme-bootstrap-v5";  /* → assets/index.css (bridge) */
@import "@vuecs/theme-bootstrap-v4";  /* → assets/index.css (bridge) */
@import "@vuecs/form-controls";       /* → dist/style.css */
@import "@vuecs/list-controls";       /* → dist/style.css */
@import "@vuecs/navigation";          /* → dist/style.css */
@import "@vuecs/pagination";          /* → dist/style.css */
```

The component-package CSS bundles ship the structural rules that the JS
entry doesn't auto-import (extracted at build time by tsdown). Consumers
who don't import these will see the bundled JS render correctly but lose
component-specific structural styling — checkbox switch variant,
range-slider track and thumbs, search-dropdown panel, nav tree-line, etc.

Explicit subpath forms (`@vuecs/design/index.css`, `@vuecs/form-controls/style.css`,
`@vuecs/form-controls/dist/style.css`) remain supported for clarity when
mixing multiple CSS entry points.

## NavigationManager (@vuecs/navigation)

The navigation package has its own manager pattern using `@posva/event-emitter`:

- `NavigationManager` maintains the navigation tree state
- Provided to the component tree via `provideNavigationManager()`
- `VCNavItems` and `VCNavItem` components consume the manager
- Integrates with `vue-router` for active state tracking

## Component Rendering

Components use TypeScript render functions (not `.vue` SFCs) via `defineComponent` + `h()`. This avoids the Vue template compiler dependency in most packages. The `@vitejs/plugin-vue` plugin is only enabled for packages that contain `.vue` files (form-controls, pagination).

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

Some components compose [Reka UI](https://reka-ui.com/) primitives internally for accessibility heavy lifting (focus management, keyboard nav, edge-aware rendering). Consumers don't see this — the public API (props, emits, theme classes) is the vuecs contract; Reka is an implementation detail. Today this applies to `@vuecs/pagination` (wraps `PaginationRoot` / `PaginationList` / `PaginationListItem` / `PaginationFirst|Prev|Next|Last` / `PaginationEllipsis`). The roadmap for broader Reka adoption (overlays, form-controls migration, headless composables) lives at [`.agents/plans/reka-ui-adoption-roadmap.md`](plans/reka-ui-adoption-roadmap.md). See [`.agents/references/reka-ui.md`](references/reka-ui.md) for the conceptual mapping.

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
