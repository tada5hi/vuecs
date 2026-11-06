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

## Subsystem contracts

Read these on demand before changing the corresponding behavior. Topic files are not imported by `CLAUDE.md`.

- [Vue Plugin Pattern](topics/plugin-pattern.md)
- [Theme System (@vuecs/core)](topics/theme-resolution.md)
- [Theme Architecture](topics/theme-composition.md)
- [Global Behavioral Defaults (#1491)](topics/behavioral-defaults.md)
- [Icons (@vuecs/icon + presets)](topics/icons.md)
- [Cross-cutting Config](topics/application-config.md)
- [Design System](topics/design-system.md)
- [Locale (@vuecs/core + @vuecs/locale)](topics/locale.md)
- [Navigation registry + resolver](topics/navigation.md)
- [Component Rendering](topics/component-rendering.md)
- [CSS Strategy](topics/css.md)
- [Dependency Flow](topics/dependency-flow.md)
- [Building blocks (Reka UI)](topics/reka-primitives.md)
- [Headless composables](topics/headless-composables.md)
- [Overlays](topics/overlays.md)
- [Atomic Elements](topics/atomic-elements.md)
- [Stepper](topics/stepper.md)
- [Breadcrumb compound](topics/breadcrumb.md)
- [Placeholder skeletons (@vuecs/placeholder, issue #1476)](topics/placeholder.md)
- [Table compound](topics/table.md)
- [Tree](topics/tree.md)
- [Visual regression CI](topics/visual-regression.md)
