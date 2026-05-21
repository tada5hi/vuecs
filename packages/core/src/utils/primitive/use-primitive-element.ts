import { computed, ref } from 'vue';
import type { ComponentPublicInstance, Ref } from 'vue';

type ElementOrComponent = Element | ComponentPublicInstance | null | undefined;

/**
 * Subset of `@vueuse/core`'s `unrefElement` covering the only case
 * `usePrimitiveElement` needs: a single-level `Ref` whose value is either
 * an `Element`, a `ComponentPublicInstance` (resolved via `$el`), or
 * nullish. VueUse's variant additionally accepts `MaybeRefOrGetter` /
 * nested refs / SVG element shorthands — none of which Vue 3's template
 * `ref` binding can produce here. Inlined so `@vuecs/core` stays zero-dep
 * beyond Vue.
 */
function unrefElement(elRef: Ref<ElementOrComponent>): Element | null | undefined {
    const { value } = elRef;
    if (value == null) {
        return value as null | undefined;
    }
    if ('$el' in value) {
        return (value as ComponentPublicInstance).$el as Element;
    }
    return value as Element;
}

/**
 * Resolves a template ref to the underlying `Element`, skipping past `#text` /
 * `#comment` nodes that show up when the primitive renders a Vue
 * `<template>` (via `asChild`).
 *
 * Mirrors reka-ui's `usePrimitiveElement` (MIT,
 * https://github.com/unovue/reka-ui) with two intentional vuecs deltas:
 * - `unrefElement` is inlined so `@vuecs/core` stays zero-dep beyond Vue.
 * - `currentElement` is typed as `Element | null | undefined` (Reka uses
 *   `HTMLElement`). `VCPrimitive` accepts `as="svg"` from its `AsTag`
 *   union, which resolves to `SVGElement`/`Element`, not `HTMLElement`.
 *   This also matches `useForwardExpose`'s `currentElement` convention.
 */
export function usePrimitiveElement<T extends ComponentPublicInstance>() {
    const primitiveElement = ref<T | null>(null);
    const currentElement = computed<Element | null | undefined>(() => {
        const raw = primitiveElement.value;
        const $el = raw?.$el as Node | null | undefined;
        if ($el && ($el.nodeName === '#text' || $el.nodeName === '#comment')) {
            return ($el as unknown as Element).nextElementSibling;
        }
        return unrefElement(primitiveElement as Ref<ElementOrComponent>);
    });

    return {
        primitiveElement,
        currentElement,
    };
}
