<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { applyAsChild } from './render-utils';
import type { ListItemThemeClasses } from './types';

const listItemProps = {
    /** The item record this row represents. Forwarded as a slot prop. */
    data: { type: null as unknown as PropType<unknown>, default: undefined },
    /** Index of this row in the source list. Forwarded as a slot prop. */
    index: { type: Number, default: undefined },
    tag: { type: String, default: 'div' },
    /**
     * Reka-style as-child: render by cloning the slot's first vnode
     * (merging the part's class onto it) instead of emitting a wrapper.
     */
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListItemThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListItemProps = ExtractPublicPropTypes<typeof listItemProps>;

export type ListItemSlotProps<T = unknown> = {
    data: T;
    index: number | undefined;
};

export default defineComponent({
    name: 'VCListItem',
    props: listItemProps,
    slots: Object as SlotsType<{
        default: ListItemSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listItem', props, { classes: { root: 'vc-list-item' } });

        return () => {
            const slotProps: ListItemSlotProps = { data: props.data, index: props.index };
            const rootClass = theme.value.root || undefined;
            const children = slots.default?.(slotProps);
            if (props.asChild) {
                const cloned = applyAsChild(children, { class: rootClass });
                if (cloned) return cloned;
            }
            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
