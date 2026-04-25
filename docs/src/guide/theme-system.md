# Theme System

The theme system in `@vuecs/core` resolves CSS classes for every component through a four-layer chain. This page covers the resolution order, merge semantics, and how to extend it.

## Resolution layers

For each named element (a logical part of a component, e.g. `root`, `icon`, `actions`), classes resolve through:

```
1. Component defaults  (vc-* structural classes, co-located in each component)
2. Themes              (merged in array order)
3. Overrides           (passed to app.use())
4. Instance props      (themeClass on the component)
```

Each layer can either **replace** or **merge** with the layer below it.

## Merge rules

| Layer | vs. lower | Notes |
|-------|-----------|-------|
| Themes | always **merge** with defaults | The `vc-*` structural classes are never lost |
| Themes vs. each other | later **replaces** earlier | Per-element, the last theme wins, but defaults still merge in |
| Overrides | **replace** | Wrap with `extend()` to merge |
| Instance props | **replace** | Wrap with `extend()` to merge |

The `extend()` helper is a marker that flips replace → merge semantics:

```ts
import vuecs, { extend } from '@vuecs/core';

app.use(vuecs, {
    themes: [tailwindTheme()],
    overrides: {
        elements: {
            // Replace: VCFormSubmit's root becomes literally 'my-btn'
            formSubmit: { classes: { root: 'my-btn' } },

            // Merge: keep theme classes + add 'border-b'
            listItem: { classes: { root: extend('border-b') } },
        },
    },
});
```

## Composable usage

In a component:

```ts
import { useComponentTheme } from '@vuecs/core';

setup(props) {
    const theme = useComponentTheme('listItem', props, {
        classes: {
            root: 'vc-list-item',
            actions: 'vc-list-item-actions',
        },
        variants: {
            size: {
                sm: { root: 'py-1' },
                md: { root: 'py-2' },
                lg: { root: 'py-3' },
            },
        },
        defaultVariants: { size: 'md' },
    });

    return () => h('div', { class: theme.value.root }, [
        h('span', { class: theme.value.actions }, '...'),
    ]);
}
```

The composable signature `(name, props, defaults)` mirrors `useComponentDefaults` — both read convention-named keys (`themeClass`, `themeVariant`) off the reactive props object.

## Reactive updates

The returned `ComputedRef` recomputes when any of the following change:

- `props.themeClass` or `props.themeVariant` (instance layer)
- `ThemeManager` state (themes/overrides changed via `setThemes()`/`setOverrides()`)

Theme switching at runtime (e.g. swapping Bootstrap v5 → Tailwind) is supported but rare; palette switching via `setPalette()` is more common and **does not** require theme re-resolution — it operates on the design-token layer below.

## Type-safe slot keys

The augmentable `ThemeElements` interface registers each component's slot keys for autocomplete:

```ts
declare module '@vuecs/core' {
    interface ThemeElements {
        listItem?: ThemeElementDefinition<{
            root: VNodeClass;
            actions: VNodeClass;
        }>;
    }
}
```

Once registered, `app.use(vuecs, { overrides: { elements: { listItem: { classes: { /* autocomplete here */ } } } } })`.

## Pure resolution functions

The actual resolution logic has zero Vue dependencies:

- `resolveComponentTheme(defaults, themes, overrides, instance)` — slot classes
- `extractVariantConfig(defaults, themes, overrides)` — merged variant definitions
- `resolveVariantClasses(definitions, values)` — variant value → class mapping

Useful for unit testing themes without `createApp()`. The `ThemeManager` and composable just wrap these in Vue's `shallowRef`/`computed` for reactivity.

## See also

- [Variants](/guide/variants) — variant + compound variant rules
- [Behavioral Defaults](/guide/behavioral-defaults) — non-class prop resolution
- [Design Tokens](/guide/design-tokens) — what the class strings actually paint with
