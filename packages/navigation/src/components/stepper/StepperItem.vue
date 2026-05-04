<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { StepperItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { stepperThemeDefaults } from './theme';
import type { StepperThemeClasses } from './types';

export type StepperItemSlotProps = {
    state: 'active' | 'completed' | 'inactive';
};

const stepperItemProps = {
    /** 1-based step index. Required by Reka — used to determine completion / active state. */
    step: { type: Number, required: true },
    /** Block interaction with this step. */
    disabled: { type: Boolean, default: false },
    /** Force completion state. Reka derives this automatically when `false`. */
    completed: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<StepperThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type StepperItemProps = ExtractPublicPropTypes<typeof stepperItemProps>;

export default defineComponent({
    name: 'VCStepperItem',
    inheritAttrs: false,
    props: stepperItemProps,
    slots: Object as SlotsType<{
        default: StepperItemSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('stepper', props, stepperThemeDefaults);
        return () => h(
            StepperItem,
            // `step` is required on StepperItem; vue-tsc loses that
            // through `mergeProps`'s untyped `Data` return, so we pass
            // it as a direct prop (and merge attrs separately for
            // pass-through HTML attrs / data-* / class composition).
            // The `group` utility scopes child
            // `group-data-[state=...]:` selectors in theme-tailwind so
            // child indicators / titles can react to the parent step's
            // state without explicit attribute wiring on every child.
            {
                step: props.step,
                disabled: props.disabled,
                completed: props.completed,
                ...mergeProps(attrs, { class: ['group', theme.value.item || undefined] }),
            },
            { default: ({ state }: StepperItemSlotProps) => slots.default?.({ state }) },
        );
    },
});
</script>
