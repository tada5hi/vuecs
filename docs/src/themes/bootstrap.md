# Bootstrap theme

`@vuecs/theme-bootstrap` ships Bootstrap 5.x class mappings for every component, plus an optional CSS bridge that maps `--bs-*` theme variables onto the `--vc-color-*` design tokens for runtime palette switching.

::: tip Renamed in 3.0
Previously published as `@vuecs/theme-bootstrap-v5`; renamed to `@vuecs/theme-bootstrap` in 3.0 (clean break, no shim package). The version number tracks vuecs's theme-package breaking changes, not Bootstrap's. The previous `@vuecs/theme-bootstrap-v4` package was removed in the same release — Bootstrap 4's Sass-compiled CSS didn't benefit from the design-token bridge.
:::

```bash
npm install @vuecs/theme-bootstrap bootstrap
```

## Wire it up

```ts
// main.ts
import vuecs from '@vuecs/core';
import bootstrap from '@vuecs/theme-bootstrap';

app.use(vuecs, { themes: [bootstrap()] });
```

```css
/* styles.css */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/theme-bootstrap";  /* optional: design-token bridge */
@import "@vuecs/design";               /* design tokens (concrete OKLCH; no Tailwind needed) */
```

The `@import "@vuecs/theme-bootstrap"` resolves to the package's bridge CSS (`assets/index.css`) via the `style` conditional export.

## What the bridge does

The bridge file maps Bootstrap's CSS theme variables onto vuecs design tokens:

```css
:root {
    --bs-primary: var(--vc-color-primary-500);
    --bs-success: var(--vc-color-success-500);
    /* ... */
}
```

Bootstrap 5 components read `--bs-*` at runtime, so any change to `--vc-color-*` (overriding in CSS, or via the Tailwind theme's `setColorPalette()` if also installed) re-tints **both** vuecs components and Bootstrap-native components in real time.

::: info Runtime palette switching is Tailwind-only
`@vuecs/theme-bootstrap` does **not** ship a runtime palette switcher. Bootstrap doesn't expose a named-palette catalog the way Tailwind does (`--bs-primary` is one color, not 22 alternatives). To swap palettes at runtime, install `@vuecs/theme-tailwind` alongside this package and use its `setColorPalette()` — the swap rewrites `--vc-color-*` which both bridges read from.
:::

## When to drop the bridge

If you want to use Bootstrap's stock colors as-is and don't need vuecs's `--vc-color-*` tokens to flow into Bootstrap components, skip the `@import "@vuecs/theme-bootstrap"` line. The component classes still resolve through the theme.

## See also

- [Design Tokens](/guide/design-tokens) — what the bridge maps onto
- [Bridging CSS Frameworks](/guide/bridging-css-frameworks) — the same pattern for additional CSS frameworks
- [Theme System](/guide/theme-system) — layered resolution
