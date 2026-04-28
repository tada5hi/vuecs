<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import type { PropType, SlotsType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormCheckboxThemeClasses = {
    root: string;
    indicator: string;
    label: string;
    group: string;
};

export type FormCheckboxDefaults = {
    labelContent: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formCheckbox?: ThemeElementDefinition<FormCheckboxThemeClasses>;
    }
    interface ComponentDefaults {
        formCheckbox?: ComponentDefaultValues<FormCheckboxDefaults>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-form-checkbox',
        indicator: 'vc-form-checkbox-indicator',
        label: 'vc-form-checkbox-label',
        // See FormRadio.vue — collides with `vc-form-checkbox-group`
        // used by `<VCFormCheckboxGroup>` (column layout).
        group: 'vc-form-checkbox-wrapper',
    },
};

const behavioralDefaults: FormCheckboxDefaults = { labelContent: 'Input' };

export type FormCheckboxLabelSlotProps = {
    class: string;
    id: string;
};

export type FormCheckboxIndicatorSlotProps = {
    class: string;
};

export type FormCheckboxModelValue = boolean | 'indeterminate' | null;

export default defineComponent({
    name: 'VCFormCheckbox',
    inheritAttrs: false,
    props: {
        modelValue: {
            type: [Boolean, String] as PropType<FormCheckboxModelValue>,
            default: undefined,
        },
        value: { type: [String, Number, Boolean, Object] as PropType<unknown>, default: undefined },
        disabled: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        name: { type: String, default: undefined },
        id: { type: String, default: undefined },
        label: { type: Boolean, default: true },
        labelContent: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormCheckboxThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        label: FormCheckboxLabelSlotProps;
        indicator: FormCheckboxIndicatorSlotProps;
    }>,
    setup(props, {
        attrs,
        emit,
        slots,
    }) {
        const theme = useComponentTheme('formCheckbox', props, themeDefaults);
        const defaults = useComponentDefaults('formCheckbox', props, behavioralDefaults);
        const fallbackId = `vc-form-checkbox-${(Math.random() + 1).toString(36).substring(7)}`;

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const id = props.id ?? fallbackId;

            const checkbox = h(
                CheckboxRoot,
                mergeProps(attrs, {
                    id,
                    modelValue: props.modelValue ?? false,
                    value: props.value,
                    disabled: props.disabled,
                    required: props.required,
                    name: props.name,
                    'onUpdate:modelValue': (value: FormCheckboxModelValue) => emit('update:modelValue', value),
                    class: resolved.root || undefined,
                }),
                {
                    default: () => h(
                        CheckboxIndicator,
                        { class: resolved.indicator || undefined },
                        { default: () => slots.indicator?.({ class: resolved.indicator }) ?? '' },
                    ),
                },
            );

            if (!props.label) {
                return checkbox;
            }

            const labelNode = slots.label ?
                slots.label({ class: resolved.label, id }) :
                h('label', { class: resolved.label || undefined, for: id }, [resolvedDefaults.labelContent]);

            return h('div', { class: resolved.group || undefined }, [checkbox, labelNode]);
        };
    },
});
</script>
