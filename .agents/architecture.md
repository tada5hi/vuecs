# Architecture

## Vue Plugin Pattern

All component packages follow the standard Vue 3 plugin pattern. Each exports an `install` function and a default plugin object:

```typescript
// Typical package entry (src/index.ts)
import { installThemeManager } from '@vuecs/core';

export * from './components';
export * from './type';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    // Register components globally
}

export default { install } satisfies Plugin<[Options?]>;
```

Consumers can use either `app.use(plugin)` for global registration or import components individually.

## Theme System (@vuecs/core)

The core package provides a theme resolution system for CSS class management across all component packages.

### Theme Resolution

CSS classes for named **elements** (logical parts of a component like `root`, `icon`, `actions`) are resolved through four layers:

```
1. Component defaults (vc-* structural classes, co-located in each component)
2. Themes (merged in array order)
3. Overrides (passed to app.use())
4. Instance `themeClass` prop (per-component override)
```

**Themes** (layer 2) always **merge** with component defaults — the `vc-*` structural classes are always preserved. Between themes, a later plain value replaces the earlier theme's contribution but still keeps defaults. **Overrides** (layer 3) and **instance props** (layer 4) **replace** by default. To merge instead, wrap the value with `extend()`.

### Key APIs

- **`ThemeManager`** — Holds config state (themes, overrides) as `shallowRef`s, delegates to `resolveComponentTheme()`. Supports runtime updates via `setThemes()` and `setOverrides()`.
- **`installThemeManager(app, options)`** — Vue plugin that provides ThemeManager via `app.provide()`
- **`injectThemeManager()`** — Retrieves ThemeManager from Vue inject
- **`useComponentTheme(name, instanceThemeClass, defaults)`** — Vue composable accepting `MaybeRef` for instance theme, returns `ComputedRef<T>`. Automatically recomputes when instance theme prop or ThemeManager state changes. Throws if ThemeManager is not installed.
- **`extend(value)`** — Marker function: merge with lower layer instead of replacing (only needed in overrides and instance props; themes always merge with defaults)
- **`resolveComponentTheme()`** — Pure function (no Vue dependency): resolves 4 layers into final class strings

### Architecture

```
@vuecs/core/src/theme/
  constants.ts   <- EXTEND_SYMBOL
  types.ts       <- Type definitions (ThemeClasses, ThemeElements, Theme, ThemeManagerOptions, etc.)
  extend.ts      <- extend() marker, isExtendValue() guard
  resolve.ts     <- Pure function: resolves defaults + themes + overrides + instance -> classes
  manager.ts     <- ThemeManager class (shallowRef state, delegates to resolve)
  composable.ts  <- useComponentTheme() - Vue composable wrapping resolve()
  install.ts     <- installThemeManager() / injectThemeManager() - Vue provide/inject
```

The resolution logic (`resolve.ts`) has zero Vue imports — testable with plain unit tests, no `createApp()` needed. The `ThemeManager` uses Vue's `shallowRef` for reactive state, enabling `computed()` in composables to automatically track theme changes.

### Setup API

```typescript
import vuecs, { extend } from '@vuecs/core';
import bootstrapV5 from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';

app.use(vuecs, {
    themes: [bootstrapV5(), fontAwesome()],
    overrides: {
        elements: {
            listItem: { root: extend('border-b') },
            formSubmit: { root: 'my-custom-btn' },
        },
    },
});
```

### Component Internals

Each component calls `useComponentTheme()` in setup with its name and co-located defaults. The composable accepts `MaybeRef` for the instance theme parameter, so both `ref()` and plain objects work:

```typescript
setup(props) {
    const theme = useComponentTheme('listItem', toRef(props, 'themeClass'), {
        root: 'vc-list-item',
        actions: 'vc-list-item-actions',
    });
    // theme.value.root -> reactive resolved class string
    // Recomputes when props.themeClass or ThemeManager state changes
    return () => h('div', { class: theme.value.root }, [...]);
}
```

## Theme Architecture

Theme packages (`preset-bootstrap-v4`, `preset-bootstrap-v5`, `preset-font-awesome`) are functions returning `Theme` objects with an `elements` map. They configure component appearance via CSS class mappings. Multiple themes are merged in array order. Theme values are always merged with component defaults (no `extend()` needed in presets). The `extend()` helper is used in overrides/instance props to merge instead of replace, and between themes to accumulate values from multiple presets (e.g., font-awesome extends icon classes on top of bootstrap structural classes).

```typescript
// Theme type structure
type Theme = {
    elements: ThemeElements;             // component name -> element -> class string
    classesMergeFn?: ClassesMergeFn;     // optional merge function for extend()
};

type ThemeManagerOptions = {
    themes?: Theme[];       // composable themes
    overrides?: Theme;      // user-level overrides (same shape)
};
```

### Type-Safe Theme Slots (ThemeElements)

`ThemeElements` is an empty augmentable interface with no index signature. Each component package extends it via TypeScript declaration merging to register its component name and typed slot keys. `Theme.elements` uses `Partial<ThemeElements>` so each theme only needs to provide a subset of known components. Internal runtime code casts to `Record<string, ThemeClassesOverride>` for dynamic dispatch by component name.

```typescript
// In @vuecs/core — empty interface for declaration merging
export interface ThemeElements {}

export type Theme = {
    elements: Partial<ThemeElements>;
    classesMergeFn?: ClassesMergeFn;
};

// In a component package (e.g., @vuecs/pagination/src/component.ts)
declare module '@vuecs/core' {
    interface ThemeElements {
        pagination?: ThemeClassesOverride<PaginationThemeClasses>;
    }
}
```

When consumers install component packages, the augmented `ThemeElements` provides:
- Autocomplete for component names in `app.use(vuecs, { overrides: { elements: { /* autocomplete here */ } } })`
- Type checking for slot keys within each component's theme override
- Typo detection for both component names and slot keys in preset definitions

## NavigationManager (@vuecs/navigation)

The navigation package has its own manager pattern using `@posva/event-emitter`:

- `NavigationManager` maintains the navigation tree state
- Provided to the component tree via `provideNavigationManager()`
- `VCNavItems` and `VCNavItem` components consume the manager
- Integrates with `vue-router` for active state tracking

## Component Rendering

Components use TypeScript render functions (not `.vue` SFCs) via `defineComponent` + `h()`. This avoids the Vue template compiler dependency in most packages. The `@vitejs/plugin-vue` plugin is only enabled for packages that contain `.vue` files (form-controls).

## CSS Strategy

Components emit minimal structural CSS via co-located `vc-*` default classes. Visual styling is delegated to theme packages. CSS is extracted into separate `dist/style.css` files during build, so consumers can import styles independently.

## Dependency Flow

```
Themes ──configure──> ThemeManager (in @vuecs/core)
                          |
Components ──read─────────┘ (via useComponentTheme)
     |
     └──> @vuecs/link (navigation uses link for route-aware anchors)
```
