import type { Component, PropType } from 'vue';
import { themableProps } from '@vuecs/core';
import type {
    PlaceholderAnimation,
    PlaceholderShape,
    PlaceholderSize,
    PlaceholderThemeClasses,
    PlaceholderWrapperThemeClasses,
} from '../types';


export const placeholderProps = {
    /**
     * Width of the bar — either a CSS length (`'100%'`, `'12rem'`)
     * or a number interpreted as a percentage (`50` → `'50%'`).
     * Mirrors `bootstrap-vue-next`'s convention.
     */
    width: { type: [String, Number], default: '100%' },
    /** Size tier — drives bar height via the `size` theme variant. */
    size: { type: String as PropType<PlaceholderSize>, default: undefined },
    /**
     * Shape — `rect` (default rectangle), `pill` (fully-rounded
     * ends — useful for button / badge skeletons), or `circle`
     * (1:1 aspect ratio — combine with a fixed `:width` for avatar
     * skeletons).
     */
    shape: { type: String as PropType<PlaceholderShape>, default: undefined },
    /**
     * Shimmer animation. `wave` and `glow` are the two canonical
     * patterns; `none` disables the animation entirely (e.g. for
     * `prefers-reduced-motion` callers).
     */
    animation: { type: String as PropType<PlaceholderAnimation>, default: 'wave' },
    /**
     * Animation duration. CSS length (`'2s'`, `'500ms'`). Forwarded
     * via `animation-duration` inline style so consumers can speed
     * up / slow down the shimmer per-instance without rewriting
     * the theme.
     */
    duration: { type: String, default: undefined },
    /**
     * Element or component to render as. Defaults to `'span'` (inline-block
     * placeholder bar). Pass a string tag or a component.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'span' },
    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    ...themableProps<PlaceholderThemeClasses>(),
};

export const placeholderWrapperProps = {
    /** When `true`, the `#loading` slot renders; otherwise `#default`. */
    loading: { type: Boolean, default: false },
    /**
     * Element or component to render as. Defaults to `'div'`. Pass a string
     * tag or a component (`RouterLink` / `NuxtLink`).
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    ...themableProps<PlaceholderWrapperThemeClasses>(),
};
