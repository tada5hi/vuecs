<script lang="ts">
import { useComponentDefaults, useComponentTheme, useId } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui';
import type { AcceptableValue } from 'reka-ui';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormRadioThemeClasses = {
    root: string;
    indicator: string;
    label: string;
    group: string;
};

export type FormRadioDefaults = {
    labelContent: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formRadio?: ThemeElementDefinition<FormRadioThemeClasses>;
    }
    interface ComponentDefaults {
        formRadio?: ComponentDefaultValues<FormRadioDefaults>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-form-radio',
        indicator: 'vc-form-radio-indicator',
        label: 'vc-form-radio-label',
        // `wrapper` (not `group`) — collides with `vc-form-radio-group`
        // used by `<VCFormRadioGroup>` for the multi-radio container,
        // which has `flex-direction: column` and would stack the radio
        // above its label.
        group: 'vc-form-radio-wrapper',
    },
};

const behavioralDefaults: FormRadioDefaults = { labelContent: 'Option' };

export type FormRadioLabelSlotProps = {
    class: string;
    id: string;
};

export type FormRadioIndicatorSlotProps = {
    class: string;
};

const formRadioProps = {
    value: {
        type: [String, Number, Boolean, Object, null] as PropType<AcceptableValue>,
        required: true,
    },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    label: { type: Boolean, default: true },
    labelContent: { type: String, default: undefined },
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormRadioThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormRadioProps = ExtractPublicPropTypes<typeof formRadioProps>;

export default defineComponent({
    name: 'VCFormRadio',
    inheritAttrs: false,
    props: formRadioProps,
    slots: Object as SlotsType<{
        label: FormRadioLabelSlotProps;
        indicator: FormRadioIndicatorSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('formRadio', props, themeDefaults);
        const defaults = useComponentDefaults('formRadio', props, behavioralDefaults);
        // SSR-safe stable id (Vue 3.5's native `useId` under the hood) —
        // see FormCheckbox.vue.
        const fallbackId = useId(undefined, 'vc-form-radio');

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const id = props.id ?? fallbackId;

            const radio = h(
                RadioGroupItem,
                mergeProps(attrs, {
                    id,
                    value: props.value,
                    disabled: props.disabled,
                    required: props.required,
                    class: resolved.root || undefined,
                }),
                {
                    default: () => h(
                        RadioGroupIndicator,
                        { class: resolved.indicator || undefined },
                        { default: () => slots.indicator?.({ class: resolved.indicator }) ?? '' },
                    ),
                },
            );

            if (!props.label) {
                return radio;
            }

            const labelNode = slots.label ?
                slots.label({ class: resolved.label, id }) :
                h('label', { class: resolved.label || undefined, for: id }, [resolvedDefaults.labelContent]);

            return h('div', { class: resolved.group || undefined }, [radio, labelNode]);
        };
    },
});
</script>
