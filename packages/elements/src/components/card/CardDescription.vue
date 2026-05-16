<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { Primitive } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    UseComponentThemeProps,
    VariantValues,
} from '@vuecs/core';
import { useCardContext } from './context';
import { cardDescriptionThemeDefaults } from './theme';
import type { CardDescriptionThemeClasses } from './types';

const cardDescriptionProps = {
    /** HTML tag to render. Use `:as-child` to compose onto an existing component. */
    as: { type: String, default: 'p' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<CardDescriptionThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type CardDescriptionProps = ExtractPublicPropTypes<typeof cardDescriptionProps>;

export default defineComponent({
    name: 'VCCardDescription',
    inheritAttrs: false,
    props: cardDescriptionProps,
    setup(props, { attrs, slots }) {
        const ctx = useCardContext();
        const themeProps: UseComponentThemeProps<CardDescriptionThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() {
                return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) };
            },
        };
        const theme = useComponentTheme('cardDescription', themeProps, cardDescriptionThemeDefaults);

        return () => h(
            Primitive,
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
