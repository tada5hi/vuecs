# @vuecs/design

[![npm version](https://badge.fury.io/js/@vuecs%2Fdesign.svg)](https://badge.fury.io/js/@vuecs%2Fdesign)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Theme-agnostic CSS design tokens for vuecs components — concrete OKLCH defaults
matching Tailwind v4's palette, light/dark `.dark` flips, motion primitives
(vanilla-CSS port of `tw-animate-css`), and the theme-agnostic `useColorMode` /
`useColorPalette` composables. The canonical home (since plan 026) for the
palette-config type (`ColorPaletteConfig`), the catalog vocabulary
(`SEMANTIC_SCALES`, `COLOR_PALETTES`, `COLOR_PALETTE_SHADES`), and the generic
palette primitives (`applyColorPaletteCss`, `bindColorPalette<T>`,
`COLOR_PALETTE_STYLE_ELEMENT_ID`) that any theme can compose to implement
runtime palette switching via the `Theme['palette'].handle` hook.

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

/* Bootstrap or Bulma app — no Tailwind needed.
   The `/standalone` subpath additionally inlines the full Tailwind v4
   palette catalog (--color-<palette>-*, 22 palettes × 11 shades) —
   these are the source variables that runtime palette switching writes
   against. Use `useColorPalette()` from `@vuecs/design`; it dispatches
   through whichever themes the consumer installs via each theme's
   `Theme['palette'].handle` hook (theme-tailwind and theme-bulma both
   declare one today). */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bootstrap";
```

## Subpath exports

| Subpath | Bundle size | Includes |
|---|---|---|
| `@vuecs/design` (default) | ~3 KB | `--vc-color-*` semantic scales, light/dark aliases, radius, motion |
| `@vuecs/design/standalone` | ~18 KB | Default **+** full `--color-<palette>-*` catalog (22 palettes × 11 shades) |
| `@vuecs/design/palettes.css` | ~14 KB | Standalone-without-defaults — for consumers who want only the palette catalog |
| `@vuecs/design/animations.css` | ~12 KB | Motion primitives only |

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
