<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import {
    Fragment,
    cloneVNode,
    defineComponent,
    h,
} from 'vue';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNode,
} from 'vue';
import { useList } from '../../composables';
import {
    applyAsChild,
    hasMeaningfulVNodes,
    meaningfulVNodes,
} from '../../utils';
import type { ListBodyThemeClasses } from '../../types';

const listBodyProps = {
    /**
     * Inner list element. Default `'ul'` — emits semantic HTML so screen
     * readers announce "list, N items". Set `'ol'` for ordered lists.
     * Accepts a string tag or a component.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'ul' },
    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    /**
     * Reka-style as-child: render by cloning the slot's single root vnode
     * instead of emitting a wrapper. Only honored in manual mode (default
     * slot with content); auto-iterate mode always emits the wrapper.
     */
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListBodyThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListBodyProps = ExtractPublicPropTypes<typeof listBodyProps>;

type ListBodyItemSlotProps = {
    data: unknown;
    index: number;
};

/**
 * `<VCListBody>` — the inner `<ul>` element. Render condition is **data
 * presence only**: emits when `data.length > 0`. Does NOT auto-hide on
 * `busy` — that decoupling is what makes Loading-Inline and
 * Loading-Skeleton patterns possible (consumer can render extra `<li>`s
 * inside while loading).
 *
 * Two render modes:
 *  - **Auto-iterate** (default): supply an `#item` slot; the body iterates
 *    `data` from context and renders `#item` per row inside a single
 *    `<ul>` wrapper. `:key` resolution via `useList().state.getItemKey()`,
 *    falling back to iteration index.
 *  - **Manual** (escape hatch): supply default-slot vnodes directly. The
 *    body renders them as-written; iteration is the consumer's job
 *    (virtual scrolling, ad-hoc layouts).
 *
 * When the parent `<VCList>` has `selection-mode` set, the body upgrades
 * its ARIA role to `listbox` (+ `aria-multiselectable` for multi).
 */
export const listBodyThemeDefaults: ComponentThemeDefinition<ListBodyThemeClasses> = { classes: { root: 'vc-list-body' } };

export default defineComponent({
    name: 'VCListBody',
    props: listBodyProps,
    slots: Object as SlotsType<{
        default: { data: unknown[] };
        item: ListBodyItemSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listBody', props, listBodyThemeDefaults);
        const { state, selection } = useList<unknown>('VCListBody');

        return () => {
            // Render condition: data presence only, NOT busy. This is the
            // load-bearing decoupling that lets Loading-Inline /
            // Loading-Skeleton patterns coexist with default sibling
            // loading. When data is empty, sibling `<VCListEmpty>` /
            // `<VCListLoading>` cover the state.
            if (state.data.value.length === 0) return null;

            const rootClass = theme.value.root || undefined;

            // ARIA role transition when selection is active. Listbox
            // semantics override the implicit `role="list"` of `<ul>`.
            const ariaAttrs: Record<string, string | boolean> = {};
            if (selection.mode.value !== undefined) {
                ariaAttrs.role = 'listbox';
                if (selection.mode.value === 'multi') {
                    ariaAttrs['aria-multiselectable'] = 'true';
                }
            }

            // Manual mode: invoke default once, dispatch based on result.
            const defaultVNodes = slots.default?.({ data: state.data.value });
            if (hasMeaningfulVNodes(defaultVNodes)) {
                if (props.asChild) {
                    const cloned = applyAsChild(defaultVNodes, { class: rootClass, ...ariaAttrs });
                    if (cloned) return cloned;
                }
                return h(props.tag ?? props.as, { class: rootClass, ...ariaAttrs }, defaultVNodes);
            }

            // Auto-iterate mode: render each row through `#item`.
            if (slots.item) {
                const rows: VNode[] = state.data.value.map((item, index) => {
                    const id = state.getItemKey(item);
                    const key = id ?? index;
                    const slotProps: ListBodyItemSlotProps = { data: item, index };
                    const result = slots.item!(slotProps);
                    const meaningful = meaningfulVNodes(result);
                    if (meaningful.length === 1) {
                        return cloneVNode(meaningful[0]!, { key });
                    }
                    return h(Fragment, { key }, result);
                });
                return h(props.tag ?? props.as, { class: rootClass, ...ariaAttrs }, rows);
            }

            // No slot, no children — render empty wrapper so themes can
            // still target it. Edge case (consumer wrote `<VCListBody />`
            // with no slots).
            return h(props.tag ?? props.as, { class: rootClass, ...ariaAttrs });
        };
    },
});
</script>
