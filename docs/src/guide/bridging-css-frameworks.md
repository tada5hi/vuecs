# Bridging CSS Frameworks

If you bring your own non-Tailwind framework (Bootstrap, Bulma, Foundation, UIkit, your own design system…) and want `setColorPalette()` calls to re-tint native framework components alongside vuecs ones, write a CSS-variable bridge that maps the framework's runtime tokens onto `--vc-color-*`.

The shipped `@vuecs/theme-bootstrap` and `@vuecs/theme-bulma` bridges are concrete examples — mirror that structure. The [complete `--vc-*` token reference](/guide/design-tokens#complete-css-variable-reference) is the bridging target.

## Step 1 — Identify the framework's runtime tokens

A bridge only works if the framework reads its colors from CSS variables **at runtime** (not Sass-compiled to literal hex at build time). Bootstrap 5.3+ does this via `--bs-*`; Bulma 1.0+ does it via `--bulma-*`. Older Sass-only frameworks (Bootstrap 4, Foundation 6 default builds) can't be bridged this way — the colors are baked into compiled stylesheets.

## Step 2 — Pin import order

```css
/* styles.css */
@import "<framework>";          /* defines the framework's default --x-* tokens */
@import "@vuecs/design";        /* defines --vc-color-* */
@import "<your bridge>";        /* overrides --x-* to reference --vc-color-* */
```

The bridge must come **after** both the framework and `@vuecs/design`, otherwise its rebinding loses to the framework's defaults.

## Step 3 — Map global tokens at `:root`

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

## Step 4 — Per-component overrides

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

## Step 5 — Watch out for channel-decomposition

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

## Step 6 — Ship via a `style` conditional export

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

## Shipped bridges

Two CSS-variable bridges ship in-tree as concrete worked examples of the pattern documented above:

- `@vuecs/theme-bootstrap` maps Bootstrap 5.3+'s `--bs-*` tokens onto `--vc-color-*`.
- `@vuecs/theme-bulma` maps Bulma 1.0+'s `--bulma-*` tokens onto `--vc-color-*`.

Both are reached via the bare `@import "@vuecs/theme-<name>"` form (resolves to `assets/index.css` via the `style` conditional export). Both ship with the same RGB/HSL-triplet limitation noted in step 5 above — they re-specify hover (`-700`) and active (`-800`) lightness deltas explicitly per variant, so the framework's auto-derived hover/active deltas don't apply.

## See also

- [Design Tokens](/guide/design-tokens) — the `--vc-*` token catalog this bridges against
- [Bootstrap theme](/themes/bootstrap) / [Bulma theme](/themes/bulma) — the shipped bridges in detail
- [Dark Mode](/getting-started/dark-mode) — the `.dark` flip your bridge mirrors
