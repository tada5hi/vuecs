# Theming

vuecs has three layers you can configure independently:

- **Themes** — class-map data passed to `app.use(vuecs, { themes: [...] })`. Pick a CSS framework (Tailwind, Bootstrap, etc.) or stack multiple.
- **Icons** — Iconify-name vocabularies via `app.use(vuecs, { icons: [...] })`. Pick a preset (`@vuecs/icons-lucide`, `@vuecs/icons-font-awesome`, …) to populate vuecs's semantic icon-prop slots. See [Icons](/getting-started/icons) for the full setup.
- **Design tokens** — CSS variables shipped by `@vuecs/design` (concrete OKLCH defaults). Override in CSS via `:root { --vc-color-primary-*: ... }`. Tailwind users additionally get runtime palette switching via `setColorPalette()` from `@vuecs/theme-tailwind`.

The three layers are decoupled: themes resolve **class strings**, icons resolve **icon-name strings**, and tokens define **what those classes look like**.

## Pick a theme

```ts
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import bootstrap from '@vuecs/theme-bootstrap';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    themes: [tailwindTheme()],   // base CSS framework
    icons:  [lucide()],          // icon-name vocabulary (see Icons page)
});
```

Themes are merged in array order. Later themes override earlier ones at the slot level — but component defaults (the `vc-*` structural classes) are always preserved across all themes.

## Override individual slot classes

The third layer is `overrides`, which **replaces** by default and **merges** when wrapped in `extend()`:

```ts
import vuecs, { extend } from '@vuecs/core';

app.use(vuecs, {
    themes: [tailwindTheme()],
    overrides: {
        elements: {
            // Replace the entire root class for VCButton
            button: { classes: { root: 'my-custom-btn' } },

            // Merge an extra class onto VCListItem.root, keeping theme classes
            listItem: { classes: { root: extend('border-b border-dashed') } },
        },
    },
});
```

## Per-instance overrides

Every component takes two theme-related props:

- **`themeClass`** — slot class overrides (`{ root: 'px-6' }`)
- **`themeVariant`** — variant values (`{ size: 'sm', busy: true }`)

```vue
<VCListItem
    :theme-class="{ root: 'border-b' }"
    :theme-variant="{ size: 'lg' }"
/>
```

Both replace by default; wrap in `extend()` if you want to merge with the lower layers.

## Variants

Components declare structured variants in their defaults:

```ts
{
    classes: { root: 'vc-list-item' },
    variants: {
        size: {
            sm: { root: 'py-1' },
            lg: { root: 'py-3' },
        },
        busy: {
            true: { root: 'opacity-50' },
        },
    },
    compoundVariants: [
        { variants: { busy: true, size: 'lg' }, class: { root: 'cursor-wait' } },
    ],
    defaultVariants: { size: 'md' },
}
```

You set values via `themeVariant`, and themes/overrides can extend variant definitions. See the [Variants guide](/guide/variants) for the full merge rules.

## Switch palette at runtime (Tailwind only)

```ts
import { setColorPalette } from '@vuecs/theme-tailwind';

setColorPalette({ primary: 'green', neutral: 'zinc' });
```

This rewrites a `<style id="vc-color-palette">` block in `<head>` mapping `--vc-color-primary-*` to `var(--color-green-*)`. Every component that reads through the design tokens re-tints in real time — no Vue re-render, no class re-resolution.

In Nuxt, install `@vuecs/theme-tailwind-nuxt` alongside `@vuecs/nuxt` and use the auto-imported `useColorPalette()` for SSR-safe cookie-backed palette switching.

Bootstrap and Bulma themes don't ship runtime palette switching today — those frameworks don't expose a named-palette catalog the way Tailwind does. Their bridges still let you override `--vc-color-*` statically in CSS.

For non-Tailwind themes that ship their own palette catalog, compose `@vuecs/design`'s generic `applyColorPaletteCss(css)` and `bindColorPalette<T>(source, render)` with your own renderer — the same primitives the Tailwind theme is built on.

## Next steps

- [Dark Mode](/getting-started/dark-mode) — toggle `.dark` and let tokens flip
- [Theme System guide](/guide/theme-system) — full resolution rules
- [Variants guide](/guide/variants) — variants and compound variants
