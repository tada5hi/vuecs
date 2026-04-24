import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, ThemeElementDefinition, VariantValues } from '@vuecs/core';
import { useDebounceFn } from '@vueuse/core';
import type { PropType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
    ref,
    watch,
} from 'vue';

export type FormTextareaThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formTextarea?: ThemeElementDefinition<FormTextareaThemeClasses>;
    }
}

const themeDefaults = { classes: { root: '' } };

export const VCFormTextarea = defineComponent({
    name: 'VCFormTextarea',
    props: {
        modelValue: { type: String, default: '' },
        debounce: { type: Number, default: 0 },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormTextareaThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formTextarea', props, themeDefaults);

        const localValue = ref(props.modelValue);
        watch(() => props.modelValue, (value) => {
            localValue.value = value;
        });

        const emitUpdate = (value: string) => emit('update:modelValue', value);
        const emitUpdateDebounced = useDebounceFn(emitUpdate, () => props.debounce);

        const onInput = ($event: any) => {
            if ($event.target.composing) return;
            const { value } = $event.target;
            localValue.value = value;
            if (props.debounce > 0) {
                emitUpdateDebounced(value);
            } else {
                emitUpdate(value);
            }
        };

        return () => h('textarea', mergeProps({
            placeholder: '...',
            class: theme.value.root || undefined,
            onInput,
            value: localValue.value,
        }, attrs));
    },
});
