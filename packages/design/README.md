# @vuecs/design 🎨

[![npm version](https://badge.fury.io/js/@vuecs%2Fdesign.svg)](https://badge.fury.io/js/@vuecs%2Fdesign)

Design tokens (CSS variables) and runtime palette switcher for the vuecs
component library. Powers every theme package's color, radius, and
semantic aliases — and lets consumers reskin the whole UI by redefining
one variable set.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Tokens](#tokens)
  - [Semantic scales](#semantic-scales)
  - [Semantic aliases](#semantic-aliases)
  - [Radius](#radius)
- [Dark Mode](#dark-mode)
- [Runtime Palette Switching](#runtime-palette-switching)
- [Nuxt SSR](#nuxt-ssr)
- [Requirements](#requirements)
- [API Reference](#api-reference)
- [License](#license)

## Installation

```bash
npm install @vuecs/design
```

Requires **Tailwind CSS v4** (the tokens plug into Tailwind's `@theme`
directive). Tailwind v3 is not supported.

## Quick Start

```css
/* app.css */
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

That's it. Every vuecs theme that ships semantic Tailwind classes
(`bg-primary-600`, `text-fg`, `border-border`, …) now resolves to the
`@vuecs/design` tokens, including dark-mode flipping under `.dark`.

> The bare `@import "@vuecs/design"` form resolves to `assets/index.css`
> via the package's `style` conditional export. The explicit subpath
> `@import "@vuecs/design/index.css"` also works.

## Tokens

### Semantic scales

Six semantic scales, each covering shades 50–950:

| Scale     | Default palette | Typical uses |
|-----------|-----------------|--------------|
| `primary` | `blue`          | Main brand color, interactive accents |
| `neutral` | `neutral`       | Surfaces, text, borders — pure grayscale |
| `success` | `green`         | Confirmations, saved states |
| `warning` | `amber`         | Non-blocking cautions |
| `error`   | `red`           | Validation errors, destructive actions |
| `info`    | `sky`           | Informational banners, links |

Prefer a cool-tinted neutral? Swap it via `setPalette({ neutral: 'slate' })` (or `zinc` for subtly cool, `stone` for warm).

Access as `--vc-color-<scale>-<shade>` or the Tailwind utility
`bg-<scale>-<shade>` / `text-<scale>-<shade>` / `border-<scale>-<shade>`.

### Semantic aliases

Single-valued aliases that flip under `.dark`:

| Alias | Light | Dark | Use |
|-------|-------|------|-----|
| `--vc-color-bg`           | `white`        | `neutral-900` | Main surface background |
| `--vc-color-bg-muted`     | `neutral-50`   | `neutral-800` | Subtle backgrounds (cards, addon chips) |
| `--vc-color-bg-elevated`  | `neutral-100`  | `neutral-800` | Hover, selected list rows |
| `--vc-color-fg`           | `neutral-900`  | `neutral-200` | Primary text |
| `--vc-color-fg-muted`     | `neutral-500`  | `neutral-500` | Secondary text, placeholders |
| `--vc-color-border`       | `neutral-200`  | `neutral-800` | Form inputs, dividers |
| `--vc-color-border-muted` | `neutral-100`  | `neutral-900` | Subtle separators |
| `--vc-color-ring`         | `primary-500`  | `primary-400` | Focus rings |
| `--vc-color-on-<scale>`   | see index.css  | (same)        | Foreground color placed on a filled semantic bg |

Tailwind utilities: `bg-bg`, `bg-bg-muted`, `text-fg`, `text-fg-muted`,
`border-border`, `ring-ring`, `bg-on-primary`, etc.

### Radius

`--vc-radius-{sm,md,lg,xl,full}` — exposed as Tailwind's `rounded-{sm,md,lg,xl,full}`.

## Dark Mode

Toggle by adding `class="dark"` to `<html>` (or any ancestor). Every
semantic alias flips to its dark-mode value; everything else —
including your own component CSS that references `--vc-color-*` — comes
along for free.

No `prefers-color-scheme` media-query layer ships today; wire it up
yourself if you want one (`@media (prefers-color-scheme: dark) { :root { … } }`
or a JS boot hook).


## Runtime Palette Switching

Reassign any semantic scale to a different Tailwind palette at runtime:

```ts
import { setPalette } from '@vuecs/design';

// Switch the primary scale to green and neutral to zinc
setPalette({ primary: 'green', neutral: 'zinc' });
```

`setPalette()` inserts or updates a single `<style id="vc-palette">`
element in `<head>`. Safe to call repeatedly — subsequent calls replace
the element's content with no cascade reshuffling.

For SSR you typically want the palette to be present on first paint; see
the Nuxt integration below. If you're rolling your own SSR, use the pure
`renderPaletteStyles()` helper:

```ts
import { renderPaletteStyles, PALETTE_STYLE_ELEMENT_ID } from '@vuecs/design';

const css = renderPaletteStyles({ primary: 'green' });
// Emit into the document head:
//   <style id="vc-palette">:root { ... }</style>
```

## Nuxt SSR

Install `@vuecs/nuxt`:

```bash
npm install @vuecs/nuxt @vuecs/design
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        palette: { primary: 'green', neutral: 'zinc' },
    },
});
```

The module auto-imports `@vuecs/design`, renders the palette style block
pre-hydration (no FOUC), and exposes a `usePalette()` composable for
runtime switches:

```vue
<script setup>
const { current, setPalette } = usePalette();
</script>
```

## Requirements

- **Tailwind CSS v4+** (`index.css` relies on the `@theme` directive and
  the default `--color-<name>-<shade>` vars Tailwind v4 emits).
- **Vue 3** for the Nuxt module runtime (`@vuecs/design` itself has no Vue
  dependency on its pure helpers).

## API Reference

| Export | Description |
|--------|-------------|
| `renderPaletteStyles(palette): string` | Pure function — returns a `:root { … }` block remapping semantic scales onto Tailwind palettes |
| `setPalette(palette, doc?): void` | Client-side helper — inserts/updates `<style id="vc-palette">` in `<head>` |
| `SEMANTIC_SCALES` | `readonly SemanticScaleName[]` — all six scale names |
| `TAILWIND_PALETTES` | `readonly TailwindPaletteName[]` — all 22 Tailwind palette names |
| `PALETTE_SHADES` | `readonly string[]` — `'50' … '950'` |
| `PALETTE_STYLE_ELEMENT_ID` | DOM id used for the injected `<style>` — `'vc-palette'` |
| `PaletteConfig` | `Partial<Record<SemanticScaleName, TailwindPaletteName>>` |
| `SemanticScaleName` | `'primary' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` |
| `TailwindPaletteName` | Union of `'slate' \| 'gray' \| … \| 'rose'` (all 22 Tailwind palettes) |

## License

Made with 💚

Published under [MIT License](./LICENSE).
