<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuArrow } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuArrowProps = {
    /** Arrow width in pixels. */
    width: { type: Number, default: 10 },
    /** Arrow height in pixels. */
    height: { type: Number, default: 5 },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuArrowProps = ExtractPublicPropTypes<typeof dropdownMenuArrowProps>;

export default defineComponent({
    name: 'VCDropdownMenuArrow',
    props: dropdownMenuArrowProps,
    setup(props) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(DropdownMenuArrow, {
            width: props.width,
            height: props.height,
            class: theme.value.arrow || undefined,
        });
    },
});
</script>
