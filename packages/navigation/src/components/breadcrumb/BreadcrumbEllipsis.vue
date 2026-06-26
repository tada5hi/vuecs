<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useBreadcrumbContext } from './context';
import { breadcrumbBehavioralDefaults } from './defaults';
import { breadcrumbThemeDefaults } from './theme';
import type { BreadcrumbThemeClasses } from './types';

const breadcrumbEllipsisProps = {
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'span' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BreadcrumbThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BreadcrumbEllipsisProps = ExtractPublicPropTypes<typeof breadcrumbEllipsisProps>;

export default defineComponent({
    name: 'VCBreadcrumbEllipsis',
    inheritAttrs: false,
    props: breadcrumbEllipsisProps,
    setup(props, { attrs, slots }) {
        const ctx = useBreadcrumbContext();
        const themeProps: UseComponentThemeProps<BreadcrumbThemeClasses> = {
            get themeClass() { return { ...(ctx?.themeClass() ?? {}), ...(props.themeClass ?? {}) }; },
            get themeVariant() { return { ...(ctx?.themeVariant() ?? {}), ...(props.themeVariant ?? {}) }; },
        };
        const theme = useComponentTheme('breadcrumb', themeProps, breadcrumbThemeDefaults);
        const defaults = useComponentDefaults('breadcrumb', {}, breadcrumbBehavioralDefaults);

        return () => h(
            props.as,
            mergeProps(attrs, {
                'class': theme.value.ellipsis || undefined,
                'role': 'presentation',
                'aria-hidden': 'true',
            }),
            slots.default ?
                slots.default() :
                [
                    h('span', { 'aria-hidden': 'true' }, defaults.value.ellipsisGlyph),
                    h('span', { class: 'vc-sr-only' }, defaults.value.ellipsisLabel),
                ],
        );
    },
});
</script>
