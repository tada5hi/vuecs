<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    mergeProps,
    resolveComponent,
} from 'vue';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNode,
} from 'vue';
import {
    isMeaningfulSlotContent,
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
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    ...themableProps<AlertThemeClasses>(),
};

export type AlertProps = ExtractPublicPropTypes<typeof alertProps>;

export type AlertIconSlotProps = {
    /** Resolved theme class for the leading-icon wrapper. */
    class: string;
};

const alertBehavioralDefaults: AlertDefaults = {
    primaryIcon: '',
    neutralIcon: '',
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
    slots: Object as SlotsType<{
        /** Alert body — title / description compound or inline text. */
        default?: Record<string, never>;
        /**
         * Leading-icon override. Rendered inside the icon wrapper in place
         * of the `icon` prop / color-derived default. An empty (or
         * `v-if="false"`) slot falls back to the prop / default.
         */
        icon?: AlertIconSlotProps;
    }>,
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
                case 'primary': return defaults.value.primaryIcon;
                case 'neutral': return defaults.value.neutralIcon;
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
            const iconClass = theme.value.icon || undefined;

            // Precedence: `#icon` slot → `icon` prop → color-derived default.
            // The wrapper is a `<div>` (flow content) rather than a `<span>`
            // so an arbitrary `#icon` slot — including block-level content
            // like a spinner — nests validly. `.vc-alert-icon` sets
            // `display: inline-flex`, so the tag has no layout effect.
            const iconSlot = slots.icon?.({ class: theme.value.icon });
            let iconNode: VNode | null = null;
            if (isMeaningfulSlotContent(iconSlot)) {
                iconNode = h('div', { class: iconClass, 'aria-hidden': 'true' }, iconSlot);
            } else {
                const iconValue = iconName.value;
                if (iconValue && hasIconComponent) {
                    iconNode = h('div', { class: iconClass, 'aria-hidden': 'true' }, [
                        h(VCIcon as Component, { name: iconValue }),
                    ]);
                }
            }

            return h(
                props.as,
                mergeProps(attrs, {
                    role: resolvedRole.value,
                    class: theme.value.root || undefined,
                }),
                [
                    iconNode,
                    h('div', { class: theme.value.content || undefined }, slots.default?.()),
                ],
            );
        };
    },
});
</script>
