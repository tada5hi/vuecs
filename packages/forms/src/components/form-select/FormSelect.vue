<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import type { AcceptableValue } from 'reka-ui';
import type { PropType, VNode, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import {
    type FormOption,
    type FormOptionGroup,
    type FormOptionItems,
    isFormOptionGroup,
} from '../../types/option';

export type FormSelectThemeClasses = {
    root: string;
};

export type FormSelectDefaults = {
    /**
     * Placeholder text rendered as a leading disabled `<option>`. When unset,
     * no placeholder option is rendered.
     */
    placeholder: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSelect?: ThemeElementDefinition<FormSelectThemeClasses>;
    }
    interface ComponentDefaults {
        formSelect?: ComponentDefaultValues<FormSelectDefaults>;
    }
}

const themeDefaults = { classes: { root: '' } };

const behavioralDefaults: FormSelectDefaults = { placeholder: '' };

const renderOption = (option: FormOption, modelValue: AcceptableValue | undefined): VNode => h(
    'option',
    {
        key: String(option.value),
        value: option.value as string | number | undefined,
        selected: option.value === modelValue,
        disabled: option.disabled,
    },
    [option.label],
);

const renderGroup = (group: FormOptionGroup, modelValue: AcceptableValue | undefined): VNode => h(
    'optgroup',
    {
        key: group.label,
        label: group.label,
        disabled: group.disabled,
    },
    group.options.map((option) => renderOption(option, modelValue)),
);

export default defineComponent({
    name: 'VCFormSelect',
    props: {
        modelValue: {
            type: [String, Number, Boolean, Object, null] as PropType<AcceptableValue | undefined>,
            default: undefined,
        },
        options: {
            type: Array as PropType<FormOptionItems>,
            required: true,
        },
        /**
         * Placeholder text rendered as a leading disabled option. Falls back
         * to the global `formSelect.placeholder` default; when both are empty
         * no placeholder is rendered.
         */
        placeholder: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<FormSelectThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formSelect', props, themeDefaults);
        const defaults = useComponentDefaults('formSelect', props, behavioralDefaults);

        return () => {
            const resolved = theme.value;
            const { placeholder } = defaults.value;
            const children: VNodeChild[] = [];

            if (placeholder) {
                children.push(h(
                    'option',
                    {
                        key: '__placeholder',
                        value: '',
                        disabled: true,
                        selected: props.modelValue === undefined || props.modelValue === '',
                    },
                    [placeholder],
                ));
            }

            for (const item of props.options) {
                if (isFormOptionGroup(item)) {
                    children.push(renderGroup(item, props.modelValue));
                } else {
                    children.push(renderOption(item, props.modelValue));
                }
            }

            return h('select', mergeProps({
                class: resolved.root || undefined,
                onChange($event: Event) {
                    const target = $event.target as globalThis.HTMLSelectElement;
                    const selectedRaw = Array.prototype.filter.call(
                        target.options,
                        (option: globalThis.HTMLOptionElement) => option.selected,
                    ).map((option: globalThis.HTMLOptionElement) => {
                        // Vue patches `_value` onto <option> when `:value`
                        // resolves to a non-string primitive — preserves the
                        // original boolean / number / object identity.
                        const node = option as globalThis.HTMLOptionElement & { _value?: unknown };
                        return '_value' in node ? node._value : option.value;
                    });

                    const value = target.multiple ? selectedRaw : selectedRaw[0];
                    emit('update:modelValue', value);
                },
                ...(typeof props.modelValue !== 'undefined' ? { value: props.modelValue } : {}),
            }, attrs), children);
        };
    },
});
</script>
