<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
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

const themeDefaults = { classes: { root: 'vc-form-radio-group' } };

export type FormRadioGroupOrientation = 'vertical' | 'horizontal';

const formRadioGroupProps = {
    modelValue: {
        type: [String, Number, Boolean, Object, null] as PropType<AcceptableValue | undefined>,
        default: undefined,
    },
    /**
     * Optional declarative shorthand — when set, renders one `<VCFormRadio>`
     * per option. Mutually exclusive with the default slot. Use the slot
     * for full per-item control.
     */
    options: { type: Array as PropType<FormOption[]>, default: undefined },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    orientation: {
        type: String as PropType<FormRadioGroupOrientation>,
        default: 'vertical',
    },
    loop: { type: Boolean, default: true },
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormRadioGroupThemeClasses>>, default: undefined },
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
        const theme = useComponentTheme('formRadioGroup', props, themeDefaults);

        return () => h(
            RadioGroupRoot,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                disabled: props.disabled,
                required: props.required,
                name: props.name,
                orientation: props.orientation,
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
