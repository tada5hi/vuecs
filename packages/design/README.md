# @vuecs/design

[![npm version](https://badge.fury.io/js/@vuecs%2Fdesign.svg)](https://badge.fury.io/js/@vuecs%2Fdesign)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Theme-agnostic CSS design tokens for vuecs components — concrete OKLCH defaults
matching Tailwind v4's palette, light/dark `.dark` flips, motion primitives
(vanilla-CSS port of `tw-animate-css`), and the theme-agnostic `useColorMode`
composable. Also ships generic palette primitives (`applyColorPaletteCss`,
`bindColorPalette<T>`, `COLOR_PALETTE_STYLE_ELEMENT_ID`) that any theme can compose to
implement runtime palette switching.

No Tailwind dependency — works standalone with `@vuecs/theme-bootstrap`,
`@vuecs/theme-bulma`, or no theme at all.

Full documentation: **[vuecs.dev/guide/design-tokens](https://vuecs.dev/guide/design-tokens)**

```bash
npm install @vuecs/design
```

```css
/* Tailwind app */
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";

/* Bootstrap or Bulma app — no Tailwind needed */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design";
@import "@vuecs/theme-bootstrap";
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
