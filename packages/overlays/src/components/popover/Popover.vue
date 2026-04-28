<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { PopoverRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const popoverProps = {
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    modal: { type: Boolean, default: false },
};

export type PopoverProps = ExtractPublicPropTypes<typeof popoverProps>;

export default defineComponent({
    name: 'VCPopover',
    inheritAttrs: false,
    props: popoverProps,
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            PopoverRoot,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
