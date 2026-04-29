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
        // Spread attrs first so the `name` prop always wins; otherwise a
        // consumer's stray `icon=` attr (e.g. via v-bind="$attrs") could
        // override the prop value silently.
        return () => h(Icon, { ...attrs, icon: props.name });
    },
});
</script>
