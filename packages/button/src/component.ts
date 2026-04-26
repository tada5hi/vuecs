import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    ThemeElementDefinition,
    UseComponentThemeProps,
    VariantValues,
} from '@vuecs/core';
import type { PropType, SlotsType, VNodeArrayChildren } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type {
    ButtonColor,
    ButtonSize,
    ButtonSlotProps,
    ButtonThemeClasses,
    ButtonVariant,
} from './type';

declare module '@vuecs/core' {
    interface ThemeElements {
        button?: ThemeElementDefinition<ButtonThemeClasses>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-button',
        leading: 'vc-button-leading',
        trailing: 'vc-button-trailing',
        label: 'vc-button-label',
    },
};

export const VCButton = defineComponent({
    name: 'VCButton',
    props: {
        color: { type: String as PropType<ButtonColor>, default: undefined },
        variant: { type: String as PropType<ButtonVariant>, default: undefined },
        size: { type: String as PropType<ButtonSize>, default: undefined },
        type: { type: String, default: 'button' },
        tag: { type: String, default: 'button' },
        label: { type: String, default: undefined },
        iconLeft: { type: String, default: undefined },
        iconRight: { type: String, default: undefined },
        loading: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ButtonThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    slots: Object as SlotsType<{
        default: ButtonSlotProps;
        leading: ButtonSlotProps;
        trailing: ButtonSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        // The convenience props (color/variant/size/loading) are merged into
        // themeVariant before resolution so themes can drive slot classes off
        // them via the standard variant system. Getter properties keep this
        // reactive — Vue's computed() inside useComponentTheme tracks the
        // underlying prop reads.
        const themeProps: UseComponentThemeProps<ButtonThemeClasses> = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                return {
                    ...(props.themeVariant ?? {}),
                    ...(props.color !== undefined ? { color: props.color } : {}),
                    ...(props.variant !== undefined ? { variant: props.variant } : {}),
                    ...(props.size !== undefined ? { size: props.size } : {}),
                    ...(props.loading ? { loading: true } : {}),
                };
            },
        };

        const theme = useComponentTheme('button', themeProps, themeDefaults);

        return () => {
            const resolved = theme.value;
            const isDisabled = props.disabled || props.loading;
            const slotProps: ButtonSlotProps = {
                loading: props.loading,
                disabled: isDisabled,
            };

            const children: VNodeArrayChildren = [];

            // Empty slot results (`<template #leading />` returning []) used to
            // emit a wrapper <span> with no children — functionally inert but
            // dead markup. Coerce slot output to non-empty before pushing.
            const isNonEmptySlot = (out: unknown): out is VNodeArrayChildren => Array.isArray(out) && out.length > 0;

            // When loading, the leading slot becomes a spinner — universally
            // legible loading affordance, replaces any consumer-provided icon
            // for the duration of the in-flight work. Without this the only
            // signal was a faint opacity/cursor change that read identical to
            // the disabled state on most themes.
            //
            // Accessibility: the spinner glyph is `aria-hidden` (it's
            // decorative — the visual is the spinning ring) but we wrap it
            // alongside a visually-hidden "Loading" label so screen readers
            // announce the busy state. Combined with `aria-busy="true"` on
            // the root (set below), AT users get a clear "in progress"
            // signal instead of the indistinct "disabled" the native
            // `disabled` attribute would otherwise convey on its own.
            if (props.loading) {
                children.push(h('span', { class: resolved.leading || undefined }, [
                    h('span', { class: 'vc-button-spinner', 'aria-hidden': 'true' }),
                    h('span', { class: 'vc-sr-only' }, 'Loading'),
                ]));
            } else if (slots.leading) {
                const leadingOut = slots.leading(slotProps);
                if (isNonEmptySlot(leadingOut)) {
                    children.push(h('span', { class: resolved.leading || undefined }, leadingOut));
                }
            } else if (props.iconLeft) {
                children.push(h('span', { class: resolved.leading || undefined }, [
                    h('i', { class: props.iconLeft }),
                ]));
            }

            const slotLabel = slots.default ? slots.default(slotProps) : undefined;
            if (isNonEmptySlot(slotLabel)) {
                children.push(h('span', { class: resolved.label || undefined }, slotLabel));
            } else if (typeof props.label === 'string' && props.label !== '') {
                children.push(h('span', { class: resolved.label || undefined }, props.label));
            }

            if (slots.trailing) {
                const trailingOut = slots.trailing(slotProps);
                if (isNonEmptySlot(trailingOut)) {
                    children.push(h('span', { class: resolved.trailing || undefined }, trailingOut));
                }
            } else if (props.iconRight) {
                children.push(h('span', { class: resolved.trailing || undefined }, [
                    h('i', { class: props.iconRight }),
                ]));
            }

            const isNativeButton = props.tag === 'button';

            return h(
                props.tag,
                mergeProps({
                    class: [
                        resolved.root || undefined,
                        // Structural busy class — themes layer their own look,
                        // but every theme gets a consistent loading affordance
                        // (wait cursor + opacity pulse) without redeclaring it.
                        // `disabled` blocks pointer events on native buttons,
                        // which would defeat `cursor: wait`; the CSS handles
                        // that by scoping `cursor: wait` only when the busy
                        // class is set and avoids `pointer-events: none`.
                        props.loading ? 'vc-button--busy' : undefined,
                    ],
                    ...(isNativeButton ? { type: props.type } : {}),
                    ...(isNativeButton ? { disabled: isDisabled || undefined } : {}),
                    ...(!isNativeButton && isDisabled ? { 'aria-disabled': 'true' } : {}),
                    // Distinguish loading from plain `disabled` for AT —
                    // both still set `disabled` (loading must block clicks
                    // to prevent double-submit), but `aria-busy` lets screen
                    // readers announce "busy" rather than just "disabled".
                    ...(props.loading ? { 'aria-busy': 'true' } : {}),
                }, attrs),
                children,
            );
        };
    },
});
