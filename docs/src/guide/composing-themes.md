# Composing themes

Use `defineTheme()` to author a theme that builds on one or more existing themes — for example, to ship a third-party kit's own theme on top of `@vuecs/theme-tailwind`, or to layer in-app brand overrides without re-declaring every slot.

The shape mirrors `tsconfig`'s `extends` field and Vue/Vite's `define*()` doctrine.

## Quick example

```ts
import tailwindTheme from '@vuecs/theme-tailwind';
import { defineTheme, extend } from '@vuecs/core';

export const acmeTheme = () => defineTheme({
    extends: tailwindTheme(),
    elements: {
        button: { classes: { root: extend('shadow-2xl') } },
        acmeDataTable: { classes: { root: 'flex flex-col' } },
    },
});
```

Consumers install just the composed theme:

```ts
import vuecs from '@vuecs/core';
import { acmeTheme } from '@acme/admin-kit';

app.use(vuecs, { themes: [acmeTheme()] });
```

No need for the consumer to install Tailwind separately or remember to stack the override entry.

## API

```ts
type ThemeConfig = {
    extends?: Theme | Theme[];
    elements?: Partial<ThemeElements>;
    classesMergeFn?: ClassesMergeFn;
    colorMode?: { apply: (doc: Document, mode: 'light' | 'dark') => void };
    palette?: { render: (palette: Record<string, string>) => string; names?: readonly string[] };
};

function defineTheme(config: ThemeConfig): Theme;
```

Multi-base composition is natural — `extends: [a, b, c]` resolves left-to-right (rightmost wins), matching the runtime semantics of `themes: [a, b, c]` install-time stacking. The current config's own fields apply last and win over everything in `extends`.

Omitting `extends` produces a leaf theme — `defineTheme({ elements: { … } })` is equivalent to writing the `Theme` literal by hand.

## Merge rules

For each component name across the chain:

| Field | Merge rule |
|---|---|
| `classes` | Per-slot: later plain replaces accumulator; `extend()` marker merges via the chain's `classesMergeFn` |
| `variants` | Deep merge per variant name + value (later wins per slot) |
| `compoundVariants` | Concatenate from all chain layers |
| `defaultVariants` | Shallow merge per key (later wins) |
| `classesMergeFn` | Last-wins across the chain |
| `colorMode.apply` | Compose: each layer's apply runs in chain order |
| `palette.render` / `palette.names` | Last-wins (one renderer owns the runtime `<style>` block) |

The `colorMode` and `palette` slots are reserved for plan 021's runtime hooks. They type-check today but are no-ops until that plan ships.

## When to use it

- **Third-party libraries** that ship their own themable components and want to publish a single self-contained theme that builds on Tailwind / Bootstrap / Bulma.
- **In-app branding layers** that override a few slots on a base theme without re-declaring the whole shape.
- **Variant cascades** that share a base set of compound variants and only override defaults per environment.

For per-component instance overrides (one `<VCButton>` with a custom class), prefer the `themeClass` / `themeVariant` props — `defineTheme` is the authoring path, not the per-render override path.

## Lower-level: `mergeThemes`

`@vuecs/core` also exports `mergeThemes(themes: Theme[]): Theme`, the pure reducer that `defineTheme` delegates to. Use it when you have an array of themes and want to flatten them outside an authoring helper:

```ts
import { mergeThemes } from '@vuecs/core';

const flat = mergeThemes([baseA, baseB, currentLayer]);
// flat is a single Theme that resolves identically to themes: [baseA, baseB, currentLayer]
```

## See also

- [Theme System](/guide/theme-system) — full resolution chain and `extend()` marker semantics
- [Variants](/guide/variants) — variant + compound-variant authoring
