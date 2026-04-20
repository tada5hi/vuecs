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

- **`ThemeManager`** — Holds config state (themes, overrides), delegates to `resolveComponentTheme()`
- **`installThemeManager(app, options)`** — Vue plugin that provides ThemeManager via `app.provide()`
- **`injectThemeManager()`** — Retrieves ThemeManager from Vue inject
- **`useComponentTheme(name, instanceThemeClassRef, defaults)`** — Vue composable, returns `ComputedRef<T>`. Throws if ThemeManager is not installed.
- **`extend(value)`** — Marker function: merge with lower layer instead of replacing (only needed in overrides and instance props; themes always merge with defaults)
- **`resolveComponentTheme()`** — Pure function (no Vue dependency): resolves 4 layers into final class strings

### Architecture

```
@vuecs/core/src/theme/
  constants.ts   <- EXTEND_SYMBOL
  types.ts       <- Type definitions (ThemeClasses, Theme, ThemeManagerOptions, etc.)
  extend.ts      <- extend() marker, isExtendValue() guard
  resolve.ts     <- Pure function: resolves defaults + themes + overrides + instance -> classes
  manager.ts     <- ThemeManager class (holds config, delegates to resolve)
  composable.ts  <- useComponentTheme() - Vue composable wrapping resolve()
  install.ts     <- installThemeManager() / injectThemeManager() - Vue provide/inject
```

The resolution logic has zero Vue imports — testable with plain unit tests, no `createApp()` needed.

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

Each component calls `useComponentTheme()` in setup with its name and co-located defaults:

```typescript
setup(props) {
    const theme = useComponentTheme('listItem', toRef(props, 'themeClass'), {
        root: 'vc-list-item',
        actions: 'vc-list-item-actions',
    });
    // theme.value.root -> reactive resolved class string
    return () => h('div', { class: theme.value.root }, [...]);
}
```

## Theme Architecture

Theme packages (`preset-bootstrap-v4`, `preset-bootstrap-v5`, `preset-font-awesome`) are functions returning `Theme` objects with an `elements` map. They configure component appearance via CSS class mappings. Multiple themes are merged in array order. Theme values are always merged with component defaults (no `extend()` needed in presets). The `extend()` helper is used in overrides/instance props to merge instead of replace, and between themes to accumulate values from multiple presets (e.g., font-awesome extends icon classes on top of bootstrap structural classes).

```typescript
// Theme type structure
type Theme = {
    elements: ThemeComponentElements;    // component name -> element -> class string
    classesMergeFn?: ClassesMergeFn;     // optional merge function for extend()
};

type ThemeManagerOptions = {
    themes?: Theme[];       // composable themes
    overrides?: Theme;      // user-level overrides (same shape)
};
```

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
