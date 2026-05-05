# Themes

A vuecs theme is a function returning class-map data — `Theme = { elements: { [componentName]: { classes, variants, compoundVariants, defaultVariants } } }`. Multiple themes can stack; they merge in array order.

```ts
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';

app.use(vuecs, {
    themes: [tailwindTheme()],
});
```

Icons used to live as a "theme" entry, but as of vuecs 3.x they are configured separately under `icons:` (Iconify-backed) — see [Icons](/getting-started/icons).

## Available themes

| Theme | Package | What it does |
|-------|---------|--------------|
| [Tailwind](/themes/tailwind) | `@vuecs/theme-tailwind` | Tailwind v4 utility classes for every component, paired with the design tokens |
| [Bootstrap](/themes/bootstrap) | `@vuecs/theme-bootstrap` | Bootstrap 5.x classes + optional `--bs-*` → `--vc-color-*` bridge |
| [Bulma](/themes/bulma) | `@vuecs/theme-bulma` | Bulma 1.0+ classes + optional `--bulma-*` → `--vc-color-*` bridge |

## Merge semantics

- Themes always **merge** with component defaults — the structural `vc-*` classes are never lost.
- Between themes, a later **plain value replaces** the earlier theme's contribution (for the same slot), but defaults still merge in.
- Themes can also extend variant definitions and compound variants — see [Variants](/guide/variants) for the merge rules per field.

See [Theme System](/guide/theme-system) for the full layered resolution.

## Writing your own theme

A theme is just an object literal — no Vue runtime needed:

```ts
import type { Theme } from '@vuecs/core';

export default function myTheme(): Theme {
    return {
        elements: {
            button: {
                classes: { root: 'my-btn' },
                variants: {
                    loading: { true: { root: 'opacity-50 cursor-wait' } },
                },
                compoundVariants: [
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'my-btn-primary' } },
                ],
            },
        },
    };
}
```

Optionally export a `classesMergeFn` if your CSS framework needs class deduplication (`@vuecs/theme-tailwind` ships a `twMerge`-backed one).
