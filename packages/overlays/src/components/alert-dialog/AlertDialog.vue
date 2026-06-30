<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { AlertDialogRoot } from 'reka-ui';
import { useForwardPropsEmits } from '@vuecs/core';

const alertDialogProps = {
    /** Controlled open state. Bind via `v-model:open`. */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
};

export type AlertDialogProps = ExtractPublicPropTypes<typeof alertDialogProps>;

export default defineComponent({
    name: 'VCAlertDialog',
    inheritAttrs: false,
    props: alertDialogProps,
    emits: ['update:open'],
    setup(props, { slots, emit }) {
        // `AlertDialogRoot` is always modal (Reka forces `:modal="true"`),
        // so there is no `modal` prop to forward — unlike `<VCModal>`.
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            AlertDialogRoot,
            forwarded.value,
            { default: () => slots.default?.() },
        );
    },
});
</script>
