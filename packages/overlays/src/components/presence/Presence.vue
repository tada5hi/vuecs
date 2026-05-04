<script lang="ts">
import { defineComponent, h } from 'vue';
import { Presence } from 'reka-ui';
import type { VCPresenceProps } from './types';

/**
 * Animation lifecycle wrapper. Keeps the wrapped subtree mounted while
 * `present` is true, and waits for in-flight `data-state` CSS animations
 * to finish before unmounting when `present` flips to false.
 *
 * Wraps Reka's `Presence` primitive without re-exporting it directly —
 * the props shape is vuecs-owned (see `VCPresenceProps`).
 */
export default defineComponent({
    name: 'VCPresence',
    inheritAttrs: false,
    props: {
        /** Whether the wrapped subtree should be mounted. Toggle to trigger enter/exit animations. */
        present: { type: Boolean, required: true },
        /** Force the subtree to stay mounted regardless of `present` (debug / programmatic transition control). */
        forceMount: { type: Boolean, default: false },
    } satisfies Record<keyof VCPresenceProps, unknown>,
    setup(props, { slots }) {
        return () => h(
            Presence,
            {
                present: props.present,
                forceMount: props.forceMount,
            },
            { default: (scope: { present: boolean }) => slots.default?.(scope) },
        );
    },
});
</script>
