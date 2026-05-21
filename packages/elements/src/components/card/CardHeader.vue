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
import { cardHeaderThemeDefaults } from './theme';
import type { CardHeaderThemeClasses } from './types';

const cardHeaderProps = {
    /** HTML tag to render. Use `:as-child` to compose onto an existing component. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'header' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<CardHeaderThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type CardHeaderProps = ExtractPublicPropTypes<typeof cardHeaderProps>;

export default defineComponent({
    name: 'VCCardHeader',
    inheritAttrs: false,
    props: cardHeaderProps,
    setup(props, { attrs, slots }) {
        const ctx = useCardContext();
        const themeProps: UseComponentThemeProps<CardHeaderThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() {
                return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) };
            },
        };
        const theme = useComponentTheme('cardHeader', themeProps, cardHeaderThemeDefaults);

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
