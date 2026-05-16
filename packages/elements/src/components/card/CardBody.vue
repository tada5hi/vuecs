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
import { cardBodyThemeDefaults } from './theme';
import type { CardBodyThemeClasses } from './types';

const cardBodyProps = {
    /** HTML tag (or component) to render. */
    as: { type: String, default: 'div' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<CardBodyThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type CardBodyProps = ExtractPublicPropTypes<typeof cardBodyProps>;

export default defineComponent({
    name: 'VCCardBody',
    inheritAttrs: false,
    props: cardBodyProps,
    setup(props, { attrs, slots }) {
        const ctx = useCardContext();
        const themeProps: UseComponentThemeProps<CardBodyThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() {
                return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) };
            },
        };
        const theme = useComponentTheme('cardBody', themeProps, cardBodyThemeDefaults);

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
