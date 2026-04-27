<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

export default defineComponent({
    name: 'VCDropdownMenu',
    inheritAttrs: false,
    props: {
        open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
        defaultOpen: { type: Boolean, default: false },
        modal: { type: Boolean, default: true },
        dir: { type: String as PropType<'ltr' | 'rtl' | undefined>, default: undefined },
    },
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            DropdownMenuRoot,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
