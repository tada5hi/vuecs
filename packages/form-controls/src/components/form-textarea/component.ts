import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType } from 'vue';
import { 
    defineComponent, 
    h, 
    mergeProps, 
    toRef, 
} from 'vue';

export type FormTextareaThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formTextarea?: ThemeClassesOverride<FormTextareaThemeClasses>;
    }
}

const themeDefaults: FormTextareaThemeClasses = { root: '' };

export const VCFormTextarea = defineComponent({
    name: 'VCFormTextarea',
    props: {
        modelValue: { type: String, default: '' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormTextareaThemeClasses>>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formTextarea', toRef(props, 'themeClass'), themeDefaults);

        return () => h('textarea', mergeProps({
            placeholder: '...',
            class: theme.value.root || undefined,
            onInput($event: any) {
                if ($event.target.composing) return;
                emit('update:modelValue', $event.target.value);
            },
            ...(typeof props.modelValue !== 'undefined' ? { value: props.modelValue } : {}),
        }, attrs));
    },
});
