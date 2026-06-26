<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useBreadcrumbContext } from './context';
import { breadcrumbBehavioralDefaults } from './defaults';
import { renderBreadcrumbIcon } from './render-icon';
import { breadcrumbSeparatorThemeDefaults } from './theme';
import type { BreadcrumbSeparatorThemeClasses } from './types';

const breadcrumbSeparatorProps = {
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'li' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BreadcrumbSeparatorThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BreadcrumbSeparatorProps = ExtractPublicPropTypes<typeof breadcrumbSeparatorProps>;

export default defineComponent({
    name: 'VCBreadcrumbSeparator',
    inheritAttrs: false,
    props: breadcrumbSeparatorProps,
    setup(props, { attrs, slots }) {
        const ctx = useBreadcrumbContext();
        const themeProps: UseComponentThemeProps<BreadcrumbSeparatorThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() { return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) }; },
        };
        const theme = useComponentTheme('breadcrumbSeparator', themeProps, breadcrumbSeparatorThemeDefaults);
        const defaults = useComponentDefaults('breadcrumb', {}, breadcrumbBehavioralDefaults);

        const renderContent = () => {
            if (slots.default) {
                return slots.default();
            }
            const icon = defaults.value.separatorIcon;
            if (icon) {
                return renderBreadcrumbIcon(icon);
            }
            return defaults.value.separatorGlyph;
        };

        return () => h(
            props.as,
            mergeProps(attrs, {
                'class': theme.value.root || undefined,
                'aria-hidden': 'true',
                'role': 'presentation',
            }),
            [renderContent()],
        );
    },
});
</script>
