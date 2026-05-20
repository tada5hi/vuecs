# `<VCPrimitive>` — generic `as` / `asChild` building block

`<VCPrimitive>` is the unthemed render target that vuecs's themable components use under the hood. It does one job: render an HTML tag (or component) you pass in, optionally falling through to a custom child element via the `asChild` pattern. It carries **no theming, no defaults, no manager wiring** — pair it with `useComponentTheme` when you want a themable wrapper.

It ships in `@vuecs/core` (no `reka-ui` peer dep required) so libraries built on top of vuecs can author their own themable elements without pulling in a parallel primitive layer. The implementation is a line-for-line port of [Reka UI](https://reka-ui.com/)'s `Primitive`, kept in-tree as part of vuecs's "port-don't-depend" stance for tiny primitives.

## Why this exists

vuecs's themed component packages (`@vuecs/elements`, `@vuecs/overlays`, `@vuecs/forms`, …) hide Reka UI behind `<VC*>` wrappers — consumers never `import { Dialog } from 'reka-ui'`. The one Reka primitive that previously leaked across that boundary was the generic `Primitive` itself, used inside themable wrappers like the Card compound. `<VCPrimitive>` closes that loop:

- **Inside vuecs** — the Card compound (`<VCCard>` and its bands) renders through `<VCPrimitive>` rather than `Primitive`.
- **In third-party component libraries** — when you author your own themable component (see [Build Your Own Themable Component](/guide/build-themable-component)), use `<VCPrimitive>` as the inner render target. No `reka-ui` import needed.

## API

### Props

```ts
interface PrimitiveProps {
    /** Render the consumer's slot child as the rendered element, merging props/behavior. */
    asChild?: boolean;
    /** The element or component to render. Overridden by `asChild`. */
    as?: AsTag | Component;  // default: 'div'
}
```

- `as` — a tag name (`'div'`, `'section'`, `'a'`, …) or a Vue component. Autocomplete prompts the common tags; any other string works for custom elements or future HTML5 tags.
- `asChild` — when `true`, the wrapper renders nothing of its own and instead clones the first non-comment slot child, merging the wrapper's attrs (class, data-attributes, event listeners) onto it.

Self-closing tags (`area`, `img`, `input`) short-circuit the default slot to avoid SSR hydration mismatches.

### Basic rendering

```vue
<script setup lang="ts">
import { VCPrimitive } from '@vuecs/core';
</script>

<template>
    <!-- Default: <div> -->
    <VCPrimitive>hello</VCPrimitive>

    <!-- Named tag -->
    <VCPrimitive as="section" class="card">
        <h2>Title</h2>
    </VCPrimitive>

    <!-- Component -->
    <VCPrimitive :as="MyComponent" :foo="42">body</VCPrimitive>
</template>
```

### The `asChild` pattern

`asChild` is the escape hatch for "this themed wrapper should render as a different element entirely" — the consumer hands you a child, you fall through and apply your styling to that child instead of your own root.

```vue
<template>
    <!-- Default: <a> with merged wrapper class -->
    <VCPrimitive as-child class="vc-card vc-card-link">
        <a href="/article/intro">Read more</a>
    </VCPrimitive>
</template>
```

This renders:

```html
<a href="/article/intro" class="vc-card vc-card-link">Read more</a>
```

Notes on `asChild` semantics:

- **Wrapper class + child class compose.** Both `vc-card vc-card-link` (from the wrapper) and any class set on the slot child appear on the final element. CSS specificity resolves precedence.
- **Child props win on conflict.** If both the wrapper and the slot child set the same attribute, the child's value takes precedence — so a consumer can override e.g. `aria-label` from inside the slot.
- **Comments and multi-child slots.** Comment children are skipped. If the slot has multiple element children, only the first non-comment child receives the merged attrs; the others render as-is.
- **The slot child's `ref` is dropped** — keep template refs on the wrapper itself (via `usePrimitiveElement` below), not on the slot child.

`asChild` is the same pattern Radix / Reka popularized: it lets a themable component render *as* a `<RouterLink>`, `<NuxtLink>`, custom `<a>`, or any other DOM element without duplicating the component's styling for each variant.

### Authoring a themable component with `<VCPrimitive>`

The Card compound in `@vuecs/elements` is the canonical reference:

```vue
<!-- packages/elements/src/components/card/Card.vue (excerpt) -->
<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import { themableProps, useComponentTheme, useThemeProps, VCPrimitive } from '@vuecs/core';
import { cardThemeDefaults } from './theme';
import type { CardThemeClasses, CardVariant } from './types';

const cardProps = {
    variant: { type: String as PropType<CardVariant>, default: undefined },
    as: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    ...themableProps<CardThemeClasses>(),
};

export default defineComponent({
    name: 'VCCard',
    inheritAttrs: false,
    props: cardProps,
    setup(props, { attrs, slots }) {
        const themeProps = useThemeProps(props, 'variant');
        const theme = useComponentTheme('card', themeProps, cardThemeDefaults);

        return () => h(
            VCPrimitive,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
```

What this gives a consumer:

```vue
<!-- Default card -->
<VCCard variant="outline">…</VCCard>

<!-- Card rendered as a router link -->
<VCCard variant="outline" as-child>
    <RouterLink :to="`/article/${id}`">…</RouterLink>
</VCCard>
```

Both inherit the resolved theme class `theme.value.root` on the final element. The same pattern applies to any themable component you build — declare `as` + `asChild` props, forward them onto `<VCPrimitive>`, and the consumer can compose your themed element onto whatever DOM root they need.

See [Build Your Own Themable Component](/guide/build-themable-component) for the full walkthrough including `<VCPrimitive>` integration.

## `usePrimitiveElement()`

A small composable that resolves a template ref through the `#text` / `#comment` placeholder $el nodes Vue creates when a component renders via `<template>` (the path `<VCPrimitive :as-child>` takes internally). Use this when you need a reactive handle to the rendered DOM element from a themable wrapper.

```vue
<script lang="ts">
import { defineComponent, h, onMounted } from 'vue';
import { usePrimitiveElement, VCPrimitive } from '@vuecs/core';

export default defineComponent({
    setup() {
        const { primitiveElement, currentElement } = usePrimitiveElement();

        onMounted(() => {
            // currentElement.value is the real <button> or <a>, even when
            // the consumer passed `:as-child` and a custom slot child.
            console.log(currentElement.value?.tagName);
        });

        return () => h(VCPrimitive, { ref: primitiveElement, asChild: true });
    },
});
</script>
```

### Return shape

```ts
function usePrimitiveElement<T extends ComponentPublicInstance>(): {
    /** Bind as `:ref` on the rendered element. */
    primitiveElement: Ref<T | undefined>;
    /** Reactive handle to the underlying HTMLElement, walking past template placeholders. */
    currentElement: ComputedRef<HTMLElement | null | undefined>;
};
```

For most wrappers — the ones that just need to expose the inner ref to the parent — reach for [`useForwardExpose()`](/guide/composables#useforwardexpose) instead; it threads `forwardRef` + `currentElement` + the wrapper's own props onto the wrapper's exposed instance in one call. `usePrimitiveElement` is the slimmer building block underneath, useful when you only need `currentElement` and don't want to expose anything else.

## Relationship to Reka UI

`<VCPrimitive>` is a port of Reka UI's `Primitive` — same behaviour, same defaults, same self-closing-tag short-circuit. The port lives in `@vuecs/core` so:

- `@vuecs/core` keeps zero runtime deps beyond Vue 3.
- Component libraries that build on top of vuecs can author themable elements without taking a direct `reka-ui` peer dep.
- The vuecs surface stays a single contract — themed Reka primitives (DialogContent, PopoverContent, StepperRoot, …) keep wrapping their themed Reka counterparts internally, while the bare `Primitive` is owned by vuecs.

Why a port instead of re-exporting Reka's `Primitive`? A re-export would add `reka-ui` as a runtime dep on `@vuecs/core` and transitively on every package in the workspace. The port is ~80 lines total (`Primitive` + `Slot` + `renderSlotFragments` + `usePrimitiveElement`) and rarely changes upstream.

If you're already on `reka-ui` and want its `Primitive` directly, nothing stops you — vuecs's overlays / forms / pagination / etc. wrap themed Reka primitives that internally use Reka's own `Primitive`. `<VCPrimitive>` exists for the themable-element authoring path that doesn't otherwise touch Reka.

## See also

- [Build Your Own Themable Component](/guide/build-themable-component) — full walkthrough that composes `<VCPrimitive>` with `useComponentTheme` to build a themable `<MyDataTable>`
- [Theme System](/guide/theme-system) — the four-layer resolution chain
- [Composables](/guide/composables) — `useForwardProps`, `useForwardExpose`, and the rest of the in-tree Reka-ported composables
