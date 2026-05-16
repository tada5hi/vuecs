<script lang="ts">
import { 
    computed, 
    defineComponent, 
    h, 
    mergeProps, 
    ref, 
    resolveComponent, 
    watch, 
} from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import {
    themableProps,
    useComponentDefaults,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { provideAlertContext } from './context';
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
    /** Controlled visibility. Two-way bindable via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial visibility when `open` is undefined. */
    defaultOpen: { type: Boolean, default: true },
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

export default defineComponent({
    name: 'VCAlert',
    inheritAttrs: false,
    props: alertProps,
    emits: ['update:open'],
    setup(props, {
        attrs, 
        slots, 
        emit, 
    }) {
        const themeProps = useThemeProps(props, 'color', 'variant', 'size');
        const theme = useComponentTheme('alert', themeProps, alertThemeDefaults);
        const defaults = useComponentDefaults('alert', {}, alertBehavioralDefaults);

        // Local open state when uncontrolled. The consumer-supplied `open`
        // prop (when not undefined) takes precedence — Vue's reactivity
        // re-runs the computed below as it changes.
        const internalOpen = ref(props.defaultOpen);
        watch(() => props.open, (next) => {
            if (typeof next === 'boolean') internalOpen.value = next;
        }, { immediate: true });

        const isOpen = computed(() => (typeof props.open === 'boolean' ? props.open : internalOpen.value));

        function setOpen(next: boolean): void {
            internalOpen.value = next;
            emit('update:open', next);
        }

        provideAlertContext({ setOpen });

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

        return () => {
            if (!isOpen.value) return null;

            const iconValue = iconName.value;
            const VCIcon = iconValue ? resolveComponent('VCIcon') : null;
            const showIcon = !!iconValue && typeof VCIcon !== 'string';

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
