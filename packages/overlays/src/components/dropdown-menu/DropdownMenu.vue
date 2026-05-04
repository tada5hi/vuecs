<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const dropdownMenuProps = {
    /** Controlled open state. Bind via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
    /** Modal mode — locks focus inside the menu and blocks outside interaction. */
    modal: { type: Boolean, default: true },
    /** Reading direction for the menu content. Falls through to `<VCConfigProvider>` / browser default when undefined. */
    dir: { type: String as PropType<'ltr' | 'rtl' | undefined>, default: undefined },
};

export type DropdownMenuProps = ExtractPublicPropTypes<typeof dropdownMenuProps>;

export default defineComponent({
    name: 'VCDropdownMenu',
    inheritAttrs: false,
    props: dropdownMenuProps,
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
