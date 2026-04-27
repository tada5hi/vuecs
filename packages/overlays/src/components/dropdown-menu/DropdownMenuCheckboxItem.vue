<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuCheckboxItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCDropdownMenuCheckboxItem',
    inheritAttrs: false,
    props: {
        modelValue: { type: [Boolean, String] as PropType<boolean | 'indeterminate' | undefined>, default: undefined },
        disabled: { type: Boolean, default: false },
        textValue: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue', 'select'],
    setup(props, {
        slots, 
        emit, 
        attrs, 
    }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuCheckboxItem,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                disabled: props.disabled,
                textValue: props.textValue,
                'onUpdate:modelValue': (value: boolean | 'indeterminate') => emit('update:modelValue', value),
                onSelect: (event: Event) => emit('select', event),
                class: theme.value.checkboxItem || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
