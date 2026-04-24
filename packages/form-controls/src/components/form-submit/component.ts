import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import type { PropType, VNodeArrayChildren } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormSubmitThemeClasses = {
    root: string;
    createButton: string;
    updateButton: string;
    createIcon: string;
    updateIcon: string;
};

export type FormSubmitDefaults = {
    type: string;
    icon: boolean;
    createText: string;
    updateText: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSubmit?: ThemeElementDefinition<FormSubmitThemeClasses>;
    }
    interface ComponentDefaults {
        formSubmit?: ComponentDefaultValues<FormSubmitDefaults>;
    }
}

const themeDefaults = {
    classes: {
        root: '',
        createButton: '',
        updateButton: '',
        createIcon: '',
        updateIcon: '',
    },
};

const behavioralDefaults: FormSubmitDefaults = {
    type: 'button',
    icon: true,
    createText: 'Create',
    updateText: 'Update',
};

export const VCFormSubmit = defineComponent({
    name: 'VCFormSubmit',
    props: {
        modelValue: { type: Boolean, default: false },
        icon: { type: Boolean, default: undefined },
        isEditing: { type: Boolean, default: false },
        busy: { type: Boolean, default: false },
        type: { type: String, default: undefined },
        createText: { type: String, default: undefined },
        updateText: { type: String, default: undefined },
        submit: { type: Function as PropType<() => Promise<any> | any> },
        invalid: { type: Boolean, default: true },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormSubmitThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formSubmit', props, themeDefaults);
        const defaults = useComponentDefaults('formSubmit', props, behavioralDefaults);

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const isBusy = props.modelValue || props.busy;

            let icon: VNodeArrayChildren = [];
            if (resolvedDefaults.icon) {
                icon = [
                    h('i', {
                        class: props.isEditing ?
                            (resolved.updateIcon || undefined) :
                            (resolved.createIcon || undefined),
                    }),
                ];
            }

            return h(
                resolvedDefaults.type,
                mergeProps({
                    ...(resolvedDefaults.type === 'button' ? { type: 'submit' } : {}),
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
                    props.isEditing ? resolvedDefaults.updateText : resolvedDefaults.createText,
                ],
            );
        };
    },
});
