<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { TooltipTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { tooltipThemeDefaults } from './theme';
import type { TooltipThemeClasses } from './types';

const tooltipTriggerProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'button' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<TooltipThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type TooltipTriggerProps = ExtractPublicPropTypes<typeof tooltipTriggerProps>;

export default defineComponent({
    name: 'VCTooltipTrigger',
    inheritAttrs: false,
    props: tooltipTriggerProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('tooltip', props, tooltipThemeDefaults);
        return () => h(
            TooltipTrigger,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.trigger || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
