<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuRadioGroup } from 'reka-ui';
import { useComponentTheme, useForwardPropsEmits } from '@vuecs/core';
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
    setup(props, { slots, emit }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            DropdownMenuRadioGroup,
            { ...forwarded.value, class: theme.value.radioGroup || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
