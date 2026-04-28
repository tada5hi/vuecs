<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuGroup } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuGroupProps = {
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuGroupProps = ExtractPublicPropTypes<typeof dropdownMenuGroupProps>;

export default defineComponent({
    name: 'VCDropdownMenuGroup',
    props: dropdownMenuGroupProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuGroup,
            { class: theme.value.group || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
