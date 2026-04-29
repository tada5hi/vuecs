<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { 
    ExtractPublicPropTypes, 
    PropType, 
    SlotsType, 
    VNode, 
} from 'vue';
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
     * (default slot only) instead of emitting a wrapper. The default
     * slot is the only as-child target — the layout slots
     * (`text` / `actions` / `actionsExtra`) are wrapper-bound by
     * design.
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
        text: ListItemSlotProps;
        actions: ListItemSlotProps;
        actionsExtra: ListItemSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listItem', props, {
            classes: {
                root: 'vc-list-item',
                textWrapper: 'vc-list-item-text',
                actionsWrapper: 'vc-list-item-actions',
                actionsExtraWrapper: 'vc-list-item-actions-extra',
            },
        });

        return () => {
            const slotProps: ListItemSlotProps = { data: props.data, index: props.index };
            const rootClass = theme.value.root || undefined;

            if (slots.default) {
                const children = slots.default(slotProps);
                if (props.asChild) {
                    const cloned = applyAsChild(children, { class: rootClass });
                    if (cloned) return cloned;
                }
                return h(props.tag, { class: rootClass }, children);
            }

            // Layout-slot mode: wrap each populated slot in its own
            // theme-keyed div. as-child has no effect here (the
            // wrappers are the contract).
            const parts: VNode[] = [];
            if (slots.text) {
                parts.push(h('div', { class: theme.value.textWrapper || undefined }, slots.text(slotProps)));
            }
            if (slots.actions) {
                parts.push(h('div', { class: theme.value.actionsWrapper || undefined }, slots.actions(slotProps)));
            }
            if (slots.actionsExtra) {
                parts.push(h('div', { class: theme.value.actionsExtraWrapper || undefined }, slots.actionsExtra(slotProps)));
            }
            return h(props.tag, { class: rootClass }, parts);
        };
    },
});
</script>
