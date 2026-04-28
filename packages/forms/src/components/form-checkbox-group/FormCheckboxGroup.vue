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
    modelValue: { type: Array as PropType<unknown[]>, default: undefined },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    orientation: {
        type: String as PropType<FormCheckboxGroupOrientation>,
        default: 'vertical',
    },
    loop: { type: Boolean, default: true },
    rovingFocus: { type: Boolean, default: true },
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormCheckboxGroupThemeClasses>>, default: undefined },
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
                modelValue: props.modelValue,
                disabled: props.disabled,
                required: props.required,
                name: props.name,
                orientation: props.orientation,
                loop: props.loop,
                rovingFocus: props.rovingFocus,
                'onUpdate:modelValue': (value: unknown[]) => emit('update:modelValue', value),
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
