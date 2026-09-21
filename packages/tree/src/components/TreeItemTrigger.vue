<script lang="ts">
import { defineComponent, h } from 'vue';
import type { SlotsType } from 'vue';
import { useTree } from '../composables/context';

export type TreeItemTriggerSlotProps = {
    expanded: boolean,
    loading: boolean,
    /** Invoke to expand or collapse the row. */
    toggle: () => void
};

export const treeItemTriggerProps = {
    /** The key of the row this trigger belongs to. */
    itemKey: {
        type: String,
        required: true as const,
    },
    /** Whether the row is currently expanded. */
    expanded: {
        type: Boolean,
        default: false,
    },
    /** Whether the row's children are being fetched. */
    loading: {
        type: Boolean,
        default: false,
    },
};

/**
 * `<VCTreeItemTrigger>` — the expand / collapse chevron.
 *
 * Deliberately **decorative** (`aria-hidden`, not focusable): per the WAI-ARIA
 * TreeView pattern the `treeitem` row itself is the control — it carries
 * `aria-expanded` and handles ArrowRight / ArrowLeft. A second focusable
 * element per row would add a tab stop the pattern doesn't have, and
 * `aria-hidden` on a focusable element is itself an a11y defect.
 *
 * It `stopPropagation()`s its click so the surrounding row neither selects
 * nor toggles — expanding a branch is not selecting it.
 */
export default defineComponent({
    name: 'VCTreeItemTrigger',
    props: treeItemTriggerProps,
    slots: Object as SlotsType<{ default?: TreeItemTriggerSlotProps }>,
    setup(props, { slots }) {
        const ctx = useTree();

        const toggle = () => ctx.toggle(props.itemKey);

        const onClick = (event: globalThis.MouseEvent) => {
            event.stopPropagation();
            event.preventDefault();
            toggle();
        };

        return () => h('span', {
            'class': ctx.classes.value.trigger,
            'aria-hidden': 'true',
            'data-vc-tree-trigger': '',
            'data-state': props.expanded ? 'open' : 'closed',
            'data-loading': props.loading ? '' : undefined,
            onClick,
        }, slots.default ?
            slots.default({
                expanded: props.expanded,
                loading: props.loading,
                toggle,
            }) :
            [h('span', { class: ctx.classes.value.triggerIcon })]);
    },
});
</script>
