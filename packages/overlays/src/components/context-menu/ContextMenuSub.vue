<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuSub } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const contextMenuSubProps = {
    /** Controlled open state. Bind via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
};

export type ContextMenuSubProps = ExtractPublicPropTypes<typeof contextMenuSubProps>;

export default defineComponent({
    name: 'VCContextMenuSub',
    inheritAttrs: false,
    props: contextMenuSubProps,
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            ContextMenuSub,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
