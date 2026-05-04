<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuSeparator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuSeparatorProps = {
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuSeparatorProps = ExtractPublicPropTypes<typeof dropdownMenuSeparatorProps>;

export default defineComponent({
    name: 'VCDropdownMenuSeparator',
    props: dropdownMenuSeparatorProps,
    setup(props) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(DropdownMenuSeparator, { class: theme.value.separator || undefined });
    },
});
</script>
