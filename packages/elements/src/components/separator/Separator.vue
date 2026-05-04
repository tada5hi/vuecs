<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { Separator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { separatorThemeDefaults } from './theme';
import type { SeparatorThemeClasses } from './types';

const separatorProps = {
    /** Layout direction. */
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    /**
     * When `true`, removes the separator from the a11y tree (`role="none"`).
     * Pass `:decorative="false"` to expose it with `role="separator"` +
     * `aria-orientation`.
     *
     * Vuecs convention: defaults to `true` (Reka has no explicit default
     * — undefined falls through to `role="separator"`). Most consumer
     * usages of `<VCSeparator>` are visual dividers, so the safer
     * a11y default is "decorative".
     */
    decorative: { type: Boolean, default: true },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<SeparatorThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type SeparatorProps = ExtractPublicPropTypes<typeof separatorProps>;

export default defineComponent({
    name: 'VCSeparator',
    inheritAttrs: false,
    props: separatorProps,
    setup(props, { attrs }) {
        const theme = useComponentTheme('separator', props, separatorThemeDefaults);
        return () => h(Separator, mergeProps(attrs, {
            orientation: props.orientation,
            decorative: props.decorative,
            class: theme.value.root || undefined,
        }));
    },
});
</script>
