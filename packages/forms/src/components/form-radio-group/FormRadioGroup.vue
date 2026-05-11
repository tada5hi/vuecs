<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { RadioGroupRoot } from 'reka-ui';
import type { AcceptableValue } from 'reka-ui';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type { FormOption } from '../../types/option';
import FormRadio from '../form-radio/FormRadio.vue';

export type FormRadioGroupThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formRadioGroup?: ThemeElementDefinition<FormRadioGroupThemeClasses>;
    }
}

export const formRadioGroupThemeDefaults: ComponentThemeDefinition<FormRadioGroupThemeClasses> = { classes: { root: 'vc-form-radio-group' } };

export type FormRadioGroupOrientation = 'vertical' | 'horizontal';

const formRadioGroupProps = {
    /** Controlled selected value. */
    modelValue: {
        type: [String, Number, Boolean, Object, null] as PropType<AcceptableValue | undefined>,
        default: undefined,
    },
    /** Optional declarative shorthand — when set, renders one `<VCFormRadio>` per option. Mutually exclusive with the default slot. */
    options: { type: Array as PropType<FormOption[]>, default: undefined },
    /** Disables every radio in the group. */
    disabled: { type: Boolean, default: false },
    /** Marks the group as required for native form validation. */
    required: { type: Boolean, default: false },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Vuecs convention: vertical-stacked layout (Reka leaves this unset; vuecs styles the column variant in `vc-form-radio-group`). */
    orientation: {
        type: String as PropType<FormRadioGroupOrientation>,
        default: 'vertical',
    },
    /** When `true`, arrow-key navigation wraps from last to first item. */
    loop: { type: Boolean, default: true },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormRadioGroupThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormRadioGroupProps = ExtractPublicPropTypes<typeof formRadioGroupProps>;

export default defineComponent({
    name: 'VCFormRadioGroup',
    inheritAttrs: false,
    props: formRadioGroupProps,
    emits: ['update:modelValue'],
    setup(props, {
        attrs,
        emit,
        slots,
    }) {
        const theme = useComponentTheme('formRadioGroup', props, formRadioGroupThemeDefaults);

        return () => h(
            RadioGroupRoot,
            mergeProps(attrs, {
                name: props.name,
                orientation: props.orientation,
                modelValue: props.modelValue,
                disabled: props.disabled,
                required: props.required,
                loop: props.loop,
                'onUpdate:modelValue': (value: AcceptableValue) => emit('update:modelValue', value),
                class: theme.value.root || undefined,
            }),
            {
                default: () => {
                    if (props.options) {
                        return props.options.map((option) => h(FormRadio, {
                            key: String(option.value),
                            value: option.value,
                            disabled: option.disabled,
                            labelContent: option.label,
                        }));
                    }
                    return slots.default?.();
                },
            },
        );
    },
});
</script>
