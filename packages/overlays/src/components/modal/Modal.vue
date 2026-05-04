<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DialogRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const modalProps = {
    /** Controlled open state. Bind via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
    /** Modal mode — disables interaction with outside elements when open. */
    modal: { type: Boolean, default: true },
};

export type ModalProps = ExtractPublicPropTypes<typeof modalProps>;

export default defineComponent({
    name: 'VCModal',
    inheritAttrs: false,
    props: modalProps,
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
