<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { TooltipTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { tooltipThemeDefaults } from './theme';
import type { TooltipThemeClasses } from './types';

export default defineComponent({
    name: 'VCTooltipTrigger',
    props: {
        as: { type: String, default: 'button' },
        asChild: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<TooltipThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots }) {
        const theme = useComponentTheme('tooltip', props, tooltipThemeDefaults);
        return () => h(
            TooltipTrigger,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.trigger || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
