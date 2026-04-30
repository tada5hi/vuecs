# Vuecs 📦

[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/vuecs/badge.svg)](https://snyk.io/test/github/Tada5hi/vuecs)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

A Vue 3 component library providing reusable UI components with TypeScript support, CSS extraction, and composable theming.

**Table of Contents**

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Components](#components)
- [Themes](#themes)
- [Contributing](#contributing)
- [License](#license)

## Overview

Vuecs splits into two kinds of packages:

- **Components** — render logic, props, slots, and structural `vc-*` classes. Visually unstyled by default.
- **Themes** — pure data objects mapping component slots (e.g. `listItem.root`, `pagination.link`) to CSS class strings. Swap, compose, or override themes without touching component code.

Themes are resolved at runtime by `@vuecs/core`'s theme manager through four layers: component defaults → themes (in array order) → global overrides → per-instance `themeClass` prop.

## Getting Started

```bash
npm install @vuecs/core @vuecs/theme-bootstrap @vuecs/icon @vuecs/icons-lucide
```

```typescript
import vuecs, { extend } from '@vuecs/core';
import bootstrap from '@vuecs/theme-bootstrap';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    themes: [bootstrap()],
    icons:  [lucide()],
    overrides: {
        elements: { listItem: { classes: { root: extend('border-bottom') } } },
    },
});
```

See [`@vuecs/core`](./packages/core/README.md) for the full theme API (`installThemeManager`, `useComponentTheme`, `extend()`, variant system).

## Components

### `@vuecs/core`

[![npm version](https://badge.fury.io/js/@vuecs%2Fcore.svg)](https://badge.fury.io/js/@vuecs%2Fcore)

Theme resolution engine and component infrastructure. Exports `installThemeManager`, `useComponentTheme`, `extend()`, `resolveComponentTheme`, and shared types. Required by every component and theme package.

[Full documentation](./packages/core/README.md)

### `@vuecs/list`

[![npm version](https://badge.fury.io/js/@vuecs%2Flist.svg)](https://badge.fury.io/js/@vuecs%2Flist)

Compound list (`VCList` / `VCListHeader` / `VCListBody` / `VCListItem` / `VCListFooter` / `VCListLoading` / `VCListNoMore`) plus the `useList()` state composable. Successor to `@vuecs/list-controls` — clean break, compound API.

```vue
<VCList :data="items" :busy="loading" :total="total">
    <template #item="{ data }">
        <VCListItem :data="data">
            <template #text>{{ data.name }}</template>
        </VCListItem>
    </template>
</VCList>
```

[Full documentation](./packages/list/README.md)

### `@vuecs/forms`

[![npm version](https://badge.fury.io/js/@vuecs%2Fforms.svg)](https://badge.fury.io/js/@vuecs%2Fforms)

Form inputs on Reka UI primitives, with validation support: Checkbox + CheckboxGroup, Switch, Radio + RadioGroup, Input, Number, Pin, Select + SelectSearch, Slider (single + range), Tags, Textarea.

```vue
<VCFormGroup label-content="Email" :validation-messages="errors">
    <VCFormInput v-model="form.email" type="email" />
</VCFormGroup>
```

[Full documentation](./packages/forms/README.md)

### `@vuecs/pagination`

[![npm version](https://badge.fury.io/js/@vuecs%2Fpagination.svg)](https://badge.fury.io/js/@vuecs%2Fpagination)

Pagination component with page calculation utilities and Iconify-backed icon props.

```vue
<VCPagination :total="100" :limit="10" :offset="0" @load="onPageChange" />
```

[Full documentation](./packages/pagination/README.md)

### `@vuecs/navigation`

[![npm version](https://badge.fury.io/js/@vuecs%2Fnavigation.svg)](https://badge.fury.io/js/@vuecs%2Fnavigation)

Multi-level navigation with `NavigationManager`, path-based active matching, and `vue-router` integration.

[Full documentation](./packages/navigation/README.md)

### `@vuecs/countdown`

[![npm version](https://badge.fury.io/js/@vuecs%2Fcountdown.svg)](https://badge.fury.io/js/@vuecs%2Fcountdown)

Countdown timer with auto-start, visibility handling, and a scoped slot for custom display.

[Full documentation](./packages/countdown/README.md)

### `@vuecs/gravatar`

[![npm version](https://badge.fury.io/js/@vuecs%2Fgravatar.svg)](https://badge.fury.io/js/@vuecs%2Fgravatar)

Gravatar avatar component.

[Full documentation](./packages/gravatar/README.md)

### `@vuecs/link`

[![npm version](https://badge.fury.io/js/@vuecs%2Flink.svg)](https://badge.fury.io/js/@vuecs%2Flink)

Router-aware link with automatic detection of `vue-router` or Nuxt.

[Full documentation](./packages/link/README.md)

### `@vuecs/timeago`

[![npm version](https://badge.fury.io/js/@vuecs%2Ftimeago.svg)](https://badge.fury.io/js/@vuecs%2Ftimeago)

Relative time display with locale support and auto-update.

[Full documentation](./packages/timeago/README.md)

## Themes

Themes are functions returning `{ elements, classesMergeFn? }`. Multiple themes compose in array order. Themes resolve **CSS class strings only** — icon glyphs are provided separately by [icon presets](#icons) (`@vuecs/icons-lucide`, `@vuecs/icons-font-awesome`, …) configured under `icons:`. Themes only depend on `@vuecs/core`; the class strings they provide target whichever component packages the consumer has installed.

### `@vuecs/theme-bootstrap`

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap)

Bootstrap class defaults (`form-control`, `btn btn-primary`, `d-flex`, …) for every component. Currently targets Bootstrap 5; renamed from `@vuecs/theme-bootstrap-v5` in 3.0 (clean break — no shim). The previous `@vuecs/theme-bootstrap-v4` package was removed in the same release; Bootstrap 4's Sass-compiled stylesheet didn't benefit from the design-token bridge.

```typescript
import bootstrap from '@vuecs/theme-bootstrap';

app.use(vuecs, { themes: [bootstrap()] });
```

### `@vuecs/theme-tailwind`

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-tailwind.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-tailwind)

Tailwind CSS utility-class defaults for every component. Ships with `tailwind-merge` pre-wired as the theme's `classesMergeFn` so `extend()` calls in overrides merge cleanly, and exports a typed `merge: ClassesMergeFn` helper for reuse at the global overrides layer.

```typescript
import tailwind, { merge } from '@vuecs/theme-tailwind';

app.use(vuecs, {
    themes: [tailwind()],
    overrides: { classesMergeFn: merge },
});
```

## Icons

Icon vocabularies are configured separately from themes. Pick an Iconify-backed preset (`@vuecs/icons-lucide`, `@vuecs/icons-font-awesome`) to populate the semantic icon-prop slots on `VCPagination`, `VCButton`, etc.

```typescript
import vuecs from '@vuecs/core';
import bootstrap from '@vuecs/theme-bootstrap';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    themes: [bootstrap()],
    icons:  [lucide()],
});
```

See [`@vuecs/icon`](./packages/icon/README.md) for the runtime component (`<VCIcon>`) and the icon delivery options (Nuxt, Vite, SPA).

## Contributing

```bash
npm ci
npm run build
npm run test
npm run lint
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
