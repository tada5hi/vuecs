<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuSub } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const dropdownMenuSubProps = {
    /** Controlled open state. Bind via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
};

export type DropdownMenuSubProps = ExtractPublicPropTypes<typeof dropdownMenuSubProps>;

export default defineComponent({
    name: 'VCDropdownMenuSub',
    inheritAttrs: false,
    props: dropdownMenuSubProps,
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            DropdownMenuSub,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
