<script lang="ts">
import { useComponentDefaults, useComponentTheme, useId } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
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

export const formCheckboxThemeDefaults: ComponentThemeDefinition<FormCheckboxThemeClasses> = {
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

const formCheckboxProps = {
    /** Controlled checked state. `null` is accepted as the documented "unset" value. */
    modelValue: {
        type: [Boolean, String, null] as PropType<FormCheckboxModelValue>,
        default: undefined,
    },
    /** Form-submission value when the checkbox is checked. */
    value: { type: [String, Number, Boolean, Object] as PropType<unknown>, default: 'on' },
    /** When `true`, prevents the user from interacting with the checkbox. */
    disabled: { type: Boolean, default: false },
    /** Marks the underlying form field as required. */
    required: { type: Boolean, default: false },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Element id; falls back to an SSR-safe generated id. */
    id: { type: String, default: undefined },
    /** Vuecs convention: render the label by default. Internal control flow, not forwarded to Reka. */
    label: { type: Boolean, default: true },
    /** Default label text (resolved through DefaultsManager). */
    labelContent: { type: String, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormCheckboxThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormCheckboxProps = ExtractPublicPropTypes<typeof formCheckboxProps>;

export default defineComponent({
    name: 'VCFormCheckbox',
    inheritAttrs: false,
    props: formCheckboxProps,
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
        const theme = useComponentTheme('formCheckbox', props, formCheckboxThemeDefaults);
        const defaults = useComponentDefaults('formCheckbox', props, behavioralDefaults);
        // SSR-safe stable id (Vue 3.5's native `useId` under the hood).
        // Replaces a `Math.random()` fallback that caused hydration
        // mismatches and made IDs non-deterministic across renders.
        const fallbackId = useId(undefined, 'vc-form-checkbox');

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const id = props.id ?? fallbackId;

            const checkbox = h(
                CheckboxRoot,
                mergeProps(attrs, {
                    id,
                    value: props.value,
                    name: props.name,
                    modelValue: props.modelValue,
                    disabled: props.disabled,
                    required: props.required,
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
