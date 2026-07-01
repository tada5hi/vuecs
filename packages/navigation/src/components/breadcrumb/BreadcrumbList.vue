<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useBreadcrumbContext } from './context';
import { breadcrumbThemeDefaults } from './theme';
import type { BreadcrumbThemeClasses } from './types';

const breadcrumbListProps = {
    /** HTML tag to render. APG-correct default is an ordered list. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'ol' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BreadcrumbThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BreadcrumbListProps = ExtractPublicPropTypes<typeof breadcrumbListProps>;

export default defineComponent({
    name: 'VCBreadcrumbList',
    inheritAttrs: false,
    props: breadcrumbListProps,
    setup(props, { attrs, slots }) {
        const ctx = useBreadcrumbContext();
        const themeProps: UseComponentThemeProps<BreadcrumbThemeClasses> = {
            get themeClass() { return { ...(ctx?.themeClass() ?? {}), ...(props.themeClass ?? {}) }; },
            get themeVariant() { return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) }; },
        };
        const theme = useComponentTheme('breadcrumb', themeProps, breadcrumbThemeDefaults);
        return () => h(
            props.as,
            mergeProps(attrs, { class: theme.value.list || undefined }),
            slots.default?.(),
        );
    },
});
</script>
