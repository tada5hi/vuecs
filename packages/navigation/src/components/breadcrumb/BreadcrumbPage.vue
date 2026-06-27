<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useBreadcrumbContext } from './context';
import { breadcrumbThemeDefaults } from './theme';
import type { BreadcrumbThemeClasses } from './types';

const breadcrumbPageProps = {
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'span' },
    /** Mark as the current page (`aria-current="page"`). Set for the last crumb. */
    current: { type: Boolean, default: false },
    /**
     * Genuinely disabled crumb → `aria-disabled="true"`. Distinct from a
     * url-less section crumb (which is plain non-interactive text, no aria).
     */
    disabled: { type: Boolean, default: false },
    /**
     * Render as a non-navigable link (`role="link" aria-disabled="true"`),
     * the shadcn idiom for a current crumb that looks like a link but isn't.
     * Off by default — APG keeps the current crumb a real link via
     * `<VCBreadcrumbLink active>`.
     */
    asLink: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BreadcrumbThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BreadcrumbPageProps = ExtractPublicPropTypes<typeof breadcrumbPageProps>;

export default defineComponent({
    name: 'VCBreadcrumbPage',
    inheritAttrs: false,
    props: breadcrumbPageProps,
    setup(props, { attrs, slots }) {
        const ctx = useBreadcrumbContext();
        const themeProps: UseComponentThemeProps<BreadcrumbThemeClasses> = {
            get themeClass() { return { ...(ctx?.themeClass() ?? {}), ...(props.themeClass ?? {}) }; },
            get themeVariant() {
                return {
                    ...(ctx?.themeVariant() ?? {}),
                    current: props.current,
                    disabled: props.disabled,
                    ...(props.themeVariant ?? {}),
                };
            },
        };
        const theme = useComponentTheme('breadcrumb', themeProps, breadcrumbThemeDefaults);

        return () => h(
            props.as,
            mergeProps(attrs, {
                'class': theme.value.page || undefined,
                'role': props.asLink ? 'link' : undefined,
                'aria-current': props.current ? 'page' : undefined,
                'aria-disabled': (props.disabled || props.asLink) ? 'true' : undefined,
            }),
            slots.default?.(),
        );
    },
});
</script>
