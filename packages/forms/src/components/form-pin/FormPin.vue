<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { PinInputInput, PinInputRoot } from 'reka-ui';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormPinThemeClasses = {
    root: string;
    input: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formPin?: ThemeElementDefinition<FormPinThemeClasses>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-form-pin',
        input: 'vc-form-pin-input',
    },
};

export type FormPinType = 'text' | 'number';
export type FormPinModelValue = string[] | number[];

const formPinProps = {
    modelValue: {
        // `null` in the runtime type alongside Array so consumers can
        // pass `null` (the documented "unset" value) without tripping
        // Vue's prop validation warnings.
        type: [Array, null] as PropType<FormPinModelValue | null>,
        default: undefined,
    },
    /** Number of input cells rendered. */
    length: { type: Number, default: 6 },
    /** `'text'` (default) or `'number'`. Drives both input mode and modelValue array element type. */
    type: { type: String as PropType<FormPinType>, default: 'text' },
    /** Per-cell placeholder character. */
    placeholder: { type: String, default: '' },
    /** When `true`, render values as `<input type="password">` (dots). */
    mask: { type: Boolean, default: false },
    /** Enable mobile OTP autofill (sets `autocomplete="one-time-code"`). */
    otp: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    id: { type: String, default: undefined },
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormPinThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormPinProps = ExtractPublicPropTypes<typeof formPinProps>;

export default defineComponent({
    name: 'VCFormPin',
    inheritAttrs: false,
    props: formPinProps,
    emits: ['update:modelValue', 'complete'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formPin', props, themeDefaults);

        return () => h(
            PinInputRoot,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                type: props.type,
                placeholder: props.placeholder,
                mask: props.mask,
                otp: props.otp,
                disabled: props.disabled,
                required: props.required,
                name: props.name,
                id: props.id,
                'onUpdate:modelValue': (value: FormPinModelValue) => emit('update:modelValue', value),
                onComplete: (value: FormPinModelValue) => emit('complete', value),
                class: theme.value.root || undefined,
            }),
            {
                default: () => {
                    const cells = [];
                    for (let i = 0; i < props.length; i += 1) {
                        cells.push(h(PinInputInput, {
                            key: i,
                            index: i,
                            class: theme.value.input || undefined,
                        }));
                    }
                    return cells;
                },
            },
        );
    },
});
</script>
