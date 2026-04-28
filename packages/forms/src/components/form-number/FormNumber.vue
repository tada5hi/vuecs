<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import {
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
    NumberFieldRoot,
} from 'reka-ui';
import type { PropType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormNumberThemeClasses = {
    root: string;
    input: string;
    decrement: string;
    increment: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formNumber?: ThemeElementDefinition<FormNumberThemeClasses>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-form-number',
        input: 'vc-form-number-input',
        decrement: 'vc-form-number-decrement',
        increment: 'vc-form-number-increment',
    },
};

export default defineComponent({
    name: 'VCFormNumber',
    inheritAttrs: false,
    props: {
        modelValue: { type: Number as PropType<number | null | undefined>, default: undefined },
        min: { type: Number, default: undefined },
        max: { type: Number, default: undefined },
        step: { type: Number, default: 1 },
        stepSnapping: { type: Boolean, default: true },
        focusOnChange: { type: Boolean, default: false },
        formatOptions: { type: Object as PropType<Intl.NumberFormatOptions>, default: undefined },
        locale: { type: String, default: undefined },
        disabled: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        name: { type: String, default: undefined },
        id: { type: String, default: undefined },
        /** Show ± stepper buttons. Default `true`. */
        steppers: { type: Boolean, default: true },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormNumberThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formNumber', props, themeDefaults);

        return () => h(
            NumberFieldRoot,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                min: props.min,
                max: props.max,
                step: props.step,
                stepSnapping: props.stepSnapping,
                focusOnChange: props.focusOnChange,
                formatOptions: props.formatOptions,
                locale: props.locale,
                disabled: props.disabled,
                required: props.required,
                name: props.name,
                id: props.id,
                'onUpdate:modelValue': (value: number) => emit('update:modelValue', value),
                class: theme.value.root || undefined,
            }),
            {
                default: () => {
                    const children = [];
                    if (props.steppers) {
                        children.push(h(NumberFieldDecrement, { class: theme.value.decrement || undefined }, { default: () => '−' }));
                    }
                    children.push(h(NumberFieldInput, { class: theme.value.input || undefined }));
                    if (props.steppers) {
                        children.push(h(NumberFieldIncrement, { class: theme.value.increment || undefined }, { default: () => '+' }));
                    }
                    return children;
                },
            },
        );
    },
});
</script>
