<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import {
    VCPrimitive,
    themableProps,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { provideCardContext } from './context';
import { cardThemeDefaults } from './theme';
import type { CardPadding, CardThemeClasses, CardVariant } from './types';

const cardProps = {
    /** Visual style variant — resolved by the active theme. */
    variant: { type: String as PropType<CardVariant>, default: undefined },
    /** Inner padding scale; propagates to child parts via card context. */
    padding: { type: String as PropType<CardPadding>, default: undefined },
    /** Adds hover / focus styling — useful for link-cards. */
    interactive: { type: Boolean, default: undefined },
    /** HTML tag to render. Use `:as-child` to compose onto an existing component. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    /** Render the consumer's slot child as the card root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<CardThemeClasses>(),
};

export type CardProps = ExtractPublicPropTypes<typeof cardProps>;

export default defineComponent({
    name: 'VCCard',
    inheritAttrs: false,
    props: cardProps,
    setup(props, { attrs, slots }) {
        const themeProps = useThemeProps(props, 'variant', 'padding', 'interactive');
        const theme = useComponentTheme('card', themeProps, cardThemeDefaults);

        provideCardContext({ themeVariant: () => themeProps.themeVariant });

        return () => h(
            VCPrimitive,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
