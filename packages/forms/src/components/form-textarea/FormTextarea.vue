<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import { useFormInputThemeProps } from '../form-group/context';
import type {
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { useDebounceFn } from '@vueuse/core';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
    ref,
    watch,
    withDirectives,
} from 'vue';
import { resolveDomValue, vDomValue, withoutValue } from '../../utils/dom-value';

export type FormTextareaThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public type name and declaration merging.
    interface ThemeElements {
        formTextarea?: ThemeElementDefinition<FormTextareaThemeClasses>;
    }
}

export const formTextareaThemeDefaults: ComponentThemeDefinition<FormTextareaThemeClasses> = { classes: { root: '' } };

const formTextareaProps = {
    /**
     * Controlled string value (v-model). `null` is the documented "unset" value.
     *
     * No `default` on purpose: vue-tsc strips `null`/`undefined` (via `NonNullable`)
     * when folding a prop default into the emitted `DefaultProps`, which then
     * intersects `$props['modelValue']` back down to `string` and breaks v-model
     * against nullable entity fields (#1613). The render coerces `null`/`undefined`
     * to `''`, so the empty-textarea behaviour is unchanged.
     */
    modelValue: { type: [String, null] as PropType<string | null | undefined> },
    /** Debounce window (ms) for `update:modelValue` emissions. `0` disables debouncing. */
    debounce: { type: Number, default: 0 },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormTextareaThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormTextareaProps = ExtractPublicPropTypes<typeof formTextareaProps>;

export default defineComponent({
    name: 'VCFormTextarea',
    // the render merges `attrs` itself (without `value`); inheriting them would put `value` back
    inheritAttrs: false,
    props: formTextareaProps,
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formTextarea', useFormInputThemeProps(props), formTextareaThemeDefaults);

        const localValue = ref<string | null | undefined>(props.modelValue);

        watch(() => props.modelValue, (value) => {
            localValue.value = value;
        });

        const emitUpdate = (value: string) => emit('update:modelValue', value);
        const emitUpdateDebounced = useDebounceFn(emitUpdate, () => props.debounce);

        const onInput = ($event: Event) => {
            // Vue patches `composing` onto the target during IME composition;
            // skip the emit until composition ends to avoid duplicate updates.
            const target = $event.target as globalThis.HTMLTextAreaElement & { composing?: boolean };

            if (target.composing) {
                return;
            }

            const { value } = target;

            localValue.value = value;

            if (props.debounce > 0) {
                emitUpdateDebounced(value);
            } else {
                emitUpdate(value);
            }
        };

        // the value (a forwarded one first) goes through vDomValue, never a `value` prop:
        // Vue would mirror it into the attribute
        return () => withDirectives(h('textarea', mergeProps({
            placeholder: '...',
            class: theme.value.root || undefined,
            onInput,
        }, withoutValue(attrs))), [[vDomValue, resolveDomValue(attrs, localValue.value)]]);
    },
});
</script>
