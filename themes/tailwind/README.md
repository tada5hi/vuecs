# @vuecs/theme-tailwind

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-tailwind.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-tailwind)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Tailwind v4 theme for vuecs components. Class-string mappings + `merge: ClassesMergeFn`
backed by `twMerge` + the Tailwind palette runtime (`setColorPalette`, `useColorPalette`,
`renderColorPaletteStyles`, `ColorPaletteConfig`). Composes `@vuecs/design`'s generic
palette primitives — re-binds `--vc-color-*` to Tailwind palette names so
runtime swaps work, exposes vuecs tokens via `@theme`, and force-includes all
22 Tailwind palettes via `@source inline()`.

For Nuxt apps, the cookie-backed `useColorPalette` ships from
[`@vuecs/nuxt`](../../packages/nuxt) — one theme-agnostic Nuxt module
handles palette switching for every theme.

Full documentation: **[vuecs.dev/themes/tailwind](https://vuecs.dev/themes/tailwind)**

```bash
npm install @vuecs/theme-tailwind @vuecs/design
npm install -D tailwindcss @tailwindcss/vite
```

```css
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";
```

Requires Tailwind CSS v4+.

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
