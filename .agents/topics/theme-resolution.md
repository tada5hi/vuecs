# Theme System (@vuecs/core)

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
- **`installThemeManager(app, options)`** — Vue plugin that provides ThemeManager via `app.provide()`. **Install-order-safe (#1591):** if a manager already exists in the app context, the call **merges** `options.themes` (appended) and `options.overrides` (replaces) into it instead of returning early. This way `app.use(installNavigation)` running before `app.use(vuecs, { themes: [...] })` still applies the themes. The same merge-on-second-call pattern applies to `installDefaultsManager` (per-component deep merge via `DefaultsManager.mergeDefaults`) and `installConfigManager` (shallow merge of `options.config`).
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
