<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { VCLink } from '@vuecs/link';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import { useBreadcrumbContext } from './context';
import { breadcrumbThemeDefaults } from './theme';
import type { BreadcrumbThemeClasses } from './types';

const breadcrumbLinkProps = {
    /** Route target (vue-router `to`). Composes `<VCLink>` for router-aware navigation. */
    to: { type: [String, Object] as PropType<string | Record<string, unknown>>, default: undefined },
    /** Plain `href` (non-router). */
    href: { type: String, default: undefined },
    /**
     * Mark this crumb as the current page. Emits `aria-current="page"` and
     * folds the `active` axis into `themeVariant` (W3C APG keeps the current
     * crumb a real link).
     */
    active: { type: Boolean, default: false },
    /** Genuinely disabled crumb. */
    disabled: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BreadcrumbThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BreadcrumbLinkProps = ExtractPublicPropTypes<typeof breadcrumbLinkProps>;

export default defineComponent({
    name: 'VCBreadcrumbLink',
    inheritAttrs: false,
    props: breadcrumbLinkProps,
    setup(props, { attrs, slots }) {
        const ctx = useBreadcrumbContext();
        const themeProps: UseComponentThemeProps<BreadcrumbThemeClasses> = {
            get themeClass() { return { ...(ctx?.themeClass() ?? {}), ...(props.themeClass ?? {}) }; },
            get themeVariant() {
                return {
                    ...(ctx?.themeVariant() ?? {}),
                    active: props.active,
                    ...(props.themeVariant ?? {}),
                };
            },
        };
        const theme = useComponentTheme('breadcrumb', themeProps, breadcrumbThemeDefaults);

        return () => h(
            VCLink,
            mergeProps(attrs, {
                'to': props.to,
                'href': props.href,
                'active': props.active,
                'disabled': props.disabled,
                'class': theme.value.link || undefined,
                'aria-current': props.active ? 'page' : undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
