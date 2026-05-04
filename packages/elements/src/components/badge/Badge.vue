<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    UseComponentThemeProps,
    VariantValues,
} from '@vuecs/core';
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
    /** Style variant key — resolved by the active theme (e.g. `solid`, `subtle`, `outline`). */
    variant: { type: String as PropType<BadgeVariant>, default: undefined },
    /** Size variant key — resolved by the active theme. */
    size: { type: String as PropType<BadgeSize>, default: undefined },
    /** HTML tag to render. */
    tag: { type: String, default: 'span' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BadgeThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BadgeProps = ExtractPublicPropTypes<typeof badgeProps>;

export default defineComponent({
    name: 'VCBadge',
    inheritAttrs: false,
    props: badgeProps,
    setup(props, { attrs, slots }) {
        const themeProps: UseComponentThemeProps<BadgeThemeClasses> = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                return {
                    ...(props.themeVariant ?? {}),
                    ...(props.color !== undefined ? { color: props.color } : {}),
                    ...(props.variant !== undefined ? { variant: props.variant } : {}),
                    ...(props.size !== undefined ? { size: props.size } : {}),
                };
            },
        };
        const theme = useComponentTheme('badge', themeProps, badgeThemeDefaults);
        return () => h(
            props.tag,
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
