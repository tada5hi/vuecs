import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { Component, PropType } from 'vue';
import type { CountdownThemeClasses } from './types';

export const countdownProps = {
    autoStart: { type: Boolean, default: true },
    emitEvents: { type: Boolean, default: true },
    interval: {
        type: Number,
        default: 1000,
        validator: (value: number) => value >= 0,
    },
    now: { type: Function as PropType<() => number>, default: () => Date.now() },
    /**
     * Element or component to render as. Pass a string tag (`'span'`,
     * `'div'`) or a component (`RouterLink` / `NuxtLink`).
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'span' },
    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    time: {
        type: Number,
        default: 0,
        validator: (value: number) => value >= 0,
    },
    themeClass: { type: Object as PropType<ThemeClassesOverride<CountdownThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};
