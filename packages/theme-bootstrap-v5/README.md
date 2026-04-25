# @vuecs/theme-bootstrap-v5 🎨

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v5.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v5)

Bootstrap 5 theme for the vuecs component library. Maps component
slot classes onto Bootstrap's utility classes (`btn btn-success`,
`form-control`, `alert`, …) so the UI inherits Bootstrap's visuals
out of the box.

**Table of Contents**

- [Installation](#installation)
- [Setup](#setup)
- [Design-System Bridge (optional)](#design-system-bridge-optional)
- [License](#license)

## Installation

```bash
npm install @vuecs/theme-bootstrap-v5 @vuecs/core bootstrap
```

## Setup

```ts
import 'bootstrap/dist/css/bootstrap.min.css';
import vuecs from '@vuecs/core';
import bootstrapV5 from '@vuecs/theme-bootstrap-v5';

app.use(vuecs, {
    themes: [bootstrapV5()],
});
```

## Design-System Bridge (optional)

Import `@vuecs/theme-bootstrap-v5/index.css` after Bootstrap and after
`@vuecs/design/index.css` to make Bootstrap's `--bs-primary`,
`--bs-success`, etc. reference the shared vuecs design tokens. That
means:

- `setPalette({ primary: 'green' })` reskins Bootstrap buttons/alerts/badges alongside everything else.
- `.dark` flips Bootstrap surfaces without needing `data-bs-theme="dark"`.

```css
/* app.css */
@import "bootstrap/dist/css/bootstrap.min.css";
@import "@vuecs/design";
@import "@vuecs/theme-bootstrap-v5";          /* bare form — resolves to index.css */
/*  or: @import "@vuecs/theme-bootstrap-v5/index.css";  (explicit) */
```

### Known limitations

- **`--bs-<color>-rgb` triplets are not remapped.** CSS can't convert a
  hex/CSS-color to an RGB triplet at runtime, so Bootstrap features
  built on `rgba(var(--bs-primary-rgb), α)` (focus-ring translucency,
  `.bg-primary-subtle`, etc.) keep Bootstrap's defaults. Override
  manually if you need them palette-driven.
- **Only one dark source of truth.** The bridge uses the `.dark` class
  (matching the rest of the vuecs design-system). Bootstrap's built-in
  `[data-bs-theme="dark"]` is not touched — pick one toggle to avoid
  surprising interactions.

## License

Made with 💚

Published under [MIT License](./LICENSE).
