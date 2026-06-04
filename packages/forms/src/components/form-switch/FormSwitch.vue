<script lang="ts">
import { useComponentDefaults, useComponentTheme, useId } from '@vuecs/core';
import { useFormInputThemeProps } from '../form-group/context';
import type {
    ComponentDefaultValues,
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { SwitchRoot, SwitchThumb } from 'reka-ui';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormSwitchThemeClasses = {
    root: string;
    thumb: string;
    label: string;
    group: string;
};

export type FormSwitchDefaults = {
    labelContent: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSwitch?: ThemeElementDefinition<FormSwitchThemeClasses>;
    }
    interface ComponentDefaults {
        formSwitch?: ComponentDefaultValues<FormSwitchDefaults>;
    }
}

export const formSwitchThemeDefaults: ComponentThemeDefinition<FormSwitchThemeClasses> = {
    classes: {
        root: 'vc-form-switch',
        thumb: 'vc-form-switch-thumb',
        label: 'vc-form-switch-label',
        // See FormRadio.vue / FormCheckbox.vue — name collision avoidance.
        group: 'vc-form-switch-wrapper',
    },
};

const behavioralDefaults: FormSwitchDefaults = { labelContent: 'Toggle' };

export type FormSwitchLabelSlotProps = {
    class: string;
    id: string;
};

export type FormSwitchThumbSlotProps = {
    class: string;
};

const formSwitchProps = {
    /** Controlled checked state. `null` is accepted as the documented "unset" value. */
    modelValue: { type: [Boolean, null] as PropType<boolean | null | undefined>, default: undefined },
    /** When `true`, prevents the user from interacting with the switch. */
    disabled: { type: Boolean, default: false },
    /** Marks the underlying form field as required. */
    required: { type: Boolean, default: false },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Form-submission value when the switch is on. */
    value: { type: String, default: 'on' },
    /** Element id; falls back to an SSR-safe generated id. */
    id: { type: String, default: undefined },
    /** Vuecs convention: render the label by default. Internal control flow, not forwarded to Reka. */
    label: { type: Boolean, default: true },
    /** Default label text (resolved through DefaultsManager). */
    labelContent: { type: String, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormSwitchThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormSwitchProps = ExtractPublicPropTypes<typeof formSwitchProps>;

export default defineComponent({
    name: 'VCFormSwitch',
    inheritAttrs: false,
    props: formSwitchProps,
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        label: FormSwitchLabelSlotProps;
        thumb: FormSwitchThumbSlotProps;
    }>,
    setup(props, {
        attrs,
        emit,
        slots,
    }) {
        const theme = useComponentTheme('formSwitch', useFormInputThemeProps(props), formSwitchThemeDefaults);
        const defaults = useComponentDefaults('formSwitch', props, behavioralDefaults);
        // SSR-safe stable id (Vue 3.5's native `useId` under the hood) —
        // see FormCheckbox.vue.
        const fallbackId = useId(undefined, 'vc-form-switch');

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const id = props.id ?? fallbackId;

            const switchEl = h(
                SwitchRoot,
                mergeProps(attrs, {
                    id,
                    value: props.value,
                    name: props.name,
                    modelValue: props.modelValue,
                    disabled: props.disabled,
                    required: props.required,
                    'onUpdate:modelValue': (value: boolean) => emit('update:modelValue', value),
                    class: resolved.root || undefined,
                }),
                {
                    default: () => h(
                        SwitchThumb,
                        { class: resolved.thumb || undefined },
                        { default: () => slots.thumb?.({ class: resolved.thumb }) ?? '' },
                    ),
                },
            );

            if (!props.label) {
                return switchEl;
            }

            const labelNode = slots.label ?
                slots.label({ class: resolved.label, id }) :
                h('label', { class: resolved.label || undefined, for: id }, [resolvedDefaults.labelContent]);

            return h('div', { class: resolved.group || undefined }, [switchEl, labelNode]);
        };
    },
});
</script>
