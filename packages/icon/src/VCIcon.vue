<script lang="ts">
import { Icon } from '@iconify/vue';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes } from 'vue';

const vcIconProps = { name: { type: String, required: true as const } };

export type VCIconProps = ExtractPublicPropTypes<typeof vcIconProps>;

export default defineComponent({
    name: 'VCIcon',
    inheritAttrs: false,
    props: vcIconProps,
    setup(props, { attrs }) {
        return () => h(Icon, { icon: props.name, ...attrs });
    },
});
</script>
