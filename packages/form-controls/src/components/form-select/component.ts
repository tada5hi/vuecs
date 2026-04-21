import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, VNodeChild } from 'vue';
import { 
    defineComponent, 
    h, 
    mergeProps, 
    toRef, 
} from 'vue';

export type FormSelectOption = {
    id: string | number;
    value: unknown;
    disabled?: boolean;
};

export type FormSelectThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSelect?: ThemeClassesOverride<FormSelectThemeClasses>;
    }
}

const themeDefaults: FormSelectThemeClasses = { root: '' };

export const VCFormSelect = defineComponent({
    name: 'VCFormSelect',
    props: {
        modelValue: { type: String, default: '' },
        options: { type: Object as PropType<FormSelectOption[]>, required: true },
        optionDefault: { type: Boolean, default: true },
        optionDefaultId: { type: [String, Number], default: '' },
        optionDefaultValue: { type: String, default: '-- Select --' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormSelectThemeClasses>>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formSelect', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const resolved = theme.value;
            const children: VNodeChild[] = [];

            if (props.optionDefault) {
                children.push(h('option', { value: props.optionDefaultId }, [props.optionDefaultValue]));
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
