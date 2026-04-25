# Themes

A vuecs theme is a function returning class-map data — `Theme = { elements: { [componentName]: { classes, variants, compoundVariants, defaultVariants } } }`. Multiple themes can stack; they merge in array order.

```ts
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import fontAwesome from '@vuecs/theme-font-awesome';

app.use(vuecs, {
    themes: [
        tailwindTheme(),  // base CSS framework
        fontAwesome(),    // additive — icons
    ],
});
```

## Available themes

| Theme | Package | What it does |
|-------|---------|--------------|
| [Tailwind](/themes/tailwind) | `@vuecs/theme-tailwind` | Tailwind v4 utility classes for every component, paired with the design tokens |
| [Bootstrap v5](/themes/bootstrap-v5) | `@vuecs/theme-bootstrap-v5` | Bootstrap 5.x classes + optional `--bs-*` → `--vc-color-*` bridge |
| [Bootstrap v4](/themes/bootstrap-v4) | `@vuecs/theme-bootstrap-v4` | Bootstrap 4.x classes — bridge has limited reach (see page) |
| [Font Awesome](/themes/font-awesome) | `@vuecs/theme-font-awesome` | Icons — `fa fa-*` glyphs slotted into icon elements |

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
            formSubmit: {
                classes: { root: 'my-btn my-btn-primary' },
                variants: {
                    busy: { true: { root: 'opacity-50 cursor-wait' } },
                },
            },
        },
    };
}
```

Optionally export a `classesMergeFn` if your CSS framework needs class deduplication (`@vuecs/theme-tailwind` ships a `twMerge`-backed one).
