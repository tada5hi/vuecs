# Bulma theme

`@vuecs/theme-bulma` ships Bulma 1.0+ class mappings for every component, plus an optional CSS bridge that maps `--bulma-*` theme variables onto the `--vc-color-*` design tokens for runtime palette switching.

```bash
npm install @vuecs/theme-bulma bulma
```

## Wire it up

```ts
// main.ts
import vuecs from '@vuecs/core';
import bulma from '@vuecs/theme-bulma';

app.use(vuecs, { themes: [bulma()] });
```

```css
/* styles.css */
@import "bulma/css/bulma.css";
@import "@vuecs/design";        /* design tokens (concrete OKLCH; no Tailwind needed) */
@import "@vuecs/theme-bulma";   /* optional: design-token bridge */
```

The `@import "@vuecs/theme-bulma"` resolves to the package's bridge CSS (`assets/index.css`) via the `style` conditional export.

## What the bridge does

The bridge file maps Bulma's CSS theme variables onto vuecs design tokens:

```css
:root {
    --bulma-primary: var(--vc-color-primary-500);
    --bulma-success: var(--vc-color-success-500);
    /* ... */
}
```

Bulma 1.0 components read `--bulma-*` at runtime, so any change to `--vc-color-*` (overriding in CSS, or via `setColorPalette()` — see below) re-tints **both** vuecs components and Bulma-native components in real time.

## Runtime palette switching

`@vuecs/theme-bulma` ships `setColorPalette()` (pure-DOM API) and contributes its renderer via `palette.handle` so `useColorPalette()` from `@vuecs/design` dispatches through it. The renderer matches the Tailwind catalog of 22 palette names:

```ts
import { setColorPalette } from '@vuecs/theme-bulma';
import { useColorPalette } from '@vuecs/design';

setColorPalette({ primary: 'green', neutral: 'zinc' });

// Or as a reactive composable (localStorage-backed; SPA-only):
const { current, set, extend } = useColorPalette();
extend({ primary: 'rose' });
```

Each call rewrites the shared `<style id="vc-color-palette">` block in `<head>`. Bulma's renderer emits three things together:

1. **Channel vars** (`--bulma-<scale>-h/s/l`) — Bulma 1.0 derives hover, active, and `.is-light` modifiers from these via `calc()`-driven lightness adjustments, so a single channel write re-tints every state automatically.
2. **Direct semantic vars** (`--bulma-primary`, `--bulma-info`, `--bulma-link`, …) — read by `has-background-*` / `has-text-*` utility classes.
3. **vuecs design tokens** (`--vc-color-<scale>-{50…950}`) — keeps the bridge's per-variant `var(--vc-color-primary-600)` overrides AND any consumer-authored CSS that references the design tokens in lockstep with the swap.

The OKLCH→HSL conversion happens once at package build time (see `themes/bulma/scripts/build-palette-catalog.ts`); the runtime cost of `setColorPalette()` is a single string-template + DOM upsert.

The storage key (`vc-color-palette`) is the default for `useColorPalette()` from `@vuecs/design`, so when both themes are installed, a docs site or playground drives a single picker UI from one shared ref and both themes' renderers fire on the same payload.

## Mapping notes

A few places where Bulma's vocabulary diverges from the Bootstrap/Tailwind themes — useful context if you mix Bulma classes with vuecs components in your own code:

- **`ghost` / `link` button variants are reversed.** Bulma's `is-ghost` is the underlined-anchor button (matching vuecs `link`); Bulma's `is-text` is the borderless transparent button (matching vuecs `ghost`). The mapping looks inverted at a glance but reads naturally in Bulma's own vocabulary.
- **DropdownMenu / FormSelect content uses `.dropdown-content`, not `.dropdown-menu`.** Bulma gates `.dropdown-menu` visibility on the parent `.dropdown.is-active` wrapper. Reka renders the content via portal — there is no parent — so the theme applies `.dropdown-content` (the inner box-styled element) directly.
- **`.tag` has only three sizes (default, `is-medium`, `is-large`).** vuecs's `sm/md/lg` map to default / `is-medium` / `is-large` — `<VCTag size="sm">` lands on Bulma's smallest tag.
- **`.dark` is the dark-mode toggle.** Bulma 1.0 ships a `[data-theme="dark"]` mode out of the box; the bridge only flips on `.dark` (vuecs convention). Pick one source of truth.

## Limitations

- **`has-background-light`, `has-text-grey`, `has-background-dark`** — these utility classes still resolve through Bulma's `--bulma-grey-*` / `--bulma-light` / `--bulma-dark` defaults rather than the design-token alias. The matrix uses them only where Bulma's defaults are visually acceptable (avatar bg, stepper indicator default state, tooltip dark bg).
- **Hover/active lightness deltas don't auto-derive on `.is-<color>` selectors.** Bulma normally interpolates hover/active states via `calc(var(--bulma-<color>-l) ± 5%)`. Because the bridge overrides the resolved color directly on `.button.is-primary`, those deltas are short-circuited; the bridge re-specifies hover (`-700`) and active (`-800`) shades explicitly per variant — these are the design system's tuned shade stops, so the trade-off is intentional. (Bulma's auto-derivation IS active for selectors the bridge doesn't override, so consumer-authored `.button.is-acme` rules pick up `setColorPalette` channel writes correctly.)
- **Switch / stepper extensions target native `<input>` markup; Reka renders `<button role="…">`.** The theme's variant matrix layers Bulma utility classes on top of the structural `vc-form-{checkbox,switch,radio}` rules from `@vuecs/forms` and the structural stepper rules from `@vuecs/navigation` — those packages own shape and `data-state` checked-color visualization for these widgets.

## When to drop the bridge

If you want to use Bulma's stock colors as-is and don't need vuecs's `--vc-color-*` tokens to flow into Bulma components, skip the `@import "@vuecs/theme-bulma"` line. The component classes still resolve through the theme.

## See also

- [Design Tokens](/guide/design-tokens) — what the bridge maps onto, including the bridging guide for additional CSS frameworks
- [Theme System](/guide/theme-system) — layered resolution
