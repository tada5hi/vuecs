<script lang="ts">
import { computed, defineComponent, h } from 'vue';
import type {
    ExtractPublicPropTypes,
    PropType,
    PublicProps,
    SlotsType,
    VNodeArrayChildren,
} from 'vue';
import { TreeItem } from 'reka-ui';
import type { TreeItemSelectEvent, TreeItemToggleEvent } from 'reka-ui';
import { themableProps, useComponentTheme } from '@vuecs/core';
import type { GenericComponentShape } from '@vuecs/core';
import { useTree } from '../composables/context';
import { treeItemThemeDefaults } from '../theme';
import type { TreeItemThemeClasses } from '../types';

export const treeItemProps = {
    /** The consumer entity this row renders. */
    data: {
        type: null as unknown as PropType<unknown>,
        default: undefined,
    },
    /** Resolved key of this row. */
    itemKey: {
        type: String,
        required: true as const,
    },
    /** 1-based depth, mirroring reka's `aria-level`. */
    level: {
        type: Number,
        required: true as const,
    },
    /** Whether the row can be interacted with. */
    disabled: {
        type: Boolean,
        default: false,
    },
    ...themableProps<TreeItemThemeClasses>(),
};

export type TreeItemProps = ExtractPublicPropTypes<typeof treeItemProps>;

// ──────────────────────────────────────────────────────────────────────────
// Generic-over-`Item` facade (the #1601 / #1660 pattern)
//
// `<VCTreeItem>` carries an inference source (`:data`), so its `#default`
// slot infers the consumer's entity type. The runtime stays a plain
// `defineComponent`; the default export is cast to a generic call/return
// signature `vue-tsc` recognizes. See `GenericComponentShape` in
// `@vuecs/core`.
//
// Every alias below MUST stay exported AND re-exported from the package
// barrel — an unexported `interface` in the facade chain is the TS4023
// condition (#1704): invisible in-tree, fatal for any consumer that emits
// declarations.
// ──────────────────────────────────────────────────────────────────────────

export interface TreeItemSlots<Item> {
    default?: (props: {
        item: Item,
        itemKey: string,
        level: number
    }) => unknown;
}

export type TreeItemPropsGeneric<Item> = & Omit<TreeItemProps, 'data'> &
    { data?: Item } &
    PublicProps;

export type VCTreeItemComponent = <Item = Record<string, unknown>>(
    ...args: Parameters<GenericComponentShape<TreeItemPropsGeneric<Item>, TreeItemSlots<Item>>>
) => ReturnType<GenericComponentShape<TreeItemPropsGeneric<Item>, TreeItemSlots<Item>>>;

/**
 * `<VCTreeItem>` — one `treeitem` row.
 *
 * Renders reka's `TreeItem` with **`as-child`**, so the `<li>` below is the
 * element that reaches the DOM. That matters: reka's `TreeItem` binds
 * `v-bind="$attrs"` *before* its own `role` / `aria-selected`, so from the
 * outside its bindings always win — but `Primitive`'s `asChild` path routes
 * through `Slot`, which does `mergeProps(attrs, child.props)` with the
 * **child last**. So our attributes outrank reka's, and a value of
 * `undefined` removes the attribute outright.
 *
 * What we keep from reka by *not* setting it: `role="treeitem"`,
 * `aria-level`, `aria-expanded`, `data-indent` (reka's Left/Right sibling
 * navigation resolves parents and children by reading `data-indent` off its
 * collection), the roving `tabindex`, and the collection marker. `on*` keys
 * merge into an array, so reka's keydown/click handlers still run alongside
 * ours.
 *
 * A template `ref` on the `<li>` would be silently dropped — `Slot` deletes
 * the child's `ref` to protect the collection ref.
 */
const VCTreeItem = defineComponent({
    name: 'VCTreeItem',
    props: treeItemProps,
    slots: Object as SlotsType<TreeItemSlots<unknown>>,
    setup(props, { slots }) {
        const ctx = useTree();
        const theme = useComponentTheme('treeItem', props, treeItemThemeDefaults);

        const selected = computed(() => ctx.isSelected(props.itemKey));
        const indeterminate = computed(() => ctx.isIndeterminate(props.itemKey));
        const loading = computed(() => ctx.isLoading(props.itemKey));

        const ariaChecked = computed(() => {
            if (!ctx.checkboxMode.value) {
                return undefined;
            }

            if (selected.value) {
                return 'true';
            }

            return indeterminate.value ? 'mixed' : 'false';
        });

        const onSelect = (event: TreeItemSelectEvent<Record<string, unknown>>) => {
            // ALWAYS prevent: this stops reka writing its own selection state
            // and, with it, both of its buggy cascade paths. vuecs owns
            // selection end to end.
            event.preventDefault();

            if (props.disabled) {
                return;
            }

            const original = event.detail.originalEvent;
            ctx.select(props.itemKey, {
                range: original.shiftKey,
                toggle: original.ctrlKey || original.metaKey,
            });
        };

        const onToggle = (event: TreeItemToggleEvent<Record<string, unknown>>) => {
            event.preventDefault();

            if (props.disabled) {
                return;
            }

            // reka fires select AND toggle from one row click. A pointer
            // click on the row should select, not expand — the chevron
            // (which stops propagation) is the expand affordance. Keyboard
            // toggles (ArrowRight / ArrowLeft) must always work.
            if (!('key' in event.detail.originalEvent)) {
                return;
            }

            ctx.toggle(props.itemKey);
        };

        return () => h(
            TreeItem as never,
            {
                asChild: true,
                // reka constrains its item generic to `Record<string, any>`;
                // ours is deliberately unconstrained so interface-typed rows
                // infer (see the facade note above). One cast at the boundary.
                value: props.data as unknown as Record<string, unknown>,
                level: props.level,
                disabled: props.disabled,
                onSelect,
                onToggle,
            },
            {
                default: () => h(
                    'li',
                    {
                        'class': theme.value.root,
                        'style': { '--vc-tree-level': props.level },
                        'data-key': props.itemKey,
                        'aria-selected': ctx.checkboxMode.value ? undefined : selected.value,
                        'aria-checked': ariaChecked.value,
                        'aria-busy': loading.value ? 'true' : undefined,
                        'data-selected': selected.value ? '' : undefined,
                        'data-indeterminate': indeterminate.value ? '' : undefined,
                    },
                    slots.default ?
                        slots.default({
                            item: props.data,
                            itemKey: props.itemKey,
                            level: props.level,
                        }) as VNodeArrayChildren :
                        [],
                ),
            },
        );
    },
});

export default VCTreeItem as unknown as VCTreeItemComponent;
</script>
