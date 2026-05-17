<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    mergeProps,
    resolveComponent,
} from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import {
    themableProps,
    useComponentDefaults,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { alertThemeDefaults } from './theme';
import type {
    AlertColor,
    AlertDefaults,
    AlertSize,
    AlertThemeClasses,
    AlertVariant,
} from './types';

const alertProps = {
    /** Semantic color. Drives the `color` theme variant + auto-resolves the default icon + ARIA role. */
    color: { type: String as PropType<AlertColor>, default: undefined },
    /** Visual treatment — solid / soft / outline. */
    variant: { type: String as PropType<AlertVariant>, default: undefined },
    /** Padding / font-size tier. */
    size: { type: String as PropType<AlertSize>, default: undefined },
    /**
     * Iconify name for the leading icon (e.g. `'lucide:triangle-alert'`).
     * When omitted, resolves from the active icon preset based on `color`
     * (`errorIcon` / `warningIcon` / `successIcon` / `infoIcon`). Pass an
     * empty string to suppress the icon entirely.
     */
    icon: { type: String, default: undefined },
    /**
     * ARIA role. Defaults to `'alert'` for `error` / `warning` (assertive)
     * and `'status'` for `info` / `success` / `neutral` (polite) — matches
     * WAI-ARIA's intended semantics. Override for custom interaction
     * patterns (e.g. `role="log"` for chat-style toasts).
     */
    role: { type: String, default: undefined },
    /** HTML tag to render. */
    as: { type: String, default: 'div' },
    ...themableProps<AlertThemeClasses>(),
};

export type AlertProps = ExtractPublicPropTypes<typeof alertProps>;

const alertBehavioralDefaults: AlertDefaults = {
    infoIcon: '',
    successIcon: '',
    warningIcon: '',
    errorIcon: '',
};

/**
 * `<VCAlert>` is presentational — it does NOT own visibility state. Wrap
 * with `v-if` for instant dismissal, or compose with `<VCCollapse v-model:open>`
 * for an animated height-collapse on dismiss. `<VCAlertClose>` emits `click`;
 * the consumer wires the click to whichever visibility ref drives the wrap.
 *
 * This intentionally diverges from the overlay families (Modal / Popover)
 * which own their open state through Reka primitives — Alert has no portal
 * or unmount-cascade machinery, so coupling visibility to internal state
 * breaks composition with outer animation parents (the Collapse case).
 */
export default defineComponent({
    name: 'VCAlert',
    inheritAttrs: false,
    props: alertProps,
    setup(props, { attrs, slots }) {
        const themeProps = useThemeProps(props, 'color', 'variant', 'size');
        const theme = useComponentTheme('alert', themeProps, alertThemeDefaults);
        const defaults = useComponentDefaults('alert', {}, alertBehavioralDefaults);

        // Resolved icon name — explicit `:icon` wins over color-derived preset default.
        const iconName = computed(() => {
            if (props.icon !== undefined) return props.icon;
            switch (props.color) {
                case 'error': return defaults.value.errorIcon;
                case 'warning': return defaults.value.warningIcon;
                case 'success': return defaults.value.successIcon;
                case 'info': return defaults.value.infoIcon;
                default: return '';
            }
        });

        // Severity-derived ARIA role with explicit override.
        const resolvedRole = computed(() => {
            if (props.role) return props.role;
            return props.color === 'error' || props.color === 'warning' ? 'alert' : 'status';
        });

        // Hoisted out of the render fn — resolves once per component
        // instance instead of per render. `resolveComponent` reads the
        // app-wide component registry; if `@vuecs/icon` isn't installed
        // it returns the lookup string ('VCIcon'), which we detect below.
        const VCIcon = resolveComponent('VCIcon');
        const hasIconComponent = typeof VCIcon !== 'string';

        return () => {
            const iconValue = iconName.value;
            const showIcon = !!iconValue && hasIconComponent;

            return h(
                props.as,
                mergeProps(attrs, {
                    role: resolvedRole.value,
                    class: theme.value.root || undefined,
                }),
                [
                    showIcon ? h('span', { class: theme.value.icon || undefined, 'aria-hidden': 'true' }, [
                        h(VCIcon as Component, { name: iconValue }),
                    ]) : null,
                    h('div', { class: theme.value.content || undefined }, slots.default?.()),
                ],
            );
        };
    },
});
</script>
