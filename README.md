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
npm install @vuecs/core @vuecs/theme-bootstrap-v5 @vuecs/theme-font-awesome
```

```typescript
import vuecs, { extend } from '@vuecs/core';
import bootstrapV5 from '@vuecs/theme-bootstrap-v5';
import fontAwesome from '@vuecs/theme-font-awesome';

app.use(vuecs, {
    themes: [bootstrapV5(), fontAwesome()],
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

### `@vuecs/list-controls`

[![npm version](https://badge.fury.io/js/@vuecs%2Flist-controls.svg)](https://badge.fury.io/js/@vuecs%2Flist-controls)

List display with loading, empty state, header/footer/body, and per-item event handling (created/updated/deleted).

```vue
<VCList :data="items" :busy="loading" :total="total">
    <template #item="{ data, deleted }">
        <span>{{ data.name }}</span>
        <button @click="deleted(data)">Remove</button>
    </template>
</VCList>
```

[Full documentation](./packages/list-controls/README.md)

### `@vuecs/form-controls`

[![npm version](https://badge.fury.io/js/@vuecs%2Fform-controls.svg)](https://badge.fury.io/js/@vuecs%2Fform-controls)

Form inputs with validation support: input, checkbox, select, textarea, submit, searchable select, and range slider.

```vue
<VCFormGroup label-content="Email" :validation-messages="errors">
    <VCFormInput v-model="form.email" type="email" />
</VCFormGroup>
```

[Full documentation](./packages/form-controls/README.md)

### `@vuecs/pagination`

[![npm version](https://badge.fury.io/js/@vuecs%2Fpagination.svg)](https://badge.fury.io/js/@vuecs%2Fpagination)

Pagination component with page calculation utilities and icon slots driven by themes.

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

Themes are functions returning `{ elements, classesMergeFn? }`. Multiple themes compose in array order — e.g. a CSS-framework theme for layout plus an icon theme for glyphs. Themes only depend on `@vuecs/core`; the class strings they provide target whichever component packages the consumer has installed.

### `@vuecs/theme-bootstrap-v5`

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v5.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v5)

Bootstrap v5 class defaults (`form-control`, `btn btn-primary`, `d-flex`, …) for every component.

```typescript
import bootstrapV5 from '@vuecs/theme-bootstrap-v5';

app.use(vuecs, { themes: [bootstrapV5()] });
```

### `@vuecs/theme-bootstrap-v4`

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v4.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v4)

Bootstrap v4 class defaults — for projects still on the v4 stylesheet.

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

### `@vuecs/theme-font-awesome`

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-font-awesome.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-font-awesome)

Font Awesome icon classes for icon slots (`formSubmit.createIcon`, `pagination.prevIcon`, `listItem.icon`, …). All values use `extend()` so it layers on top of a CSS-framework theme without wiping its classes.

```typescript
import bootstrapV5 from '@vuecs/theme-bootstrap-v5';
import fontAwesome from '@vuecs/theme-font-awesome';

app.use(vuecs, { themes: [bootstrapV5(), fontAwesome()] });
```

## Contributing

```bash
npm ci
npm run build
npm run test
npm run lint
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
