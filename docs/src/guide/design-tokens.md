# Design Tokens

`@vuecs/design` is the CSS-variable layer beneath the theme system. Themes resolve **class strings**; design tokens define **what those classes paint with**.

## Why a separate layer?

CSS classes can change at build time — but recoloring an entire app at runtime by swapping classes means re-rendering every component, plus hoping every consumer wrote their custom CSS to match. CSS variables are read at browser paint time, so swapping their values re-tints everything live, including consumer-authored rules and dynamic SVG `fill="currentColor"` icons.

That's why vuecs has both: themes pick the class names, tokens pick the colors.

## The token chain (top to bottom)

```
1. bg-primary-600          ← Tailwind v4 utility class
2. --color-primary-600     ← @theme mapping in @vuecs/design
3. --vc-color-primary-600  ← semantic-scale var (overridden by setPalette)
4. --color-blue-600        ← Tailwind's built-in palette
5. concrete hex            ← shipped by Tailwind
```

`setPalette({ primary: 'green' })` rewrites layer 3 to point at `var(--color-green-600)`. Layers 1, 2, 4, 5 are untouched, so the rewrite is local and atomic.

## Semantic scales

Six scales, each with shades 50–950:

| Scale | Default palette | Usage |
|-------|------------------|-------|
| `primary` | `blue` | Brand color, primary CTAs |
| `neutral` | `neutral` | Backgrounds, borders, text |
| `success` | `green` | Success states, valid inputs |
| `warning` | `amber` | Warnings, caution |
| `error` | `red` | Errors, destructive actions |
| `info` | `sky` | Informational, links |

Override defaults at runtime with `setPalette({ primary: 'green', neutral: 'zinc' })`.

## Semantic aliases

These flip under `.dark`:

```css
--vc-color-bg            /* page/card background */
--vc-color-bg-muted      /* slightly recessed */
--vc-color-bg-elevated   /* slightly raised */
--vc-color-fg            /* primary text */
--vc-color-fg-muted      /* secondary text */
--vc-color-border        /* default border */
--vc-color-border-muted  /* subtle border */
--vc-color-ring          /* focus ring */

--vc-color-on-primary    /* foreground on filled primary bg */
--vc-color-on-success    /* etc. */
```

In Tailwind utilities: `bg-bg`, `text-fg`, `border-border`, `ring-ring`, `text-on-primary`. These are exposed via the `@theme` block in `@vuecs/design`.

## Radius

```css
--vc-radius-sm:   0.125rem;
--vc-radius-md:   0.375rem;
--vc-radius-lg:   0.5rem;
--vc-radius-xl:   0.75rem;
--vc-radius-full: 9999px;
```

Available as Tailwind utilities `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`.

## Runtime palette switching

```ts
import { setPalette } from '@vuecs/design';

setPalette({ primary: 'green', neutral: 'zinc' });
```

Inserts or updates a `<style id="vc-palette">` element in `<head>`. Idempotent — calling it again replaces the previous block.

For SSR (Nuxt), use `renderPaletteStyles(palette)` — pure function returning a CSS string. The Nuxt module emits this into the head before first paint.

## Circular reference caveat

Tailwind utilities like `bg-neutral-500` use **Tailwind's** default `--color-neutral-*` palette, **not** the vuecs `--vc-color-neutral-*` palette. This is intentional: rebinding `--color-neutral-*` to `var(--vc-color-neutral-*)` would create a circular reference (since `--vc-color-neutral-*` is bound to `var(--color-neutral-*)` to follow Tailwind's neutral by default), invalidating the entire chain.

**Practical implication:** use `bg-bg`, `text-fg`, `border-border` (semantic aliases — they DO follow `setPalette({ neutral: ... })`) instead of `bg-neutral-100`, `text-neutral-900`, `border-neutral-200` (raw Tailwind, doesn't follow palette).

## Bootstrap bridges

For Bootstrap consumers, `@vuecs/theme-bootstrap-v5` ships a design-token bridge (`assets/index.css`) that maps `--bs-*` theme vars onto `--vc-color-*`:

```css
@import "@vuecs/theme-bootstrap-v5";  /* via the `style` conditional export */
```

Bootstrap 5 components read `--bs-*` at runtime, so the bridge propagates `setPalette()` to Bootstrap components. Bootstrap 4's bridge is shipped for API parity but has limited reach — Bootstrap 4's component CSS is Sass-compiled to literal hex, so the bridge only affects consumer-authored rules.

## Pure / SSR-safe APIs

| Export | Pure | Notes |
|--------|------|-------|
| `renderPaletteStyles(palette)` | ✅ | Returns `:root { ... }` block as a string |
| `setPalette(palette, doc?)` | ❌ | DOM-only; idempotent |
| `PaletteConfig` | type | `Partial<Record<SemanticScaleName, TailwindPaletteName>>` |
| `SEMANTIC_SCALES` | const | Array of the 6 scale names |
| `TAILWIND_PALETTES` | const | Array of all 22 Tailwind palette names |

## See also

- [Dark Mode](/getting-started/dark-mode) — `.dark` flip mechanics
- [Theme System](/guide/theme-system) — what consumes the tokens
- [Nuxt module](/nuxt/) — SSR-safe palette switching
