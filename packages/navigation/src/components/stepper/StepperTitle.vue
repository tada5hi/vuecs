<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { StepperTitle } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useStepperContext } from './context';
import { stepperThemeDefaults } from './theme';
import type { StepperThemeClasses } from './types';

const stepperTitleProps = {
    /** Render the consumer's slot child as the title root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** HTML tag to render. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'h4' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<StepperThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type StepperTitleProps = ExtractPublicPropTypes<typeof stepperTitleProps>;

export default defineComponent({
    name: 'VCStepperTitle',
    inheritAttrs: false,
    props: stepperTitleProps,
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
            StepperTitle,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.title || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
