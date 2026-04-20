# @vuecs/core 🌱

[![npm version](https://badge.fury.io/js/@vuecs%2Fcore.svg)](https://badge.fury.io/js/@vuecs%2Fcore)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Theme resolution system, utilities, and component infrastructure for the vuecs component library. Provides composable theming via themes with a layered override mechanism.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Theme System](#theme-system)
  - [Themes](#themes)
  - [Overrides](#overrides)
  - [Instance Override](#instance-override)
  - [extend()](#extend)
  - [Custom Merge Function](#custom-merge-function)
- [API Reference](#api-reference)
- [License](#license)

## Installation

```bash
npm install @vuecs/core
```

## Quick Start

```typescript
import vuecs from '@vuecs/core';
import bootstrapV5 from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';

app.use(vuecs, {
    themes: [bootstrapV5(), fontAwesome()],
});
```

## Theme System

CSS classes for named **elements** (logical parts of a component like `root`, `icon`, `actions`) are resolved through four layers:

```
1. Component defaults     — vc-* structural classes, co-located in each component
2. Themes                  — merged in array order
3. Overrides               — passed to app.use()
4. Instance themeClass prop — per-component override
```

Each layer **replaces** the element value from the layer below by default.

### Themes

Themes are functions returning a `{ elements }` object. Multiple themes are composed via array order:

```typescript
app.use(vuecs, {
    themes: [bootstrapV5(), fontAwesome()],
});
```

### Overrides

Override specific component elements globally:

```typescript
app.use(vuecs, {
    themes: [bootstrapV5()],
    overrides: {
        elements: {
            formSubmit: { createButton: 'btn btn-lg btn-success' },
        },
    },
});
```

### Instance Override

Override per component instance via the `themeClass` prop:

```vue
<VCListItem :theme-class="{ root: 'custom-item-class' }" />
```

### extend()

By default each layer replaces the element value from below. Use `extend()` to merge instead:

```typescript
import { extend } from '@vuecs/core';

app.use(vuecs, {
    overrides: {
        elements: {
            listItem: { root: extend('border-bottom') },
            // result: "vc-list-item border-bottom" (merged with default)
        },
    },
});
```

`extend()` works at all layers: themes, overrides, and instance props.

### Custom Merge Function

When `extend()` triggers a merge, the system uses string concatenation by default. Provide a custom `classesMergeFn` for Tailwind or other utility-first frameworks:

```typescript
import { twMerge } from 'tailwind-merge';

app.use(vuecs, {
    themes: [tailwindTheme()],
    overrides: {
        elements: {},
        classesMergeFn: twMerge,
    },
});
```

The `classesMergeFn` can also be provided per theme.

## API Reference

| Export | Description |
|--------|-------------|
| `installThemeManager(app, options?)` | Vue plugin — provides ThemeManager via `app.provide()` |
| `injectThemeManager(app?)` | Retrieve ThemeManager from Vue inject |
| `useComponentTheme(name, ref, defaults)` | Vue composable — returns `ComputedRef<T>` with resolved classes |
| `extend(value)` | Marker function — merge with lower layer instead of replacing |
| `resolveComponentTheme(...)` | Pure function — no Vue dependency, fully testable |
| `ThemeManager` | Holds config (themes, overrides) |

## License

Made with 💚

Published under [MIT License](./LICENSE).
