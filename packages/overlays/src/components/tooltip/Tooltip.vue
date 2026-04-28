<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { TooltipRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const tooltipProps = {
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    delayDuration: { type: Number as PropType<number | undefined>, default: undefined },
    disableHoverableContent: { type: Boolean as PropType<boolean | undefined>, default: undefined },
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
