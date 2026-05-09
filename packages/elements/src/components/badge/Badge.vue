<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { badgeThemeDefaults } from './theme';
import type {
    BadgeColor,
    BadgeSize,
    BadgeThemeClasses,
    BadgeVariant,
} from './types';

const badgeProps = {
    /** Color variant key — resolved by the active theme. */
    color: { type: String as PropType<BadgeColor>, default: undefined },
    /** Style variant key — resolved by the active theme (e.g. `solid`, `soft`, `outline`). */
    variant: { type: String as PropType<BadgeVariant>, default: undefined },
    /** Size variant key — resolved by the active theme. */
    size: { type: String as PropType<BadgeSize>, default: undefined },
    /** HTML tag to render. */
    tag: { type: String, default: 'span' },
    ...themableProps<BadgeThemeClasses>(),
};

export type BadgeProps = ExtractPublicPropTypes<typeof badgeProps>;

export default defineComponent({
    name: 'VCBadge',
    inheritAttrs: false,
    props: badgeProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'badge',
            useThemeProps(props, 'color', 'variant', 'size'),
            badgeThemeDefaults,
        );
        return () => h(
            props.tag,
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
