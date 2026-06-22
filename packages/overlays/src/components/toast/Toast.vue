<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { ToastRoot } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { toastThemeDefaults } from './theme';
import type { ToastColor, ToastThemeClasses, ToastVariant } from './types';

const toastProps = {
    /** Semantic color — drives the `color` theme variant. */
    color: { type: String as PropType<ToastColor>, default: undefined },
    /** Visual treatment — `solid` / `soft` / `outline`. */
    variant: { type: String as PropType<ToastVariant>, default: undefined },
    /**
     * Auto-dismiss timeout (ms). Falls back to the `<VCToastProvider>`
     * default. Use `0` for a persistent toast (no auto-dismiss).
     */
    duration: { type: Number, default: undefined },
    /**
     * Reka `type` — `'foreground'` interrupts AT (use for errors / urgent
     * messages); `'background'` queues politely.
     *
     * Vuecs convention: defaults to `'background'` (Reka's default is
     * `'foreground'`). Most toasts are informational and shouldn't
     * interrupt screen-reader users; explicit `type="foreground"` opts
     * into the louder announcement for urgent error toasts.
     */
    type: { type: String as PropType<'foreground' | 'background'>, default: 'background' },
    /**
     * Controlled open state. Leave undefined to let Reka's internal state
     * machine manage open/close lifecycle from `defaultOpen` + the
     * auto-dismiss timer. `<VCToaster>` deliberately doesn't bind this —
     * it dismisses entries via the queue, letting Reka own per-toast state.
     */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state when `open` is undefined. */
    defaultOpen: { type: Boolean, default: true },
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'li' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<ToastThemeClasses>(),
};

export type ToastProps = ExtractPublicPropTypes<typeof toastProps>;

export default defineComponent({
    name: 'VCToast',
    inheritAttrs: false,
    props: toastProps,
    emits: ['update:open', 'escape-key-down', 'pause', 'resume', 'swipe-start', 'swipe-move', 'swipe-cancel', 'swipe-end'],
    setup(props, {
        attrs, 
        slots, 
        emit, 
    }) {
        const themeProps = useThemeProps(props, 'color', 'variant');
        const theme = useComponentTheme('toast', themeProps, toastThemeDefaults);

        return () => h(
            ToastRoot,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                type: props.type,
                open: props.open,
                defaultOpen: props.defaultOpen,
                duration: props.duration,
                class: theme.value.root || undefined,
                'onUpdate:open': (open: boolean) => emit('update:open', open),
                onEscapeKeyDown: (e: Event) => emit('escape-key-down', e),
                onPause: () => emit('pause'),
                onResume: () => emit('resume'),
                onSwipeStart: (e: Event) => emit('swipe-start', e),
                onSwipeMove: (e: Event) => emit('swipe-move', e),
                onSwipeCancel: (e: Event) => emit('swipe-cancel', e),
                onSwipeEnd: (e: Event) => emit('swipe-end', e),
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
