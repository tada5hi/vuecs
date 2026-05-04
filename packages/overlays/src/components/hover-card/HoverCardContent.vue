<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { HoverCardContent, HoverCardPortal } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { hoverCardThemeDefaults } from './theme';
import type { HoverCardThemeClasses } from './types';

const hoverCardContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Preferred side relative to the trigger. */
    side: { type: String as PropType<'top' | 'right' | 'bottom' | 'left'>, default: 'bottom' },
    /** Distance in pixels between trigger and panel. Vuecs convention: 4 (Reka default: 0). */
    sideOffset: { type: Number, default: 4 },
    /** Alignment along the chosen side. */
    align: { type: String as PropType<'start' | 'center' | 'end'>, default: 'center' },
    /** Offset in pixels along the alignment axis. */
    alignOffset: { type: Number, default: 0 },
    /** Flip / shift the panel to stay inside the viewport. */
    avoidCollisions: { type: Boolean, default: true },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<HoverCardThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type HoverCardContentProps = ExtractPublicPropTypes<typeof hoverCardContentProps>;

export default defineComponent({
    name: 'VCHoverCardContent',
    inheritAttrs: false,
    props: hoverCardContentProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('hoverCard', props, hoverCardThemeDefaults);

        const renderContent = () => h(
            HoverCardContent,
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
            return h(HoverCardPortal, null, { default: () => renderContent() });
        };
    },
});
</script>
