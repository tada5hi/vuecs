# Build your own themable component

The vuecs theme system isn't reserved for `@vuecs/*` packages — any third-party component can plug into it and inherit the same `app.use(vuecs, ...)` config surface, runtime palette switching, and theme-extends story.

This guide walks through a worked example: an `<MyDataTable>` component that registers its own theme slots, resolves classes via `useComponentTheme`, and lets downstream consumers reskin it through the same override layer that vuecs's primitives use.

## What "themable" means here

A vuecs-themable component is one that:

1. Declares a typed slot map via TypeScript declaration merging on `ThemeElements`.
2. Resolves classes through vuecs's `ThemeManager`, exposing the standard `themeClass` / `themeVariant` props every vuecs component exposes.
3. Reads the resolved class strings when rendering.

That's the whole contract. No registration, no plugin, no global state — just a typed slot declaration plus a couple of helper calls inside an ordinary Vue `defineComponent`.

`@vuecs/core` ships two small helpers that collapse most of the boilerplate while leaving Vue's `defineComponent` API untouched (so slot typing, `expose`, generic component types, and `vue-tsc` inference all keep working):

- **`themableProps<T>()`** — returns the standard `themeClass` / `themeVariant` prop declarations, typed against your slot map. Spread into your component's `props` block.
- **`useThemeProps(props, ...shorthandVariantKeys)`** — returns the reactive `{ themeClass, themeVariant }` getter pair that `useComponentTheme` expects. Folds shorthand variant props (e.g. `color`, `size`, `density`) into `themeVariant`.

Together they replace ~12 mechanical lines per component (the duplicated prop declarations + the hand-rolled reactive-getter object + manual variant folding) without changing the call site's shape — you still write `defineComponent({ ... })`.

## The example: `<MyDataTable>`

We'll build a tiny data table with three theme slots:

| Slot | Element |
|---|---|
| `root` | The outer `<div>` wrapping the table |
| `header` | The header `<thead>` |
| `row` | Each body `<tr>` |

Plus a single variant axis: `density` ∈ `'compact' | 'normal' | 'spacious'`.

### Step 1 — Declare the theme contract

```ts
// my-data-table/types.ts
import type { ThemeElementDefinition } from '@vuecs/core';

export type MyDataTableDensity = 'compact' | 'normal' | 'spacious';

export type MyDataTableThemeClasses = {
    /** The wrapping container. */
    root: string;
    /** The `<thead>` element. */
    header: string;
    /** Each body `<tr>`. */
    row: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        myDataTable?: ThemeElementDefinition<MyDataTableThemeClasses>;
    }
}
```

The `declare module '@vuecs/core'` block extends vuecs's `ThemeElements` interface to register your component name (`myDataTable`) alongside vuecs's built-ins. Any consumer importing this file picks up the augmentation automatically — they get autocomplete + type-checking for `myDataTable` in `app.use(vuecs, { overrides: { elements: { /* myDataTable here */ } } })`.

### Step 2 — Define the component's defaults

```ts
// my-data-table/theme.ts
import type { ComponentThemeDefinition } from '@vuecs/core';
import type { MyDataTableThemeClasses } from './types';

export const myDataTableThemeDefaults: ComponentThemeDefinition<MyDataTableThemeClasses> = {
    classes: {
        root: 'mdt-root',
        header: 'mdt-header',
        row: 'mdt-row',
    },
    variants: {
        density: {
            compact: { row: 'mdt-row-compact' },
            normal: { row: 'mdt-row-normal' },
            spacious: { row: 'mdt-row-spacious' },
        },
    },
    defaultVariants: { density: 'normal' },
};
```

These are the **structural** classes — the ones that always apply, regardless of which theme is installed. The convention is to prefix them with your library's namespace (`mdt-` here, like vuecs uses `vc-`). Pair them with a small CSS file that gives `.mdt-*` reasonable structural rules (display, padding, table-layout) — themes layer cosmetic styling on top.

### Step 3 — Build the component

```vue
<!-- my-data-table/MyDataTable.vue -->
<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { myDataTableThemeDefaults } from './theme';
import type { MyDataTableDensity, MyDataTableThemeClasses } from './types';

const myDataTableProps = {
    /** Row data. */
    rows: { type: Array as PropType<Array<Record<string, unknown>>>, default: () => [] },
    /** Density variant — resolved by the active theme. */
    density: { type: String as PropType<MyDataTableDensity>, default: undefined },
    ...themableProps<MyDataTableThemeClasses>(),
};

export type MyDataTableProps = ExtractPublicPropTypes<typeof myDataTableProps>;

export default defineComponent({
    name: 'MyDataTable',
    props: myDataTableProps,
    slots: Object as SlotsType<{
        header?: () => unknown;
        row?: (props: { row: Record<string, unknown> }) => unknown;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme(
            'myDataTable',
            useThemeProps(props, 'density'),
            myDataTableThemeDefaults,
        );

        return () => h('div', { class: theme.value.root }, [
            h('table', [
                h('thead', { class: theme.value.header }, slots.header?.()),
                h('tbody', props.rows.map((row) => h('tr', { class: theme.value.row }, slots.row?.({ row }) ?? []))),
            ]),
        ]);
    },
});
</script>
```

What the helpers do:

- **`themableProps<MyDataTableThemeClasses>()`** spreads the standard `themeClass` / `themeVariant` prop declarations into your `props` block, typed against your slot map. Consumers can pass `:theme-class="{ root: 'extra' }"` per instance without you re-declaring the prop types yourself.
- **`useThemeProps(props, 'density')`** returns the reactive `{ themeClass, themeVariant }` getter pair that `useComponentTheme` expects. The shorthand-variant folding means consumers can write either `<MyDataTable density="compact" />` or `<MyDataTable :theme-variant="{ density: 'compact' }" />` — both resolve identically.

Notice this is a plain `defineComponent` call. Slot typing via `SlotsType<...>`, `expose`, `emits` validators, generic component types, and recursive `<Self>` references all keep working — vuecs's helpers don't wrap or replace Vue's authoring API.

That's the whole component. No vuecs install hook, no manager registration.

## Closing the loop: consumer-side override

A consumer of your library installs vuecs once and configures every component — vuecs's primitives **plus your `<MyDataTable>`** — through the same call:

```ts
// app/main.ts
import { createApp } from 'vue';
import vuecs, { extend } from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import { MyDataTable } from 'my-data-table';
import App from './App.vue';

const app = createApp(App);

app.use(vuecs, {
    themes: [tailwindTheme()],
    overrides: {
        elements: {
            // Reskin a vuecs primitive
            button: { classes: { root: 'shadow-lg' } },

            // Reskin your library's component the same way
            myDataTable: {
                classes: {
                    root: 'rounded-xl ring-1 ring-border',
                    header: extend('bg-muted/50'),
                    row: extend('hover:bg-muted/30'),
                },
            },
        },
    },
});

app.component('MyDataTable', MyDataTable);
app.mount('#app');
```

`extend()` flips replace → merge: `header: extend('bg-muted/50')` keeps both the structural `mdt-header` class AND the theme's contribution AND adds the consumer's class. Without `extend()`, the consumer's value at the override layer (or the per-instance `themeClass` prop) **fully replaces every lower layer including the structural defaults** — wrap with `extend()` whenever you want the structural classes to survive. Themes (layer 2) are special: they always merge with defaults regardless. See [Theme System](/guide/theme-system) for the full chain.

### Per-instance override

The same shape works per-instance via the `themeClass` prop:

```vue
<template>
  <MyDataTable
    :rows="users"
    density="compact"
    :theme-class="{ row: extend('cursor-pointer') }"
  />
</template>
```

## Publishing your own theme

If your library has a strong opinion about how its components should look — e.g. a Tailwind-based style baseline that consumers can opt into — you can ship that as a **theme** rather than a per-component overrides bundle. Use [`defineTheme()`](/guide/composing-themes) to build on an existing base:

```ts
// my-data-table/theme-tailwind.ts
import tailwindTheme from '@vuecs/theme-tailwind';
import { defineTheme, extend } from '@vuecs/core';

export const myDataTableTailwindTheme = () => defineTheme({
    extends: tailwindTheme(),
    elements: {
        // Reskin your own component
        myDataTable: {
            classes: {
                root: 'rounded-lg ring-1 ring-border bg-bg',
                header: 'bg-muted text-fg-muted text-sm font-semibold',
                row: extend('border-b border-border last:border-0'),
            },
            variants: {
                density: {
                    compact: { row: 'py-1 text-sm' },
                    normal: { row: 'py-2' },
                    spacious: { row: 'py-3 text-base' },
                },
            },
        },

        // Optionally tweak vuecs primitives so your kit feels coherent
        button: { classes: { root: extend('font-medium') } },
    },
});
```

Consumers get the whole stack — Tailwind base + your data-table styling + your button tweaks — by installing one theme:

```ts
app.use(vuecs, { themes: [myDataTableTailwindTheme()] });
```

No need for them to install Tailwind separately or remember to stack the override entry. They can still extend further with their own brand layer:

```ts
import { defineTheme } from '@vuecs/core';
import { myDataTableTailwindTheme } from 'my-data-table/theme-tailwind';

const brandTheme = () => defineTheme({
    extends: myDataTableTailwindTheme(),
    elements: { button: { classes: { root: extend('rounded-full') } } },
});
```

## Using `<VCPrimitive>` for `as` / `asChild`

The example above hardcodes `h('div', ...)` as the root. Most themable components want to give consumers an escape hatch: render as a different tag (`<section>`, `<article>`, `<a>`), or fall through to a custom child element entirely via the [`asChild`](/guide/primitive#the-aschild-pattern) pattern. The render target for that is **`<VCPrimitive>` from `@vuecs/core`** — a generic `as` / `asChild` building block that lives in `@vuecs/core` so you don't need a direct `reka-ui` peer dep.

Refactor `<MyDataTable>` to use it:

```vue
<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps, VCPrimitive } from '@vuecs/core';
import { myDataTableThemeDefaults } from './theme';
import type { MyDataTableDensity, MyDataTableThemeClasses } from './types';

const myDataTableProps = {
    rows: { type: Array as PropType<Array<Record<string, unknown>>>, default: () => [] },
    density: { type: String as PropType<MyDataTableDensity>, default: undefined },

    /** HTML tag to render. Use `:as-child` to compose onto an existing component. */
    as: { type: String, default: 'div' },
    /** Render the consumer's slot child as the root (asChild pattern). */
    asChild: { type: Boolean, default: false },

    ...themableProps<MyDataTableThemeClasses>(),
};

export default defineComponent({
    name: 'MyDataTable',
    inheritAttrs: false,
    props: myDataTableProps,
    slots: Object as SlotsType<{
        header?: () => unknown;
        row?: (props: { row: Record<string, unknown> }) => unknown;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'myDataTable',
            useThemeProps(props, 'density'),
            myDataTableThemeDefaults,
        );

        return () => h(
            VCPrimitive,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.root,
            }),
            {
                default: () => h('table', [
                    h('thead', { class: theme.value.header }, slots.header?.()),
                    h('tbody', props.rows.map((row) => h(
                        'tr',
                        { class: theme.value.row },
                        slots.row?.({ row }) ?? [],
                    ))),
                ]),
            },
        );
    },
});
</script>
```

What changed:

- The `as` + `asChild` props are declared on the wrapper (with concrete defaults — `'div'` and `false`), then forwarded onto `<VCPrimitive>` along with the resolved theme class.
- `inheritAttrs: false` + `mergeProps(attrs, …)` propagates consumer-supplied attributes (`class`, `data-*`, event listeners) onto the rendered element.
- The body of the table is the wrapper's default slot to `<VCPrimitive>`. Self-closing tags (`as="img"`, `as="input"`) short-circuit the slot automatically — not relevant for a data table but useful to know if you build atomic elements.

Now the consumer can:

```vue
<template>
    <!-- Default <div> root -->
    <MyDataTable :rows="users" />

    <!-- Render as <section> instead -->
    <MyDataTable :rows="users" as="section" />

    <!-- Render as a router link (the whole table becomes clickable) -->
    <MyDataTable :rows="users" as-child>
        <RouterLink :to="`/team/${groupId}`" />
    </MyDataTable>
</template>
```

The third form is the `asChild` pattern: `<VCPrimitive>` falls through to the slot child, merges the wrapper's class + attrs onto it, and renders that element instead of its own root. Consumer styling, theme classes, and the table body all compose onto the `<RouterLink>`.

Why `<VCPrimitive>` and not Reka's `Primitive`? `@vuecs/core` ports it in-tree so your library doesn't take a runtime `reka-ui` dep just to render a generic `as` element. See [Primitive (as / asChild)](/guide/primitive) for the full reference and the asChild rules around comments, multi-child slots, and class precedence.

## Variants and behavioral defaults

The same declaration-merging pattern extends to two more axes:

- **`ComponentDefaults`** — register non-class behavioral defaults (button text, placeholder strings, icon names) that consumers can override globally for i18n or branding. See [Behavioral Defaults](/guide/behavioral-defaults).
- **`Config`** — register cross-cutting config keys (CSP nonces, custom direction/locale, etc.) that your component reads via `useConfig()`. The federated-schema pattern follows the same `declare module '@vuecs/core' { interface Config { ... } }` shape; subtree-scoped overrides are exposed via `<VCConfigProvider>`.

Both follow the same `declare module '@vuecs/core' { interface ... }` shape as `ThemeElements`.

## What you don't have to do

- **No global registration.** Your `<MyDataTable>` is a normal Vue component. Register it however you'd register any third-party component (`app.component(...)`, auto-import, manual import per page).
- **No theme manager plumbing.** `useComponentTheme` resolves through the `ThemeManager` that `@vuecs/core` already installed. As long as the consumer called `app.use(vuecs, ...)` somewhere, your component picks it up.
- **No CSS-in-JS or build-time codegen.** Themes are plain functions returning a config object — they're tree-shakeable and serializable.

## See also

- [Theme System](/guide/theme-system) — the four-layer resolution chain and `extend()` semantics
- [Composing Themes](/guide/composing-themes) — `defineTheme()` for inheriting and overriding
- [Variants](/guide/variants) — variant + compound-variant authoring
- [Behavioral Defaults](/guide/behavioral-defaults) — non-class defaults registered via `ComponentDefaults`
