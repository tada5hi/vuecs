import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import { 
    defineComponent, 
    h, 
    mergeProps, 
    toRef, 
} from 'vue';

export type FormInputThemeClasses = {
    root: string;
    group: string;
    groupAppend: string;
    groupPrepend: string;
};

const themeDefaults: FormInputThemeClasses = {
    root: '',
    group: '',
    groupAppend: '',
    groupPrepend: '',
};

export const VCFormInput = defineComponent({
    name: 'VCFormInput',
    props: {
        modelValue: { type: String, default: '' },
        type: { type: String, default: 'text' },
        group: { type: Boolean, default: false },
        groupPrepend: { type: Boolean, default: false },
        groupPrependContent: { type: String, default: undefined },
        groupAppend: { type: Boolean, default: false },
        groupAppendContent: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormInputThemeClasses>>, default: undefined },
    },
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        groupAppend: { class: string; tag: string };
        groupPrepend: { class: string; tag: string };
    }>,
    setup(props, {
        attrs, 
        emit, 
        slots, 
    }) {
        const theme = useComponentTheme('formInput', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const resolved = theme.value;
            const children: VNodeChild[] = [];

            // Group prepend
            if (slots.groupPrepend) {
                children.push(slots.groupPrepend({ class: resolved.groupPrepend, tag: 'div' }));
            } else if (props.groupPrepend) {
                children.push(h('div', { class: resolved.groupPrepend || undefined }, [props.groupPrependContent]));
            }

            // Input element
            children.push(h('input', mergeProps({
                type: props.type,
                class: resolved.root || undefined,
                onInput($event: any) {
                    if ($event.target.composing) return;
                    emit('update:modelValue', $event.target.value);
                },
                ...(typeof props.modelValue !== 'undefined' ? { value: props.modelValue } : {}),
            }, attrs)));

            // Group append
            if (slots.groupAppend) {
                children.push(slots.groupAppend({ class: resolved.groupAppend, tag: 'div' }));
            } else if (props.groupAppend) {
                children.push(h('div', { class: resolved.groupAppend || undefined }, [props.groupAppendContent]));
            }

            // Wrap in group if needed
            if (children.length > 1 || props.group) {
                return h('div', { class: resolved.group || undefined }, children);
            }

            return children[0];
        };
    },
});
