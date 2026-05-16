<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ToastProvider } from 'reka-ui';
import { useForwardProps } from '@vuecs/core';

const toastProviderProps = {
    /** Default auto-dismiss timeout (ms). Reka default: `5000`. Per-toast `duration` overrides. */
    duration: { type: Number, default: 5000 },
    /** Label announced by screen readers when a toast renders. */
    label: { type: String, default: 'Notification' },
    /** Swipe direction that dismisses a toast via touch. Reka default: `'right'`. */
    swipeDirection: { type: String as PropType<'up' | 'down' | 'left' | 'right'>, default: 'right' },
    /** Pixels swiped before a dismissal is registered. Reka default: `50`. */
    swipeThreshold: { type: Number, default: 50 },
};

export type ToastProviderProps = ExtractPublicPropTypes<typeof toastProviderProps>;

/**
 * App-level Toast configuration. Wrap your app (or specific subtrees) once
 * to control duration + swipe behaviour for every nested `<VCToast>`.
 *
 * Maps to Reka's `ToastProvider`. The `<VCToaster>` viewport — typically
 * rendered as a child of this provider — reads its queue from the shared
 * `useToast()` singleton.
 */
export default defineComponent({
    name: 'VCToastProvider',
    inheritAttrs: false,
    props: toastProviderProps,
    setup(props, { slots }) {
        // `useForwardProps` (not `useForwardPropsEmits`) — `ToastProvider`
        // exposes no events, and `useEmitAsProps` warns about empty `emits`.
        const forwarded = useForwardProps(props);
        return () => h(
            ToastProvider,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
