<script lang="ts">
import { useComponentDefaults, useComponentTheme, useId } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { SwitchRoot, SwitchThumb } from 'reka-ui';
import type { PropType, SlotsType } from 'vue';
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

const themeDefaults = {
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

export default defineComponent({
    name: 'VCFormSwitch',
    inheritAttrs: false,
    props: {
        // `null` in the runtime type alongside Boolean so consumers can pass
        // `null` (the documented "unset" value) without tripping Vue's prop
        // validation warnings.
        modelValue: { type: [Boolean, null] as PropType<boolean | null | undefined>, default: undefined },
        disabled: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        name: { type: String, default: undefined },
        value: { type: String, default: undefined },
        id: { type: String, default: undefined },
        label: { type: Boolean, default: true },
        labelContent: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormSwitchThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
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
        const theme = useComponentTheme('formSwitch', props, themeDefaults);
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
                    disabled: props.disabled,
                    required: props.required,
                    name: props.name,
                    'onUpdate:modelValue': (value: boolean) => emit('update:modelValue', value),
                    class: resolved.root || undefined,
                    // Forward `modelValue` only when explicitly set —
                    // pass-through preserves `null` (Reka's documented
                    // "uncontrolled / unset" value); coercing to `false`
                    // would silently change the consumer's input.
                    ...(props.modelValue !== undefined ? { modelValue: props.modelValue } : {}),
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
