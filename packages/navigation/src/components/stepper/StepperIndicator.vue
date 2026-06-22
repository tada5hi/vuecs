<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { StepperIndicator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useStepperContext } from './context';
import { stepperThemeDefaults } from './theme';
import type { StepperThemeClasses } from './types';

const stepperIndicatorProps = {
    /** Render the consumer's slot child as the indicator root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<StepperThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type StepperIndicatorProps = ExtractPublicPropTypes<typeof stepperIndicatorProps>;

export default defineComponent({
    name: 'VCStepperIndicator',
    inheritAttrs: false,
    props: stepperIndicatorProps,
    setup(props, { attrs, slots }) {
        // Inherit theme-variant (notably `size`) from the parent <VCStepper>
        // so the consumer doesn't have to repeat `:theme-variant` on every
        // indicator. Per-instance `props.themeVariant` still wins.
        const ctx = useStepperContext();
        const themeProps: UseComponentThemeProps<StepperThemeClasses> = {
            get themeClass() { return { ...(ctx?.themeClass() ?? {}), ...(props.themeClass ?? {}) }; },
            get themeVariant() {
                return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) };
            },
        };
        const theme = useComponentTheme('stepper', themeProps, stepperThemeDefaults);
        return () => h(
            StepperIndicator,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.indicator || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
