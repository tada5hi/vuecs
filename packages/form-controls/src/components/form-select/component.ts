import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import type { PropType, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormSelectOption = {
    id: string | number;
    value: unknown;
    disabled?: boolean;
};

export type FormSelectThemeClasses = {
    root: string;
};

export type FormSelectDefaults = {
    optionDefault: boolean;
    optionDefaultId: string | number;
    optionDefaultValue: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSelect?: ThemeElementDefinition<FormSelectThemeClasses>;
    }
    interface ComponentDefaults {
        formSelect?: ComponentDefaultValues<FormSelectDefaults>;
    }
}

const themeDefaults = { classes: { root: '' } };

const behavioralDefaults: FormSelectDefaults = {
    optionDefault: true,
    optionDefaultId: '',
    optionDefaultValue: '-- Select --',
};

export const VCFormSelect = defineComponent({
    name: 'VCFormSelect',
    props: {
        modelValue: { type: String, default: '' },
        options: { type: Object as PropType<FormSelectOption[]>, required: true },
        optionDefault: { type: Boolean, default: undefined },
        optionDefaultId: { type: [String, Number], default: undefined },
        optionDefaultValue: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormSelectThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formSelect', props, themeDefaults);
        const defaults = useComponentDefaults('formSelect', props, behavioralDefaults);

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const children: VNodeChild[] = [];

            if (resolvedDefaults.optionDefault) {
                children.push(h('option', { value: resolvedDefaults.optionDefaultId }, [resolvedDefaults.optionDefaultValue]));
            }

            for (let i = 0; i < props.options.length; i++) {
                children.push(h('option', {
                    key: props.options[i].id,
                    value: props.options[i].id,
                    selected: props.options[i].id === props.modelValue,
                    disabled: props.options[i].disabled,
                }, [`${props.options[i].value}`]));
            }

            return h('select', mergeProps({
                class: resolved.root || undefined,
                onChange($event: any) {
                    const $$selectedVal = Array.prototype.filter.call(
                        $event.target.options,
                        (o: any) => o.selected,
                    ).map((o: any) => ('_value' in o ? o._value : o.value));

                    const value = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
                    emit('update:modelValue', value);
                },
                ...(typeof props.modelValue !== 'undefined' ? { value: props.modelValue } : {}),
            }, attrs), children);
        };
    },
});
