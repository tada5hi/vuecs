# Design Tokens

`@vuecs/design` is the CSS-variable layer beneath the theme system. Themes resolve **class strings**; design tokens define **what those classes paint with**.

The package ships **concrete OKLCH defaults** matching Tailwind v4's palette so the visual baseline is identical with or without Tailwind. Bootstrap- and Bulma-only consumers import `@vuecs/design` standalone; Tailwind users layer `@vuecs/theme-tailwind` on top to add utility classes and runtime palette switching.

## Why a separate layer?

CSS classes can change at build time — but recoloring an entire app at runtime by swapping classes means re-rendering every component, plus hoping every consumer wrote their custom CSS to match. CSS variables are read at browser paint time, so swapping their values re-tints everything live, including consumer-authored rules and dynamic SVG `fill="currentColor"` icons.

That's why vuecs has both: themes pick the class names, tokens pick the colors.

## The token chain (top to bottom)

When `@vuecs/theme-tailwind` is loaded:

```
1. bg-primary-600          ← Tailwind v4 utility class
2. --color-primary-600     ← @theme mapping in @vuecs/theme-tailwind
3. --vc-color-primary-600  ← semantic-scale var (overridden by setColorPalette)
4. --color-blue-600        ← theme-tailwind rebind to Tailwind palette
5. oklch(...)              ← concrete OKLCH literal (Tailwind palette source)
```

When only `@vuecs/design` is loaded (BS / Bulma / no theme):

```
3. --vc-color-primary-600  ← resolves directly to the concrete OKLCH literal
5. oklch(54.6% 0.245 262.881)
```

`setColorPalette({ primary: 'green' })` (from `@vuecs/theme-tailwind`) rewrites layer 3 to point at `var(--color-green-600)`. Layers 1, 2, 4, 5 are untouched, so the rewrite is local and atomic. Without theme-tailwind loaded, `setColorPalette` is a no-op (no `--color-<palette>-*` source to point at).

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

Override defaults at runtime with `setColorPalette({ primary: 'green', neutral: 'zinc' })` from `@vuecs/theme-tailwind`. Or override statically in CSS via `:root { --vc-color-primary-500: ...; }` — that path works under any theme.

## Semantic aliases

These flip under `.dark`:

| Token | Light mode | Dark mode | Tailwind utility |
|-------|------------|-----------|------------------|
| `--vc-color-bg` | `white` | `neutral-900` | `bg-bg` |
| `--vc-color-bg-muted` | `neutral-50` | `neutral-800` | `bg-bg-muted` |
| `--vc-color-bg-elevated` | `neutral-100` | `neutral-800` | `bg-bg-elevated` |
| `--vc-color-fg` | `neutral-900` | `neutral-200` | `text-fg` |
| `--vc-color-fg-muted` | `neutral-500` | `neutral-500` | `text-fg-muted` |
| `--vc-color-border` | `neutral-200` | `neutral-800` | `border-border` |
| `--vc-color-border-muted` | `neutral-100` | `neutral-900` | `border-border-muted` |
| `--vc-color-ring` | `primary-500` | `primary-400` | `ring-ring` |

The `on-*` tokens are the contrasting foreground when a filled semantic background is in use. `--vc-color-on-warning` is the only one that flips (warning fills are light, so the text needs a darker tone in light mode).

| Token | Light mode | Dark mode |
|-------|------------|-----------|
| `--vc-color-on-primary` | `white` | `white` |
| `--vc-color-on-neutral` | `white` | `white` |
| `--vc-color-on-success` | `white` | `white` |
| `--vc-color-on-warning` | `neutral-900` | `neutral-950` |
| `--vc-color-on-error` | `white` | `white` |
| `--vc-color-on-info` | `white` | `white` |

## Radius

```css
--vc-radius-sm:   0.125rem; /* 2px  */
--vc-radius-md:   0.375rem; /* 6px  */
--vc-radius-lg:   0.5rem;   /* 8px  */
--vc-radius-xl:   0.75rem;  /* 12px */
--vc-radius-full: 9999px;
```

Available as Tailwind utilities `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`.

## Complete CSS variable reference

Every `--vc-*` token shipped by `@vuecs/design`. Use this as the bridging target when wiring a non-Tailwind CSS framework against the design system.

<details>
<summary>Color scales — 66 tokens (6 scales × 11 shades)</summary>

Each scale ships shades `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. The `:root` block in `@vuecs/design/assets/index.css` binds each shade to a Tailwind palette by default (overridable via `setColorPalette()`):

| Scale | Token shape | Default Tailwind palette |
|-------|-------------|--------------------------|
| `primary` | `--vc-color-primary-{50…950}` | `blue` |
| `neutral` | `--vc-color-neutral-{50…950}` | `neutral` |
| `success` | `--vc-color-success-{50…950}` | `green` |
| `warning` | `--vc-color-warning-{50…950}` | `amber` |
| `error` | `--vc-color-error-{50…950}` | `red` |
| `info` | `--vc-color-info-{50…950}` | `sky` |

Examples:

```css
--vc-color-primary-50    /* lightest tint — bg for soft variants */
--vc-color-primary-100   /* */
--vc-color-primary-200   /* */
--vc-color-primary-300   /* */
--vc-color-primary-400   /* dark-mode primary */
--vc-color-primary-500   /* default ring color, hover seed */
--vc-color-primary-600   /* default solid bg */
--vc-color-primary-700   /* hover/active bg, soft-variant text */
--vc-color-primary-800   /* */
--vc-color-primary-900   /* */
--vc-color-primary-950   /* darkest shade */
```

Same shape for the other five scales. Override an entire scale at runtime via `setColorPalette({ primary: 'green' })`.
</details>

<details>
<summary>Semantic aliases — flip under `.dark`</summary>

```css
/* Backgrounds */
--vc-color-bg            /* page/card background */
--vc-color-bg-muted      /* slightly recessed */
--vc-color-bg-elevated   /* slightly raised */

/* Foregrounds */
--vc-color-fg            /* primary text */
--vc-color-fg-muted      /* secondary text */

/* Borders */
--vc-color-border        /* default */
--vc-color-border-muted  /* subtle */

/* Focus ring */
--vc-color-ring
```

See the table above for the per-mode resolved values.
</details>

<details>
<summary>`on-*` foreground tokens (for placement on filled semantic backgrounds)</summary>

```css
--vc-color-on-primary
--vc-color-on-neutral
--vc-color-on-success
--vc-color-on-warning  /* flips: dark text in light mode, darker text in dark mode */
--vc-color-on-error
--vc-color-on-info
```

Use these on text/icon elements that sit on top of a filled semantic background — e.g. the label of a `bg-primary-600` button.
</details>

<details>
<summary>Radius</summary>

```css
--vc-radius-sm:   0.125rem; /* 2px  */
--vc-radius-md:   0.375rem; /* 6px  */
--vc-radius-lg:   0.5rem;   /* 8px  */
--vc-radius-xl:   0.75rem;  /* 12px */
--vc-radius-full: 9999px;
```

These do not flip with dark mode. Override at the `:root` level if you want different values across the whole app.
</details>

## Bridging another CSS framework

If you bring your own non-Tailwind framework (Bootstrap, Bulma, Foundation, UIkit, your own design system…) and want `setColorPalette()` calls to re-tint native framework components alongside vuecs ones, write a CSS-variable bridge that maps the framework's runtime tokens onto `--vc-color-*`.

The shipped `@vuecs/theme-bootstrap` and `@vuecs/theme-bulma` bridges are concrete examples — mirror that structure.

### Step 1 — Identify the framework's runtime tokens

A bridge only works if the framework reads its colors from CSS variables **at runtime** (not Sass-compiled to literal hex at build time). Bootstrap 5.3+ does this via `--bs-*`; Bulma 1.0+ does it via `--bulma-*`. Older Sass-only frameworks (Bootstrap 4, Foundation 6 default builds) can't be bridged this way — the colors are baked into compiled stylesheets.

### Step 2 — Pin import order

```css
/* styles.css */
@import "<framework>";          /* defines the framework's default --x-* tokens */
@import "@vuecs/design";        /* defines --vc-color-* */
@import "<your bridge>";        /* overrides --x-* to reference --vc-color-* */
```

The bridge must come **after** both the framework and `@vuecs/design`, otherwise its rebinding loses to the framework's defaults.

### Step 3 — Map global tokens at `:root`

Most frameworks expose top-level color variables for the canonical semantic colors. Map each one to the matching `--vc-color-*` shade:

```css
:root {
    --x-primary: var(--vc-color-primary-500);
    --x-success: var(--vc-color-success-500);
    --x-warning: var(--vc-color-warning-500);
    --x-danger:  var(--vc-color-error-500);
    --x-info:    var(--vc-color-info-500);

    --x-body-bg:    var(--vc-color-bg);
    --x-body-color: var(--vc-color-fg);
    --x-border:     var(--vc-color-border);
}
```

Then mirror the dark-mode variant under `.dark`, bumping the shade up one tier (e.g. `-500` → `-400`) so the brand colors stay legible on dark backgrounds:

```css
.dark {
    --x-primary: var(--vc-color-primary-400);
    --x-success: var(--vc-color-success-400);
    /* … */
}
```

The `--vc-color-bg`/`--vc-color-fg`/`--vc-color-border` tokens already flip via `@vuecs/design`, so you don't need to redeclare those in `.dark` — your `:root` rebinding tracks them automatically.

### Step 4 — Per-component overrides

Many frameworks redeclare their semantic colors **inside per-variant component blocks** (e.g. Bootstrap's `.btn-primary { --bs-btn-bg: …; --bs-btn-hover-bg: … }`). Overriding `--bs-primary` alone doesn't reach those — you need to redeclare the per-component chain too:

```css
.x-btn-primary {
    --x-btn-bg:           var(--vc-color-primary-600);
    --x-btn-border-color: var(--vc-color-primary-600);
    --x-btn-hover-bg:     var(--vc-color-primary-700);
    /* ... */
}
```

Repeat per `(component, variant)` cell. The Bootstrap bridge does this for `.btn-*`, `.btn-outline-*`, `.alert-*`, `.bg-*`, `.text-*`, `.border-*`, `.text-bg-*`, and `.bg-*-subtle` / `.text-*-emphasis` pairs.

### Step 5 — Watch out for channel-decomposition

Most frameworks decompose colors into per-channel variables for hover/active state math, and routing the resolved color through those channels means the named `--<framework>-X-background-color` token is **never read**:

- Bootstrap derives focus-ring translucency via `rgba(var(--bs-primary-rgb), 0.5)` — the RGB triplet, not `--bs-primary` itself.
- Bulma 1.0 sets `.button.is-primary { --bulma-button-h: var(--bulma-primary-h); }` and resolves the bg via `hsl(var(--bulma-button-h), …)` — entirely bypassing `--bulma-button-background-color`.

Pure CSS cannot decompose a hex token into RGB or HSL channels, so per-component named-color overrides are **no-ops** for HSL/channel-driven frameworks like Bulma. Two workable mitigations:

- **Direct property override (preferred).** Skip the named `--<framework>-X-background-color` token and override the **resolved** properties directly on each per-variant selector:

  ```css
  .button.is-primary {
      background-color: var(--vc-color-primary-600);
      border-color: var(--vc-color-primary-600);
      color: var(--vc-color-on-primary);
  }
  .button.is-primary:hover {
      background-color: var(--vc-color-primary-700);
  }
  ```

  Specificity (0,2,0) beats the framework's base rule (0,1,0); no `!important` needed. Trade-off: framework auto-computed hover/active deltas are short-circuited; re-specify them explicitly with `-700` / `-800` shades. The Bulma bridge ships with this approach.

- **JS palette-change hook.** Decompose the active hex into channels in JS (read shade → compute H/S/L or RGB) and write `--<framework>-primary-h/s/l` (or `-rgb`) back to the DOM. Most flexible — preserves auto-derived hover deltas — but adds runtime complexity and can't run during SSR. None of the shipped bridges include this today.

Document whichever you pick in your bridge file's header so consumers know how to extend it.

### Step 6 — Ship via a `style` conditional export

Add the bridge file's path to your package's `package.json` under the `style` conditional export so consumers can write a bare `@import "@vuecs/theme-<framework>"`:

```json
{
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "style": "./assets/index.css",
            "import": "./dist/index.mjs"
        },
        "./index.css": "./assets/index.css",
        "./assets/index.css": "./assets/index.css"
    },
    "style": "./assets/index.css"
}
```

The top-level `style` field is for older bundlers that don't read conditional exports; both forms point at the same file.

## Runtime palette switching

`setColorPalette` lives in `@vuecs/theme-tailwind` (it's specific to the Tailwind catalog of 22 named palettes):

```ts
import { setColorPalette } from '@vuecs/theme-tailwind';

setColorPalette({ primary: 'green', neutral: 'zinc' });
```

Inserts or updates a `<style id="vc-color-palette">` element in `<head>`. Idempotent — calling it again replaces the previous block.

For SSR (Nuxt), install `@vuecs/nuxt` — its theme-agnostic SSR plugin walks every installed theme's `palette.handle` hook via `renderColorPaletteFromThemes()` to emit the same `<style>` block into the head before first paint. No per-theme Nuxt module needed.

### Custom palette catalogs

If you ship your own theme with a different palette catalog (corporate fork with `--color-acme-*` tokens, Material-You-style theme, etc.), compose the **generic primitives** in `@vuecs/design`:

```ts
import { applyColorPaletteCss, bindColorPalette } from '@vuecs/design';

type AcmePalette = { primary?: 'acme-blue' | 'acme-orange' };

const renderAcme = (p: AcmePalette): string => {
    if (!p.primary) return '';
    return `:root { --vc-color-primary-500: var(--color-${p.primary}-500); /* … */ }`;
};

// One-shot apply
const setAcmePalette = (p: AcmePalette) => applyColorPaletteCss(renderAcme(p));

// Reactive composable (pair with useStorage / useCookie)
import { ref } from 'vue';
const source = ref<AcmePalette>({ primary: 'acme-blue' });
const { current, set, extend } = bindColorPalette(source, {
    render: renderAcme,
    extend: (current, partial) => ({ ...current, ...partial }),
});
```

`@vuecs/theme-tailwind`'s `setColorPalette` is built this way — `setColorPalette = applyColorPaletteCss(renderColorPaletteStyles(...))`. `useColorPalette` itself lives in `@vuecs/design`; it walks installed themes' `palette.handle` hooks via `renderColorPaletteFromThemes()` and feeds the concatenated CSS into `applyColorPaletteCss`. The Tailwind theme just declares its `palette.handle` (the `renderColorPaletteStyles` function above) at the theme level — no per-theme composable wrapper.

## Circular reference caveat

Tailwind utilities like `bg-neutral-500` use **Tailwind's** default `--color-neutral-*` palette, **not** the vuecs `--vc-color-neutral-*` palette. This is intentional: rebinding `--color-neutral-*` to `var(--vc-color-neutral-*)` would create a circular reference (since `--vc-color-neutral-*` is bound to `var(--color-neutral-*)` to follow Tailwind's neutral by default), invalidating the entire chain.

**Practical implication:** use `bg-bg`, `text-fg`, `border-border` (semantic aliases — they DO follow `setColorPalette({ neutral: ... })`) instead of `bg-neutral-100`, `text-neutral-900`, `border-neutral-200` (raw Tailwind, doesn't follow palette).

## Shipped bridges

Two CSS-variable bridges ship in-tree as concrete worked examples of the pattern documented in [Bridging another CSS framework](#bridging-another-css-framework):

- `@vuecs/theme-bootstrap` maps Bootstrap 5.3+'s `--bs-*` tokens onto `--vc-color-*`.
- `@vuecs/theme-bulma` maps Bulma 1.0+'s `--bulma-*` tokens onto `--vc-color-*`.

Both are reached via the bare `@import "@vuecs/theme-<name>"` form (resolves to `assets/index.css` via the `style` conditional export). Both ship with the same RGB/HSL-triplet limitation noted in step 5 above — they re-specify hover (`-700`) and active (`-800`) lightness deltas explicitly per variant, so the framework's auto-derived hover/active deltas don't apply.

## Pure / SSR-safe APIs

**`@vuecs/design` (theme-agnostic):**

| Export | Pure | Notes |
|--------|------|-------|
| `applyColorPaletteCss(css, doc?, nonce?)` | ❌ | DOM-only; upserts `<style id="vc-color-palette">` |
| `bindColorPalette<T>(source, render)` | ❌ | Vue reactive — apply on init + watch source |
| `useColorPalette(options?)` | ❌ | Theme-aware shared composable — dispatches through installed themes' `palette.handle` |
| `useColorPaletteUnshared(options?)` | ❌ | Un-shared variant (one watcher per call) — accepts a custom `source` ref for SSR-aware persistence |
| `COLOR_PALETTE_STYLE_ELEMENT_ID` | const | `'vc-color-palette'` |
| `SEMANTIC_SCALES` / `SemanticScaleName` | const + type | The 6 semantic scale names |
| `COLOR_PALETTES` / `ColorPaletteName` | const + type | The 22 catalog palette names (sourced from Tailwind v4) |
| `COLOR_PALETTE_SHADES` / `ColorPaletteShade` | const + type | The 11-stop shade ladder |
| `ColorPaletteConfig` | type | `Partial<Record<SemanticScaleName, ColorPaletteName>>` — the canonical runtime palette config |

**`@vuecs/theme-tailwind` (Tailwind-specific):**

| Export | Pure | Notes |
|--------|------|-------|
| `renderColorPaletteStyles(palette)` | ✅ | Returns `:root { ... }` block as a string |
| `setColorPalette(palette, doc?, nonce?)` | ❌ | DOM-only; idempotent. Composes `applyColorPaletteCss(renderColorPaletteStyles(palette))` |

## Vue composables

`@vuecs/design` ships theme-aware `useColorPalette()` and `useColorMode()`. The palette composable dispatches through whichever themes the app installs — Tailwind, Bulma, and any future palette-aware theme — so the same import works regardless of theme. See [Composables](/guide/composables) for persistence details.

## See also

- [Dark Mode](/getting-started/dark-mode) — `.dark` flip mechanics
- [Theme System](/guide/theme-system) — what consumes the tokens
- [Nuxt module](/nuxt/) — SSR-safe palette switching
