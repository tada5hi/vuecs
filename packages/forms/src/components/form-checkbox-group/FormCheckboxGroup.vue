<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { CheckboxGroupRoot } from 'reka-ui';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormCheckboxGroupThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formCheckboxGroup?: ThemeElementDefinition<FormCheckboxGroupThemeClasses>;
    }
}

const themeDefaults = { classes: { root: 'vc-form-checkbox-group' } };

export type FormCheckboxGroupOrientation = 'vertical' | 'horizontal';

const formCheckboxGroupProps = {
    /** Controlled array of selected values. */
    modelValue: { type: Array as PropType<unknown[]>, default: undefined },
    /** Disables every checkbox in the group. */
    disabled: { type: Boolean, default: false },
    /** Marks the group as required for native form validation. */
    required: { type: Boolean, default: false },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Vuecs convention: vertical-stacked layout (Reka leaves this unset; the column layout is what `vc-form-checkbox-group` styles for). */
    orientation: {
        type: String as PropType<FormCheckboxGroupOrientation>,
        default: 'vertical',
    },
    /** Vuecs convention: arrow-key navigation wraps (Reka has no default). */
    loop: { type: Boolean, default: true },
    /** When `false`, disables roving focus on group items. */
    rovingFocus: { type: Boolean, default: true },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormCheckboxGroupThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormCheckboxGroupProps = ExtractPublicPropTypes<typeof formCheckboxGroupProps>;

export default defineComponent({
    name: 'VCFormCheckboxGroup',
    inheritAttrs: false,
    props: formCheckboxGroupProps,
    emits: ['update:modelValue'],
    setup(props, {
        attrs,
        emit,
        slots,
    }) {
        const theme = useComponentTheme('formCheckboxGroup', props, themeDefaults);

        return () => h(
            CheckboxGroupRoot,
            mergeProps(attrs, {
                name: props.name,
                orientation: props.orientation,
                loop: props.loop,
                modelValue: props.modelValue,
                disabled: props.disabled,
                required: props.required,
                rovingFocus: props.rovingFocus,
                'onUpdate:modelValue': (value: unknown[]) => emit('update:modelValue', value),
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
