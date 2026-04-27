<script lang="ts">
import { defineComponent, h } from 'vue';
import { TooltipProvider } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

/**
 * App-level tooltip configuration. Wrap your app once (or specific subtrees)
 * to control delays + skip-grouping for every nested `<VCTooltip>`.
 *
 * Maps to Reka's `TooltipProvider`.
 */
export default defineComponent({
    name: 'VCTooltipProvider',
    inheritAttrs: false,
    props: {
        /** Delay before opening on hover, ms. */
        delayDuration: { type: Number, default: 700 },
        /** Window after a tooltip closes during which sibling tooltips skip the delay. */
        skipDelayDuration: { type: Number, default: 300 },
        /** Disable hovering-only opens (focus still works). */
        disableHoverableContent: { type: Boolean, default: false },
        /** Disable closing on pointer-down outside content. */
        disableClosingTrigger: { type: Boolean, default: false },
    },
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            TooltipProvider,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
