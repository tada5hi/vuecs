<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { HoverCardArrow } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { hoverCardThemeDefaults } from './theme';
import type { HoverCardThemeClasses } from './types';

const hoverCardArrowProps = {
    /** Arrow width in pixels. */
    width: { type: Number, default: 10 },
    /** Arrow height in pixels. */
    height: { type: Number, default: 5 },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<HoverCardThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type HoverCardArrowProps = ExtractPublicPropTypes<typeof hoverCardArrowProps>;

export default defineComponent({
    name: 'VCHoverCardArrow',
    props: hoverCardArrowProps,
    setup(props) {
        const theme = useComponentTheme('hoverCard', props, hoverCardThemeDefaults);
        return () => h(HoverCardArrow, {
            width: props.width,
            height: props.height,
            class: theme.value.arrow || undefined,
        });
    },
});
</script>
