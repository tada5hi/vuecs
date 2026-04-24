# @vuecs/core 🌱

[![npm version](https://badge.fury.io/js/@vuecs%2Fcore.svg)](https://badge.fury.io/js/@vuecs%2Fcore)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Theme resolution system, global behavioral defaults (i18n), utilities, and component infrastructure for the vuecs component library. Provides composable theming via themes with a layered override mechanism, plus a parallel system for global defaults of non-class props.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Theme System](#theme-system)
  - [Themes](#themes)
  - [Overrides](#overrides)
  - [Instance Override](#instance-override)
  - [extend()](#extend)
  - [Custom Merge Function](#custom-merge-function)
- [Global Behavioral Defaults](#global-behavioral-defaults)
- [API Reference](#api-reference)
- [License](#license)

## Installation

```bash
npm install @vuecs/core
```

## Quick Start

```typescript
import vuecs from '@vuecs/core';
import bootstrapV5 from '@vuecs/theme-bootstrap-v5';
import fontAwesome from '@vuecs/theme-font-awesome';

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

**Themes** (layer 2) always merge with component defaults — `vc-*` structural classes are always preserved. **Overrides** and **instance props** replace by default.

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
            formSubmit: { classes: { createButton: 'btn btn-lg btn-success' } },
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

Overrides and instance props replace by default. Use `extend()` to merge instead:

```typescript
import { extend } from '@vuecs/core';

app.use(vuecs, {
    overrides: {
        elements: {
            listItem: { classes: { root: extend('border-bottom') } },
            // result: "vc-list-item border-bottom" (merged with resolved value)
        },
    },
});
```

In the **theme** layer, `extend()` accumulates values across multiple themes (e.g., font-awesome extending bootstrap icon classes). Plain theme values already merge with defaults automatically.

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

## Global Behavioral Defaults

Non-class behavioral props (button text, placeholder strings, visibility toggles) are resolved through a **3-layer chain** that mirrors the theme system:

```
1. Instance prop (when not `undefined`)             ← highest priority
2. Global defaults (from app.use() config)          ← may be MaybeRef
3. Component hardcoded fallback                     ← lowest priority
```

### Configuration

```typescript
import { computed } from 'vue';
import vuecs from '@vuecs/core';

app.use(vuecs, {
    defaults: {
        formSubmit: {
            createText: computed(() => t('actions.create')), // reactive for i18n
            updateText: 'Aktualisieren',                      // or plain value
        },
        listNoMore: {
            content: 'Keine weiteren Einträge verfügbar...',
        },
    },
});
```

Reactive sources (`ref`, `computed`) unwrap automatically, so locale changes propagate without extra wiring.

### Per-instance override

Still just a regular Vue prop — instance props always win:

```vue
<VCFormSubmit create-text="Save" />
```

### Components that support global defaults

| Component | Configurable keys |
|-----------|-------------------|
| `VCFormSubmit` | `type`, `icon`, `createText`, `updateText` |
| `VCFormSelect` | `optionDefault`, `optionDefaultId`, `optionDefaultValue` |
| `VCFormGroup` | `validation` |
| `VCFormInputCheckbox` | `labelContent` |
| `VCListItem` | `textPropName` |
| `VCListNoMore` | `content` |

## API Reference

### Theme System

| Export | Description |
|--------|-------------|
| `installThemeManager(app, options?)` | Vue plugin — provides ThemeManager via `app.provide()` |
| `injectThemeManager(app?)` | Retrieve ThemeManager from Vue inject |
| `useComponentTheme(name, props, defaults)` | Vue composable — reads `props.themeClass` / `props.themeVariant`; returns `ComputedRef<T>` with resolved classes |
| `extend(value)` | Marker function — merge with lower layer instead of replacing |
| `resolveComponentTheme(...)` | Pure function — no Vue dependency, fully testable |
| `ThemeManager` | Holds config (themes, overrides) |

### Global Defaults System

| Export | Description |
|--------|-------------|
| `installDefaultsManager(app, options?)` | Vue plugin — provides DefaultsManager via `app.provide()` |
| `injectDefaultsManager(app?)` | Retrieve DefaultsManager from Vue inject |
| `useComponentDefaults(name, props, hardcoded)` | Vue composable — returns `ComputedRef<T>` with resolved behavioral defaults |
| `DefaultsManager` | Holds the global defaults map (supports `setDefaults()` for runtime updates) |
| `ComponentDefaults` | Augmentable interface — each component package registers its typed defaults via declaration merging |
| `ComponentDefaultValues<T>` | Helper type — wraps each field of `T` as `MaybeRef<T[K] \| undefined>` |

## License

Made with 💚

Published under [MIT License](./LICENSE).
