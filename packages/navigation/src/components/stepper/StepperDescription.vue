<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { StepperDescription } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useStepperContext } from './context';
import { stepperThemeDefaults } from './theme';
import type { StepperThemeClasses } from './types';

const stepperDescriptionProps = {
    /** Render the consumer's slot child as the description root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** HTML tag to render. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'p' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<StepperThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type StepperDescriptionProps = ExtractPublicPropTypes<typeof stepperDescriptionProps>;

export default defineComponent({
    name: 'VCStepperDescription',
    inheritAttrs: false,
    props: stepperDescriptionProps,
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
            StepperDescription,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.description || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
