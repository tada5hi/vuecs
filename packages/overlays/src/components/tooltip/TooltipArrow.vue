<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { TooltipArrow } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { tooltipThemeDefaults } from './theme';
import type { TooltipThemeClasses } from './types';

export default defineComponent({
    name: 'VCTooltipArrow',
    props: {
        width: { type: Number, default: 10 },
        height: { type: Number, default: 5 },
        themeClass: { type: Object as PropType<ThemeClassesOverride<TooltipThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
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
