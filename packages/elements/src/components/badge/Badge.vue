<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
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
    /**
     * Element or component to render as. Pass a string tag (`'span'`,
     * `'div'`) or a component (`RouterLink` / `NuxtLink`).
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'span' },
    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
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
            props.tag ?? props.as,
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
