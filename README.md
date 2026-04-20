# Vuecs 📦

[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/vuecs/badge.svg)](https://snyk.io/test/github/Tada5hi/vuecs)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

A Vue 3 component library providing reusable UI components with TypeScript support, CSS extraction, and composable theming via presets.

**Table of Contents**

- [Packages](#packages)
- [Contributing](#contributing)
- [License](#license)

## Packages

### `@vuecs/core`

[![npm version](https://badge.fury.io/js/@vuecs%2Fcore.svg)](https://badge.fury.io/js/@vuecs%2Fcore)

Theme resolution system, utilities, and component infrastructure. Provides `installThemeManager`, `useComponentTheme`, `extend()`, and preset composition.

```bash
npm install @vuecs/core
```

```typescript
import vuecs, { extend } from '@vuecs/core';
import bootstrapV5 from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';

app.use(vuecs, {
    themes: [bootstrapV5(), fontAwesome()],
    overrides: {
        elements: { listItem: { root: extend('border-bottom') } },
    },
});
```

[Full documentation](./packages/core/README.md)

### `@vuecs/list-controls`

[![npm version](https://badge.fury.io/js/@vuecs%2Flist-controls.svg)](https://badge.fury.io/js/@vuecs%2Flist-controls)

List display components with loading, empty state, and item event handling (created/updated/deleted).

```bash
npm install @vuecs/list-controls
```

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

Form input components with validation support: input, checkbox, select, textarea, submit, searchable select, and range slider.

```bash
npm install @vuecs/form-controls
```

```vue
<VCFormGroup label-content="Email" :validation-messages="errors">
    <VCFormInput v-model="form.email" type="email" />
</VCFormGroup>
```

[Full documentation](./packages/form-controls/README.md)

### `@vuecs/pagination`

[![npm version](https://badge.fury.io/js/@vuecs%2Fpagination.svg)](https://badge.fury.io/js/@vuecs%2Fpagination)

Pagination component with page calculation utilities and icon support via presets.

```bash
npm install @vuecs/pagination
```

```vue
<VCPagination :total="100" :limit="10" :offset="0" @load="onPageChange" />
```

[Full documentation](./packages/pagination/README.md)

### `@vuecs/navigation`

[![npm version](https://badge.fury.io/js/@vuecs%2Fnavigation.svg)](https://badge.fury.io/js/@vuecs%2Fnavigation)

Multi-level navigation with `NavigationManager`, path-based matching, and vue-router integration.

```bash
npm install @vuecs/navigation
```

[Full documentation](./packages/navigation/README.md)

### `@vuecs/countdown`

[![npm version](https://badge.fury.io/js/@vuecs%2Fcountdown.svg)](https://badge.fury.io/js/@vuecs%2Fcountdown)

Countdown timer component with auto-start, visibility handling, and scoped slot for custom display.

```bash
npm install @vuecs/countdown
```

[Full documentation](./packages/countdown/README.md)

### `@vuecs/gravatar`

[![npm version](https://badge.fury.io/js/@vuecs%2Fgravatar.svg)](https://badge.fury.io/js/@vuecs%2Fgravatar)

Gravatar avatar component.

```bash
npm install @vuecs/gravatar
```

[Full documentation](./packages/gravatar/README.md)

### `@vuecs/link`

[![npm version](https://badge.fury.io/js/@vuecs%2Flink.svg)](https://badge.fury.io/js/@vuecs%2Flink)

Router-aware link component with automatic detection of vue-router or Nuxt.

```bash
npm install @vuecs/link
```

[Full documentation](./packages/link/README.md)

### `@vuecs/timeago`

[![npm version](https://badge.fury.io/js/@vuecs%2Ftimeago.svg)](https://badge.fury.io/js/@vuecs%2Ftimeago)

Relative time display component with locale support and auto-update.

```bash
npm install @vuecs/timeago
```

[Full documentation](./packages/timeago/README.md)

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
