<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuItemIndicator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuItemIndicatorProps = {
    /** Force the indicator to mount even when its parent is unchecked (useful for animated transitions). */
    forceMount: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
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
            {
                forceMount: props.forceMount,
                class: theme.value.itemIndicator || undefined,
            },
            { default: () => slots.default?.() ?? '✓' },
        );
    },
});
</script>
