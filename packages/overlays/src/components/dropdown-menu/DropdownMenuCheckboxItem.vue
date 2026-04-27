<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuCheckboxItem } from 'reka-ui';
import { useComponentTheme, useForwardPropsEmits } from '@vuecs/core';
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
    setup(props, { slots, emit }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            DropdownMenuCheckboxItem,
            { ...forwarded.value, class: theme.value.checkboxItem || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
