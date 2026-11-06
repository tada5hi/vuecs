import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { Component, PropType } from 'vue';
import type {
    ButtonColor,
    ButtonSize,
    ButtonThemeClasses,
    ButtonVariant,
} from './types';

export const buttonProps = {
    color: { type: String as PropType<ButtonColor>, default: undefined },
    variant: { type: String as PropType<ButtonVariant>, default: undefined },
    size: { type: String as PropType<ButtonSize>, default: undefined },
    type: { type: String, default: 'button' },
    /**
     * Element or component to render as. Pass a string tag (`'a'`, `'div'`)
     * or a component (`RouterLink` / `NuxtLink`) to render a button-styled
     * link / arbitrary element. Native `type` / `disabled` semantics apply
     * only when this resolves to `'button'`; every other target is disabled
     * via `aria-disabled` + `tabindex="-1"` + a capture-phase click guard
     * that blocks activation (so a disabled button-link can't navigate).
     * Extra attrs (`to`, `href`, `target`, …) forward to the rendered
     * element.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /**
     * @deprecated Use `as` instead. Retained as a non-breaking alias — when
     * set it takes precedence over `as`.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    label: { type: String, default: undefined },
    iconLeft: { type: String, default: undefined },
    iconRight: { type: String, default: undefined },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ButtonThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};
