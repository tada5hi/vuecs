<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { TooltipArrow } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { tooltipThemeDefaults } from './theme';
import type { TooltipThemeClasses } from './types';

const tooltipArrowProps = {
    /** Arrow width in pixels. */
    width: { type: Number, default: 10 },
    /** Arrow height in pixels. */
    height: { type: Number, default: 5 },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<TooltipThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type TooltipArrowProps = ExtractPublicPropTypes<typeof tooltipArrowProps>;

export default defineComponent({
    name: 'VCTooltipArrow',
    props: tooltipArrowProps,
    setup(props) {
        const theme = useComponentTheme('tooltip', props, tooltipThemeDefaults);
        return () => h(TooltipArrow, {
            width: props.width,
            height: props.height,
            class: theme.value.arrow || undefined,
        });
    },
});
</script>
