<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { HoverCardRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const hoverCardProps = {
    /** Controlled open state. Bind via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
    /** Delay (ms) from pointer-enter to opening. */
    openDelay: { type: Number, default: 700 },
    /** Delay (ms) from pointer-leave to closing — covers grace-area travel. */
    closeDelay: { type: Number, default: 300 },
};

export type HoverCardProps = ExtractPublicPropTypes<typeof hoverCardProps>;

export default defineComponent({
    name: 'VCHoverCard',
    inheritAttrs: false,
    props: hoverCardProps,
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            HoverCardRoot,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
