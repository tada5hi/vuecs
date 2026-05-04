<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { StepperTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { stepperThemeDefaults } from './theme';
import type { StepperThemeClasses } from './types';

const stepperTriggerProps = {
    /** Render the consumer's slot child as the trigger root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** HTML tag to render. */
    as: { type: String, default: 'button' },
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
        const theme = useComponentTheme('stepper', props, stepperThemeDefaults);
        return () => h(
            StepperTrigger,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.trigger || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
