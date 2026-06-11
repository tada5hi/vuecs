# @vuecs/theme-bootstrap

[![npm version](https://img.shields.io/npm/v/@vuecs/theme-bootstrap)](https://www.npmjs.com/package/@vuecs/theme-bootstrap)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The Bootstrap 5 theme for [vuecs](https://github.com/tada5hi/vuecs).** Native Bootstrap classes (`btn btn-primary`, `form-control`, `modal-content`, …) for every vuecs component — drop vuecs into an existing Bootstrap app and it looks like it was always there. No Tailwind anywhere in the stack.

## ✨ What's inside

- 🅱️ **Full component coverage** — Bootstrap class mappings + variant matrices for every vuecs component family, with gap-fill structural CSS for patterns Bootstrap doesn't ship (stepper, switch sizing, sort indicators).
- 🌉 **Design-token bridge** — optional CSS (`@import "@vuecs/theme-bootstrap"`) wiring Bootstrap's `--bs-*` variables onto `--vc-color-*`. Because Bootstrap 5 reads `--bs-*` at runtime, `setColorPalette()` re-tints **native Bootstrap widgets too** — live, no rebuild.
- 🌗 **Dark mode wired in** — declares a `colorMode.handle` hook that mirrors vuecs's resolved mode onto `data-bs-theme`, so Bootstrap 5.3+ chrome flips together with vuecs tokens (SSR-safe via `@vuecs/nuxt`).
- 🚫 **Tailwind-free palette switching** — pair with `@vuecs/design/standalone` for the full 22-palette catalog as plain CSS variables.

## 📦 Installation

```bash
npm install @vuecs/theme-bootstrap bootstrap
```

## ⚡ Usage

```css
/* main.css */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bootstrap";
```

```ts
import vuecs from '@vuecs/core';
import bootstrap from '@vuecs/theme-bootstrap';

app.use(vuecs, { themes: [bootstrap()] });
```

> Renamed from `@vuecs/theme-bootstrap-v5` in vuecs 3.0 (clean break, no shim). The former `@vuecs/theme-bootstrap-v4` was removed — Bootstrap 4's Sass-compiled CSS can't benefit from the runtime token bridge.

## 📚 Documentation

Full reference: **[vuecs.dev/themes/bootstrap](https://vuecs.dev/themes/bootstrap)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
