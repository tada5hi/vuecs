<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuSubTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCDropdownMenuSubTrigger',
    inheritAttrs: false,
    props: {
        as: { type: String, default: 'div' },
        asChild: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        textValue: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuSubTrigger,
            {
                ...attrs,
                as: props.as,
                asChild: props.asChild,
                disabled: props.disabled,
                textValue: props.textValue,
                class: theme.value.subTrigger || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
