<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { PopoverArrow } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { popoverThemeDefaults } from './theme';
import type { PopoverThemeClasses } from './types';

const popoverArrowProps = {
    /** Arrow width in pixels. */
    width: { type: Number, default: 10 },
    /** Arrow height in pixels. */
    height: { type: Number, default: 5 },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<PopoverThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type PopoverArrowProps = ExtractPublicPropTypes<typeof popoverArrowProps>;

export default defineComponent({
    name: 'VCPopoverArrow',
    props: popoverArrowProps,
    setup(props) {
        const theme = useComponentTheme('popover', props, popoverThemeDefaults);
        return () => h(PopoverArrow, {
            width: props.width,
            height: props.height,
            class: theme.value.arrow || undefined,
        });
    },
});
</script>
