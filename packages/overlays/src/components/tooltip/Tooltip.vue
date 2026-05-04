<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { TooltipRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const tooltipProps = {
    /** Controlled open state. Bind via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
    /** Per-tooltip override of the provider's hover-open delay (ms). Falls through to provider when undefined. */
    delayDuration: { type: Number as PropType<number | undefined>, default: undefined },
    /** Per-tooltip override — disable hover-only opens (focus still works). Falls through to provider when undefined. */
    disableHoverableContent: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Per-tooltip override — disable closing on pointer-down outside. Falls through to provider when undefined. */
    disableClosingTrigger: { type: Boolean as PropType<boolean | undefined>, default: undefined },
};

export type TooltipProps = ExtractPublicPropTypes<typeof tooltipProps>;

export default defineComponent({
    name: 'VCTooltip',
    inheritAttrs: false,
    props: tooltipProps,
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            TooltipRoot,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
