# @vuecs/theme-bootstrap-v4 🎨

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v4.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-bootstrap-v4)

Bootstrap 4 theme for the vuecs component library. Maps component slot
classes onto Bootstrap 4 utility classes (`form-control`, `btn`,
`alert`, …).

**Table of Contents**

- [Installation](#installation)
- [Setup](#setup)
- [Design-System Bridge (limited)](#design-system-bridge-limited)
- [License](#license)

## Installation

```bash
npm install @vuecs/theme-bootstrap-v4 @vuecs/core bootstrap@4
```

## Setup

```ts
import 'bootstrap/dist/css/bootstrap.min.css';
import vuecs from '@vuecs/core';
import bootstrapV4 from '@vuecs/theme-bootstrap-v4';

app.use(vuecs, {
    themes: [bootstrapV4()],
});
```

## Design-System Bridge (limited)

Importable as:

```css
/* app.css */
@import "bootstrap/dist/css/bootstrap.min.css";
@import "@vuecs/design";
@import "@vuecs/theme-bootstrap-v4";       /* bare form — resolves to index.css */
/*  or: @import "@vuecs/theme-bootstrap-v4/index.css";  (explicit) */
```

The bridge remaps Bootstrap 4's `:root` theme-color CSS variables
(`--primary`, `--secondary`, …) onto `@vuecs/design` tokens so your own
CSS that references `var(--primary)` follows the palette.

### ⚠️ Limitation

**Bootstrap 4's component stylesheets do not consume these CSS
variables** — `.btn-primary`, `.alert-success`, etc. are compiled from
Sass to literal hex values at build time. Overriding `--primary` via
this bridge therefore does NOT reskin Bootstrap's built-in components.
Full Bootstrap 4 repaletting requires a Sass rebuild with
`$theme-colors` overrides.

If palette-driven Bootstrap components matter for your app, use
Bootstrap 5 + `@vuecs/theme-bootstrap-v5` — Bootstrap 5's components DO
read the `--bs-*` CSS variables and the bridge there works end-to-end.

## License

Made with 💚

Published under [MIT License](./LICENSE).
