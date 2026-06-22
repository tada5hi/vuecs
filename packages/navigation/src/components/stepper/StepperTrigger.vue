<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { StepperTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useStepperContext } from './context';
import { stepperThemeDefaults } from './theme';
import type { StepperThemeClasses } from './types';

const stepperTriggerProps = {
    /** Render the consumer's slot child as the trigger root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<StepperThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type StepperTriggerProps = ExtractPublicPropTypes<typeof stepperTriggerProps>;

export default defineComponent({
    name: 'VCStepperTrigger',
    inheritAttrs: false,
    props: stepperTriggerProps,
    setup(props, { attrs, slots }) {
        const ctx = useStepperContext();
        const themeProps: UseComponentThemeProps<StepperThemeClasses> = {
            get themeClass() { return { ...(ctx?.themeClass() ?? {}), ...(props.themeClass ?? {}) }; },
            get themeVariant() {
                return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) };
            },
        };
        const theme = useComponentTheme('stepper', themeProps, stepperThemeDefaults);
        return () => h(
            StepperTrigger,
            mergeProps(
                // Default to type="button" only when rendering a real
                // <button>; otherwise it'd submit any wrapping <form>.
                // Consumer's `attrs` still wins because mergeProps gives
                // later objects precedence on `type`.
                props.as === 'button' ? { type: 'button' } : {},
                attrs,
                {
                    as: props.as,
                    asChild: props.asChild,
                    class: theme.value.trigger || undefined,
                },
            ),
            { default: () => slots.default?.() },
        );
    },
});
</script>
