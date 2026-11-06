# Architecture

## Component packages

Components are Vue 3 plugins. Each package exposes an `install` function and a default plugin object, while named exports support local registration. Packages depend on the shared theme/default/config managers from `@vuecs/core`.

## Theme resolution

Class resolution applies component defaults, themes in array order, application overrides, and instance `themeClass` props. Themes merge with defaults; overrides and instance props replace by default, with `extend()` opting into a merge. Variant definitions and compound variants add classes after slot resolution.

`ThemeManager` holds shallow reactive configuration and delegates to pure resolution helpers. `useComponentTheme()` reads reactive props and manager state. The pure helpers in `theme/resolve.ts` and `theme/variant.ts` have no Vue imports.

Repeated manager installation merges options into the existing app context. Themes append, defaults deep-merge per component, and config shallow-merges. Component plugin installation must not prevent the application from installing its theme later.

## Public types and boundaries

Generic component facades preserve the consumer entity type through props and slots. Export every type in that facade chain so declaration generation can name it. Component slot callbacks describe actions with bare names such as `select` or `close`.

`@vuecs/core` owns shared component infrastructure. `@vuecs/design` owns design tokens and palette/color-mode primitives. Theme packages supply framework-specific classes and runtime handlers. Nuxt integration dispatches through installed themes.

## Detailed reference

Read [the architecture reference](references/architecture.md) for subsystem contracts, component patterns, and detailed examples. It is loaded on demand.
