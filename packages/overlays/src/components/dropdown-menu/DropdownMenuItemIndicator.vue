<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuItemIndicator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuItemIndicatorProps = {
    forceMount: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuItemIndicatorProps = ExtractPublicPropTypes<typeof dropdownMenuItemIndicatorProps>;

export default defineComponent({
    name: 'VCDropdownMenuItemIndicator',
    props: dropdownMenuItemIndicatorProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuItemIndicator,
            { forceMount: props.forceMount, class: theme.value.itemIndicator || undefined },
            { default: () => slots.default?.() ?? '✓' },
        );
    },
});
</script>
