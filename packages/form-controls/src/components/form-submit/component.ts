import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, VNodeArrayChildren } from 'vue';
import { 
    defineComponent, 
    h, 
    mergeProps, 
    toRef, 
} from 'vue';

export type FormSubmitThemeClasses = {
    root: string;
    createButton: string;
    updateButton: string;
    createIcon: string;
    updateIcon: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSubmit?: ThemeClassesOverride<FormSubmitThemeClasses>;
    }
}

const themeDefaults: FormSubmitThemeClasses = {
    root: '',
    createButton: '',
    updateButton: '',
    createIcon: '',
    updateIcon: '',
};

export const VCFormSubmit = defineComponent({
    name: 'VCFormSubmit',
    props: {
        modelValue: { type: Boolean, default: false },
        icon: { type: Boolean, default: true },
        isEditing: { type: Boolean, default: false },
        busy: { type: Boolean, default: false },
        type: { type: String, default: 'button' },
        createText: { type: String, default: 'Create' },
        updateText: { type: String, default: 'Update' },
        submit: { type: Function as PropType<() => Promise<any> | any> },
        invalid: { type: Boolean, default: true },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormSubmitThemeClasses>>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formSubmit', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const resolved = theme.value;
            const isBusy = props.modelValue || props.busy;

            let icon: VNodeArrayChildren = [];
            if (props.icon) {
                icon = [
                    h('i', {
                        class: props.isEditing ?
                            (resolved.updateIcon || undefined) :
                            (resolved.createIcon || undefined),
                    }),
                ];
            }

            return h(
                props.type,
                mergeProps({
                    ...(props.type === 'button' ? { type: 'submit' } : {}),
                    class: props.isEditing ?
                        (resolved.updateButton || undefined) :
                        (resolved.createButton || undefined),
                    disabled: props.invalid || isBusy,
                    onClick($event: any) {
                        $event.preventDefault();

                        if (!props.submit) return;

                        emit('update:modelValue', true);

                        const result = props.submit();

                        if (result && typeof result.then === 'function') {
                            result.finally(() => {
                                emit('update:modelValue', false);
                            });
                        } else {
                            emit('update:modelValue', false);
                        }
                    },
                }, attrs),
                [
                    ...icon,
                    ' ',
                    props.isEditing ? props.updateText : props.createText,
                ],
            );
        };
    },
});
