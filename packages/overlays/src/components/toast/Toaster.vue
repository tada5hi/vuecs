<script lang="ts">
import {
    Fragment,
    computed,
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNode,
} from 'vue';
import { ToastViewport } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import VCToast from './Toast.vue';
import VCToastTitle from './ToastTitle.vue';
import VCToastDescription from './ToastDescription.vue';
import VCToastAction from './ToastAction.vue';
import VCToastClose from './ToastClose.vue';
import { useToast } from './use-toast';
import type { UseToastReturn } from './use-toast';
import { toastThemeDefaults, toastViewportThemeDefaults } from './theme';
import type {
    ToastActionRenderFn,
    ToastEntry,
    ToastEntryAction,
    ToastRenderFn,
    ToastThemeClasses,
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
    /** Resolved `toast` theme classes — pass straight to a custom layout. */
    classes: ToastThemeClasses;
};

// Discriminate the structured `{ label, onClick }` action shape from the
// render-fn flavour. Render fns ARE functions, so `typeof === 'function'`
// is the right tell.
function isActionRenderFn(
    action: ToastEntryAction | ToastActionRenderFn,
): action is ToastActionRenderFn {
    return typeof action === 'function';
}

// Same shape for title / description — string vs render fn.
function renderTextField(
    value: string | ToastRenderFn,
    wrapper: typeof VCToastTitle | typeof VCToastDescription,
): VNode {
    return h(
        wrapper,
        null,
        { default: typeof value === 'function' ? value : () => value },
    );
}

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
        // Resolved canonical-layout classes — also passed to the consumer
        // slot so custom layouts can reuse the active theme's class strings.
        const toastTheme = useComponentTheme('toast', {}, toastThemeDefaults);

        const toastApi: UseToastReturn = useToast();
        const { entries, dismiss } = toastApi;

        const rekaProps = computed(() => {
            const out: Record<string, unknown> = {};
            if (props.hotkey) out.hotkey = props.hotkey;
            if (props.label) out.label = props.label;
            return out;
        });

        // Render each queue entry. Order of precedence for layout:
        // 1. `entry.component` — per-entry full custom render (escape hatch).
        // 2. Toaster default slot — global per-entry render fn (consumer slot).
        // 3. Canonical layout — title + description + action + close.
        function renderEntry(entry: ToastEntry) {
            const onClose = () => dismiss(entry.id);

            // (1) per-entry component wins — wrap in VCToast for the
            // theme + a11y + animation infrastructure, then mount the
            // consumer's component as the body.
            if (entry.component) {
                return h(
                    VCToast,
                    {
                        key: entry.id,
                        color: entry.color,
                        variant: entry.variant,
                        duration: entry.duration,
                        'onUpdate:open': (open: boolean) => { if (!open) onClose(); },
                    },
                    () => h(entry.component!, {
                        entry,
                        dismiss: onClose,
                        ...(entry.componentProps ?? {}),
                    }),
                );
            }

            // (2) consumer slot — takes precedence over canonical layout
            // when set globally on <VCToaster>.
            if (slots.default) {
                // Wrap in a keyed Fragment so Vue diffs by entry id, not by
                // position — preserves vnode state when the queue shifts.
                // Cast through `VNode[]` because `SlotsType` types the slot
                // return as `unknown`, which trips Vue's `h()` overload
                // resolution against the `Fragment` symbol type.
                const children = slots.default({
                    entry,
                    dismiss: onClose,
                    classes: toastTheme.value,
                }) as VNode[];
                return h(Fragment, { key: entry.id }, children);
            }

            // (3) canonical layout — title + description + action + close.
            // title / description accept string OR render fn for inline
            // rich content. action accepts {label, onClick} OR render fn
            // for fully-custom action UIs.
            const body = h('div', { class: toastTheme.value.body || undefined }, [
                entry.title !== undefined ? renderTextField(entry.title, VCToastTitle) : null,
                entry.description !== undefined ? renderTextField(entry.description, VCToastDescription) : null,
                renderAction(entry, toastApi),
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

        function renderAction(entry: ToastEntry, api: UseToastReturn): VNode | null {
            if (!entry.action) return null;
            if (isActionRenderFn(entry.action)) {
                // Custom action content — pass `(id, toast)` so the render
                // fn can wire its own dismiss / update / add handlers
                // without closure capture. Wrap result in a div so Vue
                // sees a single vnode.
                return h('div', null, entry.action(entry.id, api));
            }
            const structured = entry.action;
            return h(
                VCToastAction,
                {
                    altText: structured.label,
                    onClick: () => structured.onClick(entry.id, api),
                },
                () => structured.label,
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
