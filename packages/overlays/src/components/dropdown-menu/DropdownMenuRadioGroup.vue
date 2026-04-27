<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuRadioGroup } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCDropdownMenuRadioGroup',
    inheritAttrs: false,
    props: {
        modelValue: { type: String as PropType<string | undefined>, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue'],
    setup(props, {
        slots, 
        emit, 
        attrs, 
    }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuRadioGroup,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
                class: theme.value.radioGroup || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
