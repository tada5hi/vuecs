<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { StepperRoot } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { stepperThemeDefaults } from './theme';
import type { StepperThemeClasses } from './types';

const stepperProps = {
    /** Active step (1-based). v-modeled. */
    modelValue: { type: Number, default: undefined },
    /** Initial active step for uncontrolled usage. */
    defaultValue: { type: Number, default: 1 },
    /** Layout direction. */
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    /** Reading direction. Falls back to the ConfigManager's `dir` value when omitted. */
    dir: { type: String as PropType<'ltr' | 'rtl'>, default: undefined },
    /** When `true`, steps must be completed in order — Reka blocks navigation past the next incomplete step. */
    linear: { type: Boolean, default: true },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<StepperThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type StepperProps = ExtractPublicPropTypes<typeof stepperProps>;

export default defineComponent({
    name: 'VCStepper',
    inheritAttrs: false,
    props: stepperProps,
    emits: ['update:modelValue'],
    setup(props, {
        attrs,
        slots,
        emit,
    }) {
        const theme = useComponentTheme('stepper', props, stepperThemeDefaults);
        return () => h(
            StepperRoot,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                defaultValue: props.defaultValue,
                orientation: props.orientation,
                dir: props.dir,
                linear: props.linear,
                'onUpdate:modelValue': (value: number | undefined) => emit('update:modelValue', value),
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
