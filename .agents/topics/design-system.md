# Design System

Sits beside — not inside — the theme system. Themes resolve **CSS class
strings**; the design-system layer defines the **actual colors, radii and
other design primitives** those classes reference via CSS variables. This
lets a single set of tokens drive every theme package and enables runtime
palette switching without re-resolving theme classes.

The system splits across packages by concern:

- **`@vuecs/design`** — `--vc-color-<scale>-*` semantic defaults
  referencing the Tailwind palette catalog (primary→blue, neutral→
  neutral, success→green, warning→amber, error→red, info→sky),
  light/dark `.dark` flips, radius tokens, motion primitives, and
  theme-agnostic helpers. The right-hand `--color-<palette>-*` source
  comes from EITHER Tailwind (`@import "tailwindcss"`) OR
  `@vuecs/design/standalone` — single-source for the OKLCH literals,
  no duplication between design and theme-tailwind. JS surface:
  - `useColorMode` / `bindColorMode` — light/dark/system mode
  - `applyColorPaletteCss(css, doc?)` — DOM upsert for the
    `<style id="vc-color-palette">` block
  - `bindColorPalette<T>(source, render): UseColorPaletteReturn<T>` — generic
    reactive wiring for any theme's palette config
  - `COLOR_PALETTE_STYLE_ELEMENT_ID` — DOM id constant

  Tailwind-free path supported via `@vuecs/design/standalone` — works with BS / Bulma without requiring Tailwind v4.
- **`@vuecs/theme-tailwind`** — exposes vuecs tokens as Tailwind names
  via an `@theme` block (`bg-primary-600`, `text-fg`, …), force-includes
  all 22 catalog palettes via `@source inline()`, and ships the
  Tailwind-specific palette runtime (`setColorPalette`, `useColorPalette`,
  `renderColorPaletteStyles`, and the `ColorPaletteConfig` value-shape
  type). The catalog vocabulary itself — `SEMANTIC_SCALES`,
  `COLOR_PALETTES`, `COLOR_PALETTE_SHADES` and their companion types —
  lives in `@vuecs/design` and is imported here, not redeclared.
  Composes design's generic helpers (`applyColorPaletteCss`,
  `bindColorPalette<ColorPaletteConfig>`) rather than reimplementing
  them. The `--vc-color-<scale>-*: var(--color-<palette>-*)` rebind
  lives in `@vuecs/design/assets/index.css` (single source of truth). Required only when consumers want Tailwind
  utility classes AND/OR Tailwind-catalog palette switching.
  Nuxt integration for palette switching is handled by `@vuecs/nuxt`
  itself. The SSR plugin walks installed
  themes' `palette.handle` hooks; the auto-imported `useColorPalette()`
  composable is cookie-backed and shape-identical to the SPA variant.

Future themes with their own palette catalogs (corporate fork,
community preset, Material-You-style theme) compose design's generic
helpers directly:

```ts
import { applyColorPaletteCss, bindColorPalette } from '@vuecs/design';

type AcmePalette = { primary?: 'acme-blue' | 'acme-orange'; ... };
const renderAcme = (p: AcmePalette) => /* emit --vc-color-* CSS */;
const setAcmePalette = (p: AcmePalette) => applyColorPaletteCss(renderAcme(p));
const useAcmePalette = (src: Ref<AcmePalette>) => bindColorPalette(src, renderAcme);
```

### Layers, top-down

When `@vuecs/theme-tailwind` is loaded:

```text
1. bg-primary-600          ← Tailwind v4 utility class
2. --color-primary-600     ← @theme mapping in theme-tailwind/assets/index.css
3. --vc-color-primary-600  ← semantic-scale var (overridden by setColorPalette)
4. --color-blue-600        ← design/assets/index.css references the palette catalog
5. oklch(...)              ← concrete OKLCH literal (Tailwind palette source)
```

When `@vuecs/design/standalone` is loaded (BS / Bulma):

```text
3. --vc-color-primary-600  ← design/assets/index.css
4. --color-blue-600        ← design/assets/index.css references the palette catalog
5. oklch(54.6% 0.245 262.881)  ← design/assets/palettes.css supplies the literal
```

`.dark` flips the semantic aliases (`--vc-color-bg`, `--vc-color-fg`,
`--vc-color-border`, `--vc-color-ring`) only — scales stay the same.
`setColorPalette({ primary: 'green' })` rewrites layer 3 to `var(--color-green-600)`
via a `<style id="vc-color-palette">` block, leaving layers 1-2 and 4-5 untouched.
`setColorPalette` is a no-op when `@vuecs/theme-tailwind` isn't loaded (no
`--color-<palette>-*` source to point at).

### Package layout

```
@vuecs/design/
  assets/index.css       <- :root (concrete OKLCH defaults) + .dark + @import "./animations.css"
                            `:root` + `.dark` blocks are wrapped in `@layer vuecs`
                            (#1595) so consumer overrides placed inside any other
                            cascade layer win without `!important`. animations.css
                            stays unlayered (structural CSS rule); palettes.css too.
  assets/animations.css  <- Motion primitives — vanilla-CSS port of tw-animate-css (MIT, attributed in header)
  src/
    core/
      color-mode/
        catalog.ts               <- COLOR_MODES tuple, derived ColorMode, isColorMode() guard (#1701)
        bind.ts                  <- bindColorMode(ref, opts)
        composable.ts            <- useColorMode(opts) — localStorage-backed, guard-sanitized
        types.ts                 <- UseColorModeOptions / UseColorModeReturn
      color-palette/
        catalog.ts               <- SEMANTIC_SCALES, COLOR_PALETTES, COLOR_PALETTE_SHADES, ColorPaletteConfig
        apply.ts                 <- applyColorPaletteCss(), COLOR_PALETTE_STYLE_ELEMENT_ID
        bind.ts                  <- bindColorPalette<T>()
        composable.ts            <- useColorPalette() / useColorPaletteUnshared()
        presets.ts render.ts types.ts
      theme-runtime/             <- useThemeRuntimeManager(), captureColorModeAttrs(),
                                    renderColorPaletteFromThemes() (SSR dispatch)
    index.ts                     <- top-level barrel (re-exports every core sub-area, flat)

@vuecs/theme-tailwind/
  assets/index.css       <- @theme { --color-primary-*: var(--vc-color-primary-*) }
                             + @source inline("bg-{...}-{...}") safelist
  src/
    types.ts             <- deprecated `ColorPaletteConfig` re-export from @vuecs/design
    palette.ts           <- renderColorPaletteStyles() (pure), setColorPalette() (composes applyColorPaletteCss)
                          consumers import useColorPalette from @vuecs/design
    config.ts            <- Config['nonce'] augmentation (CSP nonce for setColorPalette's <style>)
    index.ts             <- top-level barrel + tailwindTheme() default export
                             (re-exports applyColorPaletteCss / bindColorPalette / COLOR_PALETTE_STYLE_ELEMENT_ID
                              from @vuecs/design for backward compat)

```

### Motion primitives (animations.css)

A vanilla-CSS port of [`tw-animate-css`](https://github.com/Wombosvideo/tw-animate-css)
v1.4.0 (MIT). Auto-imported by `assets/index.css` so the bare
`@import "@vuecs/design"` brings tokens AND motion in one go. Subpath
exports `@vuecs/design/animations.css` (motion only) and
`@vuecs/design/index.css` (= bare import) are also available.

**Why a port instead of a runtime dep:** `tw-animate-css` ships its
classes as Tailwind v4 `@utility` / `@theme inline` directives — they
only compile inside Tailwind. Bootstrap-themed (or theme-less) consumers
can't use it. The vanilla rewrite uses the same class names so any theme
can reference them. Tailwind users keep using `data-[state=open]:fade-in-0
zoom-in-95` (Tailwind's `data-[state=]:` variant prefix points at the
same vanilla CSS classes); Bootstrap users get them via unconditional
class application in their theme entries.

**Class catalog:** `animate-in` / `animate-out` (master triggers),
`fade-{in,out}-{0,25,50,75,90,95,100}`, `zoom-{in,out}-{0,50,75,90,95,100,105,110,125,150}`,
`slide-{in-from,out-to}-{top,bottom,left,right,start,end}` (with size stops),
`spin-{in,out}` ± negatives, `blur-{in,out}` (sm/md/lg/xl/2xl/3xl),
`accordion-{down,up}`, `collapsible-{down,up}`, `caret-blink`,
`duration-*`, `delay-*`, `repeat-*`, `direction-*`, `fill-mode-*`,
`running`, `paused`. Plus a `prefers-reduced-motion: reduce` block that
disables every animation.

**Maintenance:** when tw-animate-css adds new animations upstream, port
them here using the same naming and bump the version comment in the file
header.

**Reka Presence handles unmount delay automatically.** All five Reka
overlay `*Content` primitives (DialogContent, PopoverContent,
TooltipContent, MenuContent — used by both DropdownMenu and ContextMenu)
already wrap themselves in Reka's `Presence` component internally:
`Presence` reads the element's computed `animation-name` when
`data-state` flips, suspends unmount until `animationend`, and then
removes the element. So consumers don't need to wire Presence themselves
for exit animations to play — the theme's exit-state classes (`animate-out`
+ `fade-out-0` etc. for theme-tailwind, or the `vc-overlay-anim` /
`vc-overlay-fade-anim` / `vc-tooltip-anim` dual-state helpers for
theme-bootstrap) just need to be in place. `<VCPresence>` is still
exported for ad-hoc use (e.g. animating a custom panel that isn't a Reka
overlay), but isn't required for the shipped overlay families.

**Vuecs dual-state helper classes** (`vc-overlay-anim`,
`vc-overlay-fade-anim`, `vc-tooltip-anim`) live in `animations.css`
alongside the tw-animate-css port. They package `data-state`-gated
enter+exit animations into a single class so theme strings without
attribute-selector capability (theme-bootstrap, custom CSS-only themes)
can drive overlay animations. theme-tailwind keeps using the more
flexible `data-[state=open]:animate-in fade-in-0 zoom-in-95
data-[state=closed]:animate-out fade-out-0 zoom-out-95` composition.

### Key exports

**`@vuecs/design` (theme-agnostic):**
- **`applyColorPaletteCss(css: string, doc?: Document, nonce?: string)`** — DOM helper. Inserts or updates a `<style id="vc-color-palette">` element in `<head>` with the given CSS string. Theme-agnostic; accepts whatever the caller wants to render.
- **`bindColorPalette<T>(source: Ref<T>, render: (T) => string): UseColorPaletteReturn<T>`** — generic reactive wiring. Apply on init, re-apply on watch. Themes compose this with their own renderer.
- **`COLOR_PALETTE_STYLE_ELEMENT_ID`** — constant `'vc-color-palette'`. SSR plugins emit a matching id so client hydration replaces atomically.
- **`SEMANTIC_SCALES` / `SemanticScaleName`** — the six semantic scale names (`primary`, `neutral`, `success`, `warning`, `error`, `info`) that `--vc-color-<scale>-*` is keyed on. Themes import these — they're not redeclared per-theme.
- **`COLOR_PALETTES` / `ColorPaletteName`** — the 22 catalog palette names (sourced from Tailwind v4). Both supported palette sources — `@import "tailwindcss"` AND `@vuecs/design/standalone` — define `--color-<palette>-*` for each one, so `setColorPalette()` resolves regardless of whether Tailwind is loaded.
- **`COLOR_PALETTE_SHADES` / `ColorPaletteShade`** — the 11-stop shade ladder (`'50' | '100' | … | '950'`).
- **`ColorPaletteConfig`** — `Partial<Record<SemanticScaleName, ColorPaletteName>>`. Canonical palette-config type; both keys come from this package's catalog.
- **`useColorPalette(options?)`** — theme-aware reactive palette state with localStorage persistence. Wrapped via `createSharedComposable`, so every call site shares the same ref + watcher. Walks installed themes' `palette.handle` hooks and concatenates the rendered CSS into the `<style id="vc-color-palette">` block. Default sanitizer filters input to the canonical catalog; default `extend` is shallow merge. CSP-strict consumers pass `nonce: () => useConfig('nonce').value` explicitly (no auto-wiring — see [Nuxt SSR dispatch](locale.md) and the deprecation note on theme `useColorPalette` re-exports below).
- **`useColorPaletteUnshared(options?)`** — un-shared variant. Same surface; one watcher per call. Accepts a custom `source: Ref<T>` for SSR-aware persistence (Nuxt cookie, IndexedDB, etc.). Used internally by `@vuecs/nuxt`'s cookie-backed wrapper.
- **`useColorMode(options?)`** — reactive light/dark/system mode with localStorage persistence + `<html>` class sync. Returns `{ mode, resolved, isDark, toggle }`. Uses `usePreferredDark` from VueUse to resolve `'system'`.
- **`bindColorMode(source: Ref<ColorMode>, options?)`** — building block; same pattern as `bindColorPalette`.
- **`COLOR_MODES` / `ColorMode` / `isColorMode(value)`** — the color-mode vocabulary, in `core/color-mode/catalog.ts` (same tuple-is-the-source-of-truth shape as `color-palette/catalog.ts`: `ColorMode` is *derived* via `typeof COLOR_MODES[number]`, so the union and the runtime list can't drift). `isColorMode` takes `unknown` so consumers can point it straight at untrusted persisted state — the required narrowing step for any `Ref<string>`-backed source before it satisfies `bindColorMode`. `useColorMode`'s `useStorage` serializer and `@vuecs/nuxt`'s cookie-backed `useColorMode` both run it, degrading an invalid stored value to the configured initial rather than round-tripping it onto the `<html>` class (issue #1701).

**`@vuecs/theme-tailwind` (Tailwind-specific palette + class strings):**
- **`renderColorPaletteStyles(palette): string`** — pure function. Returns a `:root { … }` block that remaps `--vc-color-<scale>-*` onto `var(--color-<palette>-*)` for every scale set in `palette`. Safe on server and client.
- **`setColorPalette(palette, doc?, nonce?)`** — one-line composition: `applyColorPaletteCss(renderColorPaletteStyles(palette), doc, nonce)`.
- ⚠ **`useColorPalette` (deprecated)** — re-exports from `@vuecs/design` for backwards compat. Import from `@vuecs/design` and pass `nonce` explicitly when needed.
- **`ColorPaletteConfig` (deprecated re-export)** — re-exports the canonical type from `@vuecs/design`. Will be removed in the next major.
- Also re-exports `applyColorPaletteCss` / `bindColorPalette` / `COLOR_PALETTE_STYLE_ELEMENT_ID` from `@vuecs/design` for backward compat with code that picked them up from theme-tailwind in earlier versions.

**`@vuecs/nuxt` (theme-agnostic Nuxt integration):**
- **`useColorPalette()`** — auto-imported in Nuxt apps. Cookie-backed (SSR-safe) variant; same `{ current, set, extend }` shape as the SPA `useColorPalette` from `@vuecs/design`. Composes the generic `useColorPaletteUnshared` from `@vuecs/design` with a cookie-backed `Ref<T>` passed as `source`. Dispatches through whichever themes the consumer installs — Tailwind, Bulma, and any future palette-aware theme all share the same composable.
- **`useColorMode()`** — auto-imported. SSR-safe color-mode composable backed by a Nuxt cookie. Reads the cookie name + initial value from `runtimeConfig.public.vuecs.colorMode`.

All packages require **Vue 3** as a peer dep. `@vuecs/design` and `@vuecs/theme-tailwind` additionally require **`@vueuse/core`**. The composables sub-area is intentionally kept on each package's root export (no subpath) — flat surface area matches `@vuecs/core`'s convention.

### Requirements

- **Tailwind CSS v4+** — required only if consumers import `@vuecs/theme-tailwind` (utility classes) or use `setColorPalette()` / `useColorPalette()`. BS-only / Bulma-only consumers can ship without Tailwind.
- **Dark mode toggle via `.dark` class.** Consumers wire this however they prefer (`@vuecs/design`'s `useColorMode`, Nuxt's `@nuxtjs/color-mode`, a Pinia store, vanilla JS). No `prefers-color-scheme` media query layer ships today.

### Runtime palette safelist

`@vuecs/theme-tailwind`'s `assets/index.css` ends with:

```css
@source inline("bg-{red,orange,...,neutral}-{50,100,...,950}");
```

This force-includes all 22 Tailwind palettes × 11 shades in the JIT output. Without it, Tailwind v4 only emits `--color-<palette>-*` tokens for palettes referenced by used utility classes — so `setColorPalette({ primary: 'emerald' })` would silently fail because `--color-emerald-*` is absent from the generated CSS.

The directive depends on Tailwind v4's documented behavior of emitting `--color-<palette>-<shade>` as a side effect of safelisting `bg-<palette>-<shade>`. If a future Tailwind major changes how palette emission works, this directive needs to update too. See the inline comment in `themes/tailwind/assets/index.css` for the full rationale.

### Nuxt integration

One theme-agnostic Nuxt module (`@vuecs/nuxt`) handles both color-mode
and palette runtime through `palette.handle` / `colorMode.handle` hooks, regardless of the installed theme.

```text
@vuecs/nuxt/                                    (theme-agnostic)
  src/
    module.ts                                  <- defineNuxtModule (configKey: 'vuecs')
                                                  Options: injectTokens, colorMode, colorPalette,
                                                           cookie, paletteCookie, themes
                                                  Auto-imports @vuecs/design/index.css
                                                  Generates a `vuecs-themes` plugin when
                                                  `themes: string[]` is set (auto-loads listed
                                                  theme packages via no-arg default factories)
    runtime/
      plugins/colorMode.server.ts              <- emits class="dark"|"light" + per-theme
                                                  data-* attrs via captureColorModeAttrs
      plugins/colorPalette.server.ts           <- emits <style id="vc-color-palette"> via
                                                  renderColorPaletteFromThemes + useHead
      composables/useColorMode.ts              <- bindColorMode(useCookie<ColorMode>(...))
      composables/useColorPalette.ts           <- useColorPaletteUnshared({
                                                      source: useCookie<NuxtColorPaletteConfig>(...),
                                                      nonce: () => useConfig('nonce').value,
                                                  })
```

Consumer usage:

```ts
// nuxt.config.ts — same shape for every theme
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        // Optional: auto-install themes via a generated plugin.
        // Themes that need factory args skip this and install via
        // a user-authored plugin file under `plugins/`.
        themes: ['@vuecs/theme-tailwind'],

        colorMode: { value: 'system' },                       // 'light' | 'dark' | 'system'
        colorPalette: { value: { primary: 'green' } },        // initial palette
        cookie: { maxAge: 31536000, sameSite: 'lax' },        // color-mode cookie attrs
        paletteCookie: { /* attrs; falls back to `cookie` */ },
    },
});
```

```vue
<!-- in a component (any theme) -->
<script setup>
const { current, set, extend } = useColorPalette();   // from @vuecs/nuxt
const { resolved, toggle } = useColorMode();          // from @vuecs/nuxt
</script>
```

The auto-imported `useColorPalette` thin-wraps `useColorPaletteUnshared`
from `@vuecs/design` with a cookie-backed `Ref<T>` passed as `source`.
The dispatch walks installed themes' `palette.handle` hooks and
concatenates outputs — same semantic as the SPA composables in
`@vuecs/theme-tailwind` / `@vuecs/theme-bulma`. The return shape is
shape-identical so consumers move between SPA + Nuxt without API drift.

On the server, both plugins render their state into the head before
first paint (palette `<style>` block + `html.dark`/`html.light` class +
per-theme data-* attributes from `colorMode.handle`). The client
hydrates against the same DOM and continues to manage them reactively —
effectively zero-cost palette switching and zero-FOUC dark mode (except
first visits with `colorMode.value: 'system'` and no cookie, where the
OS preference can't be read on the server).

The dark-mode integration is built on `@vueuse/core`'s `usePreferredDark`
plus a Nuxt cookie (`vc-color-mode` by default). It's NOT
`@nuxtjs/color-mode` under the hood — that module remains an alternative
for consumers who prefer it (set `vuecs: { colorMode: false }` to opt out).

`vuecs.cookie` governs color-mode cookie attributes; `vuecs.paletteCookie`
governs palette cookie attributes. The palette cookie inherits from
`cookie` when `paletteCookie` is unset — most apps want consistent
retention across UI-state cookies.

### Bootstrap bridge (theme-bootstrap)

`@vuecs/theme-bootstrap` ships an optional CSS file at `assets/index.css`
that wires Bootstrap's `:root` theme-color variables onto `--vc-color-*`.
The package's `package.json` exposes a `style` conditional export, so a
bare `@import "@vuecs/theme-bootstrap"` in a CSS file resolves to the
bridge. The explicit subpath form (`@vuecs/theme-bootstrap/index.css`)
also works. Currently targets Bootstrap 5 — remaps `--bs-primary`,
`--bs-success`, etc. Bootstrap 5 components read `--bs-*` at runtime, so
runtime palette switches via `setColorPalette()` propagate.

Pair with `@vuecs/design/standalone` to drop the Tailwind
dependency entirely while keeping `setColorPalette()` functional —
the standalone subpath inlines the Tailwind palette catalog as plain
CSS variables.

The Bootstrap bridge targets the current Bootstrap theme. A Bootstrap 4 bridge cannot recolor Sass-compiled literal hex values in widget styles.

### Bulma bridge (theme-bulma)

`@vuecs/theme-bulma` ships an optional CSS file at `assets/index.css`
that wires Bulma 1.0+'s `:root` theme-color variables onto `--vc-color-*`.
Same shape as the Bootstrap bridge: `style` conditional export so a bare
`@import "@vuecs/theme-bulma"` resolves to the bridge. Bulma 1.0+
components read `--bulma-*` at runtime, so runtime palette switches via
`setColorPalette()` propagate.

Pair with `@vuecs/design/standalone` to drop Tailwind
entirely from a Bulma-only stack — same rationale as theme-bootstrap.

Notable mapping decisions:
- `--bulma-link → --vc-color-info-500` (preserves Bulma's two-tone
  palette where `link` is a separate "informational" axis from
  `primary`; differs from the BS bridge's `--bs-link-color → primary-600`).
- `ghost` / `link` button-variant mappings are reversed vs. Bootstrap.
  Bulma's `is-ghost` is the underlined-anchor button (= our `link`);
  Bulma's `is-text` is the borderless transparent button (= our `ghost`).
- DropdownMenu / FormSelect content uses `.dropdown-content` (Bulma's
  inner box-styled element) rather than `.dropdown-menu`, because
  `.dropdown-menu` is gated by parent `.dropdown.is-active` and Reka's
  portal-mounted content has no parent.
- Stepper and Switch are hand-rolled via gap-fill rules in the bridge
  CSS — neither ships in Bulma core. Same approach as the BS bridge,
  using design-system tokens for color.

Bulma 1.0 routes per-variant theming through HSL **channel** vars
(`--bulma-button-h/s/l`), not named color tokens. A `.button.is-primary`
sets `--bulma-button-h: var(--bulma-primary-h)` etc., and the base
`.button` rule resolves `background-color: hsl(--bulma-button-h, …)`.
Pure CSS can't decompose `var(--vc-color-primary-600)` into H/S/L
channels, so we can't bridge that path — overriding
`--bulma-button-background-color` is a no-op because Bulma never reads
it. The bridge instead overrides the **resolved** `background-color` /
`border-color` / `color` properties directly on each per-variant
selector. Specificity 0,2,0 beats Bulma's base `.button` (0,1,0); no
`!important` needed.

Trade-off: Bulma's auto-computed hover/active lightness deltas are
short-circuited. The bridge re-specifies hover (`-700`) and active
(`-800`) shades manually per variant — same pattern as the BS bridge's
explicit `--bs-btn-hover-bg` overrides.

Utility classes that read HSL channels (`.has-background-light`,
`.has-text-grey`, `.has-background-dark`) keep Bulma's default palette
— `setColorPalette()` doesn't reach them. The variant matrix uses these
utilities sparingly (avatar bg, stepper indicator default state,
tooltip dark bg) where Bulma's defaults are visually acceptable.

### Short-form CSS imports

All style-carrying packages use the `style` conditional export so
consumers can write bare imports:

```css
@import "@vuecs/design";              /* → assets/index.css */
@import "@vuecs/design/standalone";   /* → assets/standalone.css (Tailwind-free) */
@import "@vuecs/theme-bootstrap";     /* → assets/index.css (bridge) */
@import "@vuecs/theme-bulma";         /* → assets/index.css (bridge) */
@import "@vuecs/forms";       /* → dist/style.css */
@import "@vuecs/navigation";          /* → dist/style.css */
@import "@vuecs/pagination";          /* → dist/style.css */
```

The component-package CSS bundles ship the structural rules that the JS
entry doesn't auto-import (extracted at build time by tsdown). Consumers
who don't import these will see the bundled JS render correctly but lose
component-specific structural styling — checkbox switch variant,
range-slider track and thumbs, search-dropdown panel, nav tree-line, etc.

Explicit subpath forms (`@vuecs/design/index.css`, `@vuecs/forms/style.css`,
`@vuecs/forms/dist/style.css`) remain supported for clarity when
mixing multiple CSS entry points.

### `@vuecs/design/standalone` subpath

Tailwind-free entry point for Bootstrap / Bulma consumers (and anyone
who doesn't want Tailwind v4 in their bundle). Brings two things on
top of the default entry:

1. **Full Tailwind v4 palette catalog** — `--color-<palette>-<shade>`
   for the 22 catalogued palettes (`slate`/`gray`/`zinc`/`neutral`/
   `stone`/`red`/`orange`/`amber`/`yellow`/`lime`/`green`/`emerald`/
   `teal`/`cyan`/`sky`/`blue`/`indigo`/`violet`/`purple`/`fuchsia`/
   `pink`/`rose`) × 11 shades (50…950) = 242 OKLCH literals. Lives
   at `assets/palettes.css`.
2. **All of `@vuecs/design`'s default content** — `--vc-color-*`
   semantic scales, light/dark aliases, radius tokens, motion
   primitives. Inherited via `@import "./index.css"`.

Mutually exclusive with the default entry — never load both. The
default entry already has the semantic scales; layering standalone on
top would duplicate them.

```css
/* Tailwind app — default entry */
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";

/* Bootstrap / Bulma app — Tailwind-free */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bootstrap";
```

**Why this matters.** `setColorPalette()` writes `--vc-color-primary-600:
var(--color-emerald-600)` (or whichever palette) into the runtime
`<style>` block. Without `--color-emerald-600` defined somewhere,
that resolves to the var's fallback (none → invalid). On a
Tailwind-loaded app the var comes from Tailwind itself; on a
Tailwind-free app the standalone subpath supplies it.

**Build pipeline.** `packages/design/assets/palettes.css` is generated
by `packages/design/scripts/build-standalone.ts` which parses
`node_modules/tailwindcss/theme.css` and emits the 242 OKLCH literals
as a single `:root { ... }` block. The script ships with two scripts:

| Script | Purpose |
|---|---|
| `npm run --workspace=packages/design standalone:build` | Regenerate `assets/palettes.css` from the locally-installed Tailwind |
| `npm run --workspace=packages/design standalone:check` | CI guard — diff committed file vs freshly regenerated; non-zero exit on drift |

The 22-palette list lives in `src/core/color-palette/catalog.ts`
(`COLOR_PALETTES`) and is imported by both this script and the
runtime renderers in `@vuecs/theme-tailwind` / `@vuecs/theme-bulma`.
Single source of truth — when Tailwind adds a new palette and we
want to expose it via `setColorPalette()`, update the catalog and
re-run `standalone:build` (plus `palette-catalog:build` in
`@vuecs/theme-bulma` to refresh the HSL table).

Re-run `standalone:build` after bumping the `tailwindcss` devDep and
commit the regenerated `palettes.css`. The `standalone:check` script
is suitable for a CI matrix step (catches forgotten regenerations).
