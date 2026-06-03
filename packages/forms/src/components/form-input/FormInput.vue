<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { useDebounceFn } from '@vueuse/core';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNodeChild,
} from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
    ref,
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

export const formInputThemeDefaults: ComponentThemeDefinition<FormInputThemeClasses> = {
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

const formInputProps = {
    /** Controlled string value (v-model). `null` is the documented "unset" value. */
    modelValue: { type: [String, null] as PropType<string | null | undefined>, default: '' },
    /** Native `<input type>` attribute. */
    type: { type: String, default: 'text' },
    /** Force-render the input-group wrapper even without prepend/append content. */
    group: { type: Boolean, default: false },
    /** When `true`, render a prepended group element using `groupPrependContent` (or the `groupPrepend` slot). */
    groupPrepend: { type: Boolean, default: false },
    /** Default text/HTML rendered inside the prepend slot. */
    groupPrependContent: { type: String, default: undefined },
    /** When `true`, render an appended group element using `groupAppendContent` (or the `groupAppend` slot). */
    groupAppend: { type: Boolean, default: false },
    /** Default text/HTML rendered inside the append slot. */
    groupAppendContent: { type: String, default: undefined },
    /** Debounce window (ms) for `update:modelValue` emissions. `0` disables debouncing. */
    debounce: { type: Number, default: 0 },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormInputThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormInputProps = ExtractPublicPropTypes<typeof formInputProps>;

export default defineComponent({
    name: 'VCFormInput',
    // attrs are explicitly merged onto the `<input>` below via
    // `mergeProps(..., attrs)`. Without `inheritAttrs: false`, the
    // group-wrapper `<div>` (when rendered) also receives them, so
    // `id` / `disabled` / `placeholder` end up on both elements.
    inheritAttrs: false,
    props: formInputProps,
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
        const theme = useComponentTheme('formInput', props, formInputThemeDefaults);

        const localValue = ref<string | null | undefined>(props.modelValue);
        watch(() => props.modelValue, (value) => {
            localValue.value = value;
        });

        const emitUpdate = (value: string) => emit('update:modelValue', value);
        const emitUpdateDebounced = useDebounceFn(emitUpdate, () => props.debounce);

        const onInput = ($event: Event) => {
            // Vue patches `composing` onto the target during IME composition;
            // skip the emit until composition ends to avoid duplicate updates.
            const target = $event.target as globalThis.HTMLInputElement & { composing?: boolean };
            if (target.composing) return;
            const { value } = target;
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
</script>
