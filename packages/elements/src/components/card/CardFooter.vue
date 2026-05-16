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
import { cardFooterThemeDefaults } from './theme';
import type { CardFooterThemeClasses } from './types';

const cardFooterProps = {
    /** HTML tag to render. Use `:as-child` to compose onto an existing component. */
    as: { type: String, default: 'footer' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<CardFooterThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type CardFooterProps = ExtractPublicPropTypes<typeof cardFooterProps>;

export default defineComponent({
    name: 'VCCardFooter',
    inheritAttrs: false,
    props: cardFooterProps,
    setup(props, { attrs, slots }) {
        const ctx = useCardContext();
        const themeProps: UseComponentThemeProps<CardFooterThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() {
                return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) };
            },
        };
        const theme = useComponentTheme('cardFooter', themeProps, cardFooterThemeDefaults);

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
