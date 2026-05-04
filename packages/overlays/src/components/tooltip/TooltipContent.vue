<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { TooltipContent, TooltipPortal } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { tooltipThemeDefaults } from './theme';
import type { TooltipThemeClasses } from './types';

const tooltipContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Preferred side relative to the trigger. Reka default for tooltip: `'top'`. */
    side: { type: String as PropType<'top' | 'right' | 'bottom' | 'left'>, default: 'top' },
    /** Distance in pixels between trigger and panel. Vuecs convention: 4 (Reka default: 0). */
    sideOffset: { type: Number, default: 4 },
    /** Alignment along the chosen side. */
    align: { type: String as PropType<'start' | 'center' | 'end'>, default: 'center' },
    /** Offset in pixels along the alignment axis. */
    alignOffset: { type: Number, default: 0 },
    /** Flip / shift the panel to stay inside the viewport. */
    avoidCollisions: { type: Boolean, default: true },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<TooltipThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type TooltipContentProps = ExtractPublicPropTypes<typeof tooltipContentProps>;

export default defineComponent({
    name: 'VCTooltipContent',
    inheritAttrs: false,
    props: tooltipContentProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('tooltip', props, tooltipThemeDefaults);

        const renderContent = () => h(
            TooltipContent,
            mergeProps(attrs, {
                side: props.side,
                sideOffset: props.sideOffset,
                align: props.align,
                alignOffset: props.alignOffset,
                avoidCollisions: props.avoidCollisions,
                class: theme.value.content || undefined,
            }),
            { default: () => slots.default?.() },
        );

        return () => {
            if (props.inline) {
                return renderContent();
            }
            return h(TooltipPortal, null, { default: () => renderContent() });
        };
    },
});
</script>
