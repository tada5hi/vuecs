<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { VisuallyHidden } from 'reka-ui';

const visuallyHiddenProps = {
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'span' },
};

export type VisuallyHiddenProps = ExtractPublicPropTypes<typeof visuallyHiddenProps>;

export default defineComponent({
    name: 'VCVisuallyHidden',
    inheritAttrs: false,
    props: visuallyHiddenProps,
    setup(props, { attrs, slots }) {
        return () => h(
            VisuallyHidden,
            mergeProps(attrs, { as: props.as }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
