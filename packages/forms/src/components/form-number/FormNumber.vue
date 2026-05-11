<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ComponentThemeDefinition,
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
import type { ExtractPublicPropTypes, PropType } from 'vue';
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

export const formNumberThemeDefaults: ComponentThemeDefinition<FormNumberThemeClasses> = {
    classes: {
        root: 'vc-form-number',
        input: 'vc-form-number-input',
        decrement: 'vc-form-number-decrement',
        increment: 'vc-form-number-increment',
    },
};

const formNumberProps = {
    /** Controlled numeric value. `null` is the documented "unset" value. */
    modelValue: { type: [Number, null] as PropType<number | null | undefined>, default: undefined },
    /** Smallest allowed value. */
    min: { type: Number, default: undefined },
    /** Largest allowed value. */
    max: { type: Number, default: undefined },
    /** Increment / decrement step. */
    step: { type: Number, default: 1 },
    /** When `true`, snap typed values to the nearest step. */
    stepSnapping: { type: Boolean, default: true },
    /** Vuecs convention: do NOT focus the input on programmatic value change (Reka defaults to `true`; this avoids surprising focus jumps). */
    focusOnChange: { type: Boolean, default: false },
    /** `Intl.NumberFormat` options for display + parsing. */
    formatOptions: { type: Object as PropType<Intl.NumberFormatOptions>, default: undefined },
    /** BCP-47 locale used for formatting and currency. */
    locale: { type: String, default: undefined },
    /** When `true`, prevents the user from interacting with the field. */
    disabled: { type: Boolean, default: false },
    /** Marks the underlying form field as required. */
    required: { type: Boolean, default: false },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Element id for the root number field. */
    id: { type: String, default: undefined },
    /** Vuecs internal: show ± stepper buttons. Drives the in-template render branch; not forwarded to Reka. */
    steppers: { type: Boolean, default: true },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormNumberThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormNumberProps = ExtractPublicPropTypes<typeof formNumberProps>;

export default defineComponent({
    name: 'VCFormNumber',
    inheritAttrs: false,
    props: formNumberProps,
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formNumber', props, formNumberThemeDefaults);

        return () => h(
            NumberFieldRoot,
            mergeProps(attrs, {
                focusOnChange: props.focusOnChange,
                name: props.name,
                id: props.id,
                modelValue: props.modelValue,
                min: props.min,
                max: props.max,
                step: props.step,
                stepSnapping: props.stepSnapping,
                formatOptions: props.formatOptions,
                locale: props.locale,
                disabled: props.disabled,
                required: props.required,
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
