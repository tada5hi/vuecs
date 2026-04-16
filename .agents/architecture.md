# Architecture

## Vue Plugin Pattern

All component packages follow the standard Vue 3 plugin pattern. Each exports an `install` function and a default plugin object:

```typescript
// Typical package entry (src/index.ts)
export * from './components';
export * from './type';

export function install(instance: App, options?: Options): void {
    // Register components globally and apply options
}

export default { install } satisfies Plugin<Options>;
```

Consumers can use either `app.use(plugin)` for global registration or import components individually.

## Store System (@vuecs/core)

The core package provides a store management system used by component packages to share configuration and state:

- **Store**: Holds component options/configuration (class mappings, default props)
- **StoreManager**: Registry of named stores, allowing preset packages to configure multiple component stores at once
- Stores are accessed via Vue's provide/inject or direct import

## Preset Architecture

Preset packages (`preset-bootstrap-v4`, `preset-bootstrap-v5`, `preset-font-awesome`) configure component appearance by populating stores with CSS class mappings. They act as configuration layers — no components, just store values. This decouples visual theming from component logic.

## NavigationManager (@vuecs/navigation)

The navigation package has its own manager pattern using `@posva/event-emitter`:

- `NavigationManager` maintains the navigation tree state
- Provided to the component tree via `provideNavigationManager()`
- `VCNavItems` and `VCNavItem` components consume the manager
- Integrates with `vue-router` for active state tracking

## Component Rendering

Components use TypeScript render functions (not `.vue` SFCs) via `defineComponent` + `h()`. This avoids the Vue template compiler dependency in most packages. The `@vitejs/plugin-vue` Rollup plugin is only enabled for packages that contain `.vue` files.

## CSS Strategy

Components emit minimal structural CSS. Visual styling is delegated to preset packages. PostCSS extracts CSS into separate `dist/index.css` files during build, so consumers can import styles independently.

## Dependency Flow

```
Presets ──configure──> Stores (in @vuecs/core)
                           │
Components ──read──────────┘
     │
     └──> @vuecs/link (navigation uses link for route-aware anchors)
```
