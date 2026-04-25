# Bootstrap v5 theme

`@vuecs/theme-bootstrap-v5` ships Bootstrap 5.x class mappings for every component, plus an optional CSS bridge that maps `--bs-*` theme variables onto the `--vc-color-*` design tokens for runtime palette switching.

```bash
npm install @vuecs/theme-bootstrap-v5 bootstrap
```

## Wire it up

```ts
// main.ts
import vuecs from '@vuecs/core';
import bootstrap5 from '@vuecs/theme-bootstrap-v5';

app.use(vuecs, { themes: [bootstrap5()] });
```

```css
/* styles.css */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/theme-bootstrap-v5";  /* optional: design-token bridge */
@import "@vuecs/design";               /* optional: enable runtime palette switching */
```

The `@import "@vuecs/theme-bootstrap-v5"` resolves to the package's bridge CSS (`assets/index.css`) via the `style` conditional export.

## What the bridge does

The bridge file maps Bootstrap's CSS theme variables onto vuecs design tokens:

```css
:root {
    --bs-primary: var(--vc-color-primary-500);
    --bs-success: var(--vc-color-success-500);
    /* ... */
}
```

Bootstrap 5 components read `--bs-*` at runtime, so calling `setPalette({ primary: 'green' })` re-tints **both** vuecs components and Bootstrap-native components in real time.

## When to drop the bridge

If you don't care about runtime palette switching and want to use Bootstrap's stock colors as-is, skip the `@import "@vuecs/theme-bootstrap-v5"` and `@import "@vuecs/design"` lines. The component classes still resolve through the theme; only the dynamic-color layer is opt-out.

## See also

- [Bootstrap v4](/themes/bootstrap-v4) — older Bootstrap line, with caveats
- [Design Tokens](/guide/design-tokens) — what the bridge maps onto
- [Theme System](/guide/theme-system) — layered resolution
