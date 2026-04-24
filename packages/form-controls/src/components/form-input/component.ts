import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, ThemeElementDefinition, VariantValues } from '@vuecs/core';
import { useDebounceFn } from '@vueuse/core';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
    ref,
    toRef,
    watch,
} from 'vue';

export type FormInputThemeClasses = {
    root: string;
    group: string;
    groupAppend: string;
    groupPrepend: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formInput?: ThemeElementDefinition<FormInputThemeClasses>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-form-input',
        group: 'vc-form-input-group',
        groupAppend: 'vc-form-input-group-append',
        groupPrepend: 'vc-form-input-group-prepend',
    },
};

export type FormInputGroupSlotProps = {
    class: string;
    tag: string;
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
        debounce: { type: Number, default: 0 },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormInputThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        groupAppend: FormInputGroupSlotProps;
        groupPrepend: FormInputGroupSlotProps;
    }>,
    setup(props, {
        attrs,
        emit,
        slots,
    }) {
        const theme = useComponentTheme('formInput', toRef(props, 'themeClass'), themeDefaults, toRef(props, 'themeVariant'));

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
                onInput,
                value: localValue.value,
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
