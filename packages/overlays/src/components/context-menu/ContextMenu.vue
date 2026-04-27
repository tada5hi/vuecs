<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

export default defineComponent({
    name: 'VCContextMenu',
    inheritAttrs: false,
    props: {
        modal: { type: Boolean, default: true },
        dir: { type: String as PropType<'ltr' | 'rtl' | undefined>, default: undefined },
    },
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            ContextMenuRoot,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
