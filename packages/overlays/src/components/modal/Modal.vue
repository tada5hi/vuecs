<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DialogRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

export default defineComponent({
    name: 'VCModal',
    inheritAttrs: false,
    props: {
        open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
        defaultOpen: { type: Boolean, default: false },
        modal: { type: Boolean, default: true },
    },
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            DialogRoot,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
