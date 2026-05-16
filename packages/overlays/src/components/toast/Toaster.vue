<script lang="ts">
import { 
    computed, 
    defineComponent, 
    h, 
    mergeProps, 
} from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { ToastViewport } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import VCToast from './Toast.vue';
import VCToastTitle from './ToastTitle.vue';
import VCToastDescription from './ToastDescription.vue';
import VCToastAction from './ToastAction.vue';
import VCToastClose from './ToastClose.vue';
import { useToast } from './use-toast';
import { toastViewportThemeDefaults } from './theme';
import type {
    ToastEntry,
    ToastViewportPosition,
    ToastViewportThemeClasses,
} from './types';

const toasterProps = {
    /**
     * Viewport position. Drives the `position` theme variant on
     * `toastViewport`. Defaults to `'top-right'` on desktop with
     * theme-provided responsive overrides at narrow viewports.
     */
    position: { type: String as PropType<ToastViewportPosition>, default: 'top-right' },
    /**
     * Keyboard shortcut that focuses the viewport (Reka default: `'F8'`).
     * Allows screen-reader users to jump back to recent toasts.
     */
    hotkey: { type: Array as PropType<string[]>, default: undefined },
    /** Aria label for the viewport landmark. */
    label: { type: String, default: undefined },
    /** HTML tag to render. */
    as: { type: String, default: 'ol' },
    ...themableProps<ToastViewportThemeClasses>(),
};

export type ToasterProps = ExtractPublicPropTypes<typeof toasterProps>;

export type ToasterSlotProps = {
    /** The entry being rendered. */
    entry: ToastEntry;
    /** Call to dismiss this entry from the queue. */
    dismiss: () => void;
};

export default defineComponent({
    name: 'VCToaster',
    inheritAttrs: false,
    props: toasterProps,
    slots: Object as SlotsType<{
        default(props: ToasterSlotProps): unknown;
    }>,
    setup(props, { attrs, slots }) {
        const themeProps = useThemeProps(props, 'position');
        const theme = useComponentTheme('toastViewport', themeProps, toastViewportThemeDefaults);

        const { entries, dismiss } = useToast();

        const rekaProps = computed(() => {
            const out: Record<string, unknown> = {};
            if (props.hotkey) out.hotkey = props.hotkey;
            if (props.label) out.label = props.label;
            return out;
        });

        // Render each queue entry. If the consumer provides a default slot,
        // use it for full per-entry customization; otherwise fall back to
        // the canonical layout (title + description + action + close).
        function renderEntry(entry: ToastEntry) {
            const onClose = () => dismiss(entry.id);

            if (slots.default) {
                return slots.default({ entry, dismiss: onClose });
            }

            const body = h('div', { class: 'vc-toast-body' }, [
                entry.title ? h(VCToastTitle, null, () => entry.title) : null,
                entry.description ? h(VCToastDescription, null, () => entry.description) : null,
                entry.action ?
                    h(
                        VCToastAction,
                        {
                            altText: entry.action.label,
                            onClick: entry.action.onClick,
                        },
                        () => entry.action!.label,
                    ) :
                    null,
            ]);

            const closable = entry.closable !== false;

            return h(
                VCToast,
                {
                    key: entry.id,
                    color: entry.color,
                    variant: entry.variant,
                    duration: entry.duration,
                    'onUpdate:open': (open: boolean) => { if (!open) onClose(); },
                },
                () => [body, closable ? h(VCToastClose) : null],
            );
        }

        return () => h(
            ToastViewport,
            mergeProps(attrs, {
                as: props.as,
                class: theme.value.root || undefined,
                ...rekaProps.value,
            }),
            { default: () => entries.value.map(renderEntry) },
        );
    },
});
</script>
