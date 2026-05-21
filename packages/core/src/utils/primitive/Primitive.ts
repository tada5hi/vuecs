import { defineComponent, h } from 'vue';
import type { Component, PropType } from 'vue';
import { Slot } from './Slot';
import type { AsTag } from './types';

// Self-closing tags can't carry a default slot under SSR hydration — Reka
// special-cases the same list. Keep the source of truth here so it doesn't
// drift if the upstream list changes.
const SELF_CLOSING_TAGS = ['area', 'img', 'input'];

/**
 * Generic `as` / `asChild` building block for themable elements.
 *
 * Ported from reka-ui's `Primitive` (MIT, https://github.com/unovue/reka-ui)
 * so `@vuecs/core` keeps zero runtime deps beyond Vue 3 — downstream component
 * libraries that build on top of vuecs use this without taking a direct
 * `reka-ui` dependency.
 *
 * - `as="span"` (etc) renders the named tag. Defaults to `"div"`.
 * - `as={Component}` renders the given Vue component.
 * - `asChild` switches to slot-merge mode: the first non-comment slot child
 *   is cloned and the wrapper's attrs are merged onto it (consumer's child
 *   props win on conflict).
 * - Self-closing tags (`area`, `img`, `input`) short-circuit the default slot
 *   to avoid an SSR hydration mismatch.
 */
export const VCPrimitive = defineComponent({
    name: 'VCPrimitive',
    inheritAttrs: false,
    props: {
        asChild: {
            type: Boolean,
            default: false,
        },
        as: {
            type: [String, Object] as PropType<AsTag | Component>,
            default: 'div',
        },
    },
    setup(props, { attrs, slots }) {
        const asTag = props.asChild ? 'template' : props.as;

        if (typeof asTag === 'string' && SELF_CLOSING_TAGS.includes(asTag)) {
            return () => h(asTag, attrs);
        }

        if (asTag !== 'template') {
            return () => h(props.as, attrs, { default: slots.default });
        }

        return () => h(Slot, attrs, { default: slots.default });
    },
});
