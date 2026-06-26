<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useBreadcrumbContext } from './context';
import { breadcrumbItemThemeDefaults } from './theme';
import type { BreadcrumbItemThemeClasses } from './types';

const breadcrumbItemProps = {
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'li' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BreadcrumbItemThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BreadcrumbItemProps = ExtractPublicPropTypes<typeof breadcrumbItemProps>;

export default defineComponent({
    name: 'VCBreadcrumbItem',
    inheritAttrs: false,
    props: breadcrumbItemProps,
    setup(props, { attrs, slots }) {
        const ctx = useBreadcrumbContext();
        // Only `themeVariant` inherits — the `<li>` carries its own theme key.
        const themeProps: UseComponentThemeProps<BreadcrumbItemThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() { return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) }; },
        };
        const theme = useComponentTheme('breadcrumbItem', themeProps, breadcrumbItemThemeDefaults);
        return () => h(
            props.as,
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
