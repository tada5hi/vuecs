<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import { useFormInputThemeProps } from '../form-group/context';
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
    toRef,
    watch,
} from 'vue';
import type { FormOption } from '../../types/types';
import FormRadio from '../form-radio/FormRadio.vue';
import { provideFormRadioGroupContext } from './context';

export type FormRadioGroupThemeClasses = {
    root: string;
    /**
     * Root classes used INSTEAD of `root` when `segmented` is set (the
     * button bar). A separate slot so the stacked `root` resolves exactly
     * as before for non-segmented groups.
     */
    segmented: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public type name and declaration merging.
    interface ThemeElements {
        formRadioGroup?: ThemeElementDefinition<FormRadioGroupThemeClasses>;
    }
}

export const formRadioGroupThemeDefaults: ComponentThemeDefinition<FormRadioGroupThemeClasses> = {
    classes: {
        root: 'vc-form-radio-group',
        segmented: 'vc-form-radio-group',
    },
};

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
    /** Vuecs convention: render the options as a segmented button bar (label inside each radio, no indicator). Forces a horizontal orientation. */
    segmented: { type: Boolean, default: false },
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
        const theme = useComponentTheme('formRadioGroup', useFormInputThemeProps({
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                return props.themeVariant;
            },
        }), formRadioGroupThemeDefaults);

        provideFormRadioGroupContext({
            segmented: toRef(props, 'segmented'),
            // Only segmented items inherit the group's size.
            size: () => (props.segmented ? props.themeVariant?.size : undefined),
        });

        // Reka re-emits the current value when the checked item is
        // clicked again; a same-value update is never useful, so drop it.
        //
        // Rule for "the current value":
        // - `modelValue !== undefined` → controlled: compare against the
        //   prop. A parent that rejects a change keeps the prop, so the
        //   next click on the same option emits again.
        // - `modelValue === undefined` → uncontrolled (or a cleared
        //   controlled model): compare against the value we last emitted.
        //   Any parent-side change to `modelValue` (incl. a reset to
        //   `undefined`) clears that tracker, so re-selecting after a
        //   reset emits.
        let lastEmitted: AcceptableValue | undefined;

        watch(() => props.modelValue, () => {
            lastEmitted = undefined;
        });

        const onUpdate = (value: AcceptableValue) => {
            const current = props.modelValue === undefined ? lastEmitted : props.modelValue;

            if (value === current) {
                return;
            }

            lastEmitted = value;
            emit('update:modelValue', value);
        };

        return () => h(
            RadioGroupRoot,
            mergeProps(attrs, {
                name: props.name,
                orientation: props.segmented ? 'horizontal' : props.orientation,
                modelValue: props.modelValue,
                disabled: props.disabled,
                required: props.required,
                loop: props.loop,
                'onUpdate:modelValue': onUpdate,
                // Structural hook (`.vc-form-radio-group[data-segmented]`)
                // that survives theme variants replacing the root classes.
                'data-segmented': props.segmented ? '' : undefined,
                class: (props.segmented ? theme.value.segmented : theme.value.root) || undefined,
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
