<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { VCPrimitive, useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    UseComponentThemeProps,
    VariantValues,
} from '@vuecs/core';
import { useCardContext } from './context';
import { cardTitleThemeDefaults } from './theme';
import type { CardTitleThemeClasses } from './types';

const cardTitleProps = {
    /** HTML tag to render. Use `:as-child` to compose onto an existing component. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'h3' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<CardTitleThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type CardTitleProps = ExtractPublicPropTypes<typeof cardTitleProps>;

export default defineComponent({
    name: 'VCCardTitle',
    inheritAttrs: false,
    props: cardTitleProps,
    setup(props, { attrs, slots }) {
        const ctx = useCardContext();
        const themeProps: UseComponentThemeProps<CardTitleThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() {
                return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) };
            },
        };
        const theme = useComponentTheme('cardTitle', themeProps, cardTitleThemeDefaults);

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
