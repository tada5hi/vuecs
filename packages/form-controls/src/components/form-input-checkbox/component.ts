import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import { 
    defineComponent, 
    h, 
    mergeProps, 
    toRef, 
} from 'vue';

export type FormInputCheckboxThemeClasses = {
    root: string;
    label: string;
    group: string;
};

const themeDefaults: FormInputCheckboxThemeClasses = {
    root: '',
    label: '',
    group: '',
};

export type FormInputCheckboxLabelSlotProps = {
    class: string;
    id: string;
};

export const VCFormInputCheckbox = defineComponent({
    name: 'VCFormInputCheckbox',
    props: {
        modelValue: { type: [Object, Boolean, String, Number, Array] as PropType<unknown | unknown[]> },
        group: { type: Boolean, default: false },
        label: { type: Boolean, default: true },
        labelContent: { type: String, default: 'Input' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormInputCheckboxThemeClasses>>, default: undefined },
    },
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        label: FormInputCheckboxLabelSlotProps;
    }>,
    setup(props, {
        attrs, 
        emit, 
        slots, 
    }) {
        const theme = useComponentTheme('formInputCheckbox', toRef(props, 'themeClass'), themeDefaults);
        const id = (Math.random() + 1).toString(36).substring(7);

        return () => {
            const resolved = theme.value;
            const rawValue = props.modelValue;

            let isChecked: boolean | undefined;
            let index: number = -1;

            if (typeof rawValue !== 'undefined') {
                if (Array.isArray(rawValue)) {
                    if (typeof attrs.value !== 'undefined') {
                        index = rawValue.indexOf(attrs.value);
                        isChecked = index !== -1;
                    }
                } else {
                    isChecked = !!rawValue;
                }
            }

            const element = h('input', mergeProps({
                id,
                type: 'checkbox',
                class: resolved.root || undefined,
                onInput($event: any) {
                    if ($event.target.composing) return;

                    if (Array.isArray(rawValue)) {
                        const copy = [...rawValue];
                        if (typeof attrs.value !== 'undefined') {
                            if (index === -1) {
                                copy.push(attrs.value);
                            } else {
                                copy.splice(index, 1);
                            }
                        }
                        emit('update:modelValue', copy);
                    } else {
                        emit('update:modelValue', !rawValue);
                    }
                },
                ...(typeof isChecked === 'boolean' ? { checked: isChecked } : {}),
            }, attrs));

            if (props.label || props.group) {
                const children: VNodeChild[] = [];

                if (props.label) {
                    if (slots.label) {
                        children.push(slots.label({ class: resolved.label, id }));
                    } else {
                        children.push(h('label', { class: resolved.label || undefined, for: id }, [props.labelContent]));
                    }
                }

                children.push(element);

                return h('div', { class: resolved.group || undefined }, children);
            }

            return element;
        };
    },
});
