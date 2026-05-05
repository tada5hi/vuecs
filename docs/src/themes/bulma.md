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

Bulma 1.0 components read `--bulma-*` at runtime, so any change to `--vc-color-*` (overriding in CSS, or via the Tailwind theme's `setColorPalette()` if also installed) re-tints **both** vuecs components and Bulma-native components in real time.

::: info Runtime palette switching is Tailwind-only
`@vuecs/theme-bulma` does **not** ship a runtime palette switcher. Bulma doesn't expose a named-palette catalog the way Tailwind does. To swap palettes at runtime, install `@vuecs/theme-tailwind` alongside this package and use its `setColorPalette()` — the swap rewrites `--vc-color-*` which both bridges read from.
:::

## Mapping notes

A few places where Bulma's vocabulary diverges from the Bootstrap/Tailwind themes — useful context if you mix Bulma classes with vuecs components in your own code:

- **`ghost` / `link` button variants are reversed.** Bulma's `is-ghost` is the underlined-anchor button (matching vuecs `link`); Bulma's `is-text` is the borderless transparent button (matching vuecs `ghost`). The mapping looks inverted at a glance but reads naturally in Bulma's own vocabulary.
- **DropdownMenu / FormSelect content uses `.dropdown-content`, not `.dropdown-menu`.** Bulma gates `.dropdown-menu` visibility on the parent `.dropdown.is-active` wrapper. Reka renders the content via portal — there is no parent — so the theme applies `.dropdown-content` (the inner box-styled element) directly.
- **`.tag` has only three sizes (default, `is-medium`, `is-large`).** vuecs's `sm/md/lg` map to default / `is-medium` / `is-large` — `<VCTag size="sm">` lands on Bulma's smallest tag.
- **`.dark` is the dark-mode toggle.** Bulma 1.0 ships a `[data-theme="dark"]` mode out of the box; the bridge only flips on `.dark` (vuecs convention). Pick one source of truth.

## Limitations

- **HSL-channel-derived utility classes don't track `--vc-color-*` overrides.** Bulma's per-variant components (`.button.is-primary`, `.tag.is-primary`, …) compose colors via HSL channel vars (`--bulma-button-h/s/l`) rather than named `--bulma-X-background-color` tokens. The bridge works around this by overriding the resolved `background-color` / `border-color` / `color` properties directly on each per-variant selector — runtime palette swaps re-tint those correctly. But channel-driven utility classes (`has-background-light`, `has-text-grey`, `has-background-dark`) keep Bulma's default palette; the matrix uses them only where the default is visually acceptable (avatar bg, stepper indicator default state, tooltip dark bg).
- **Hover/active lightness deltas don't auto-derive.** Bulma normally interpolates hover/active states via `calc(var(--bulma-<color>-l) ± 5%)`. Because the bridge overrides the resolved color directly, those deltas are short-circuited; the bridge re-specifies hover (`-700`) and active (`-800`) shades explicitly per variant. Visually equivalent — just a different mechanism.
- **Switch / stepper extensions target native `<input>` markup; Reka renders `<button role="…">`.** The theme's variant matrix layers Bulma utility classes on top of the structural `vc-form-{checkbox,switch,radio}` rules from `@vuecs/forms` and the structural stepper rules from `@vuecs/navigation` — those packages own shape and `data-state` checked-color visualization for these widgets.

## When to drop the bridge

If you want to use Bulma's stock colors as-is and don't need vuecs's `--vc-color-*` tokens to flow into Bulma components, skip the `@import "@vuecs/theme-bulma"` line. The component classes still resolve through the theme.

## See also

- [Design Tokens](/guide/design-tokens) — what the bridge maps onto, including the bridging guide for additional CSS frameworks
- [Theme System](/guide/theme-system) — layered resolution
