# Theming

vuecs has two layers you can configure independently:

- **Themes** — class-map data passed to `app.use(vuecs, { themes: [...] })`. Pick a CSS framework (Tailwind, Bootstrap, etc.) or stack multiple (e.g. Tailwind + Font Awesome).
- **Design tokens** — CSS variables shipped by `@vuecs/design`. Switch the primary palette at runtime via `setPalette()` or in CSS via `:root { --vc-color-primary-*: ... }`.

The two layers are decoupled: themes resolve **class strings**, tokens define **what those classes look like**.

## Pick a theme

```ts
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import bootstrap5 from '@vuecs/theme-bootstrap-v5';
import fontAwesome from '@vuecs/theme-font-awesome';

app.use(vuecs, {
    themes: [
        tailwindTheme(),     // base CSS framework
        fontAwesome(),       // icons (separate concern, additive)
    ],
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
            // Replace the entire root class for VCFormSubmit
            formSubmit: { classes: { root: 'my-custom-btn' } },

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

## Switch palette at runtime

```ts
import { setPalette } from '@vuecs/design';

setPalette({ primary: 'green', neutral: 'zinc' });
```

This rewrites a `<style id="vc-palette">` block in `<head>` mapping `--vc-color-primary-*` to `var(--color-green-*)`. Every component that reads through the design tokens re-tints in real time — no Vue re-render, no class re-resolution.

In Nuxt, use `usePalette()` from `@vuecs/nuxt` for SSR-safe palette switching.

## Next steps

- [Dark Mode](/getting-started/dark-mode) — toggle `.dark` and let tokens flip
- [Theme System guide](/guide/theme-system) — full resolution rules
- [Variants guide](/guide/variants) — variants and compound variants
