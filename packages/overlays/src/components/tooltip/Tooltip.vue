<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { TooltipRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

export default defineComponent({
    name: 'VCTooltip',
    inheritAttrs: false,
    props: {
        open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
        defaultOpen: { type: Boolean, default: false },
        delayDuration: { type: Number as PropType<number | undefined>, default: undefined },
        disableHoverableContent: { type: Boolean as PropType<boolean | undefined>, default: undefined },
        disableClosingTrigger: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    },
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
