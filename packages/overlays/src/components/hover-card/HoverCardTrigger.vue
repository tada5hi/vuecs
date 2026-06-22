<script lang="ts">
import { defineComponent, h } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { HoverCardTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { hoverCardThemeDefaults } from './theme';
import type { HoverCardThemeClasses } from './types';

const hoverCardTriggerProps = {
    /** HTML tag (or component) to render as. Reka default: `'a'` (hover-card triggers are typically links). */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'a' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<HoverCardThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type HoverCardTriggerProps = ExtractPublicPropTypes<typeof hoverCardTriggerProps>;

export default defineComponent({
    name: 'VCHoverCardTrigger',
    props: hoverCardTriggerProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('hoverCard', props, hoverCardThemeDefaults);
        return () => h(
            HoverCardTrigger,
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
