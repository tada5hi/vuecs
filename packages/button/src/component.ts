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

            if (slots.leading) {
                children.push(h('span', { class: resolved.leading || undefined }, slots.leading(slotProps)));
            } else if (props.iconLeft) {
                children.push(h('span', { class: resolved.leading || undefined }, [
                    h('i', { class: props.iconLeft }),
                ]));
            }

            const labelContent = slots.default ? slots.default(slotProps) : props.label;
            if (labelContent !== undefined && labelContent !== null && labelContent !== '') {
                children.push(h('span', { class: resolved.label || undefined }, labelContent as VNodeArrayChildren));
            }

            if (slots.trailing) {
                children.push(h('span', { class: resolved.trailing || undefined }, slots.trailing(slotProps)));
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
                }, attrs),
                children,
            );
        };
    },
});
