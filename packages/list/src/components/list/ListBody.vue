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
    ExtractPublicPropTypes, 
    PropType, 
    SlotsType, 
    VNode, 
} from 'vue';
import { useList } from '../../composables';
import type { ListState } from '../../composables';
import {
    applyAsChild,
    hasMeaningfulVNodes,
    meaningfulVNodes,
    mergeSlotProps,
} from '../../utils';
import type { ListBodyThemeClasses } from '../../types';

const listBodyProps = {
    tag: { type: String, default: 'div' },
    /**
     * Reka-style as-child: only honored in **manual mode** (when the
     * default slot supplies content directly). Auto-iterate mode emits
     * one vnode per row, which is structurally not a single-vnode case.
     */
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListBodyThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListBodyProps = ExtractPublicPropTypes<typeof listBodyProps>;

type ListBodyState = ListState<unknown, Record<string, unknown>>;
type ListItemSlotPayload = ListBodyState & { data: unknown; index: number };

/**
 * `<VCListBody>` has two modes (Q4):
 *  - **Auto-iterate** when only an `#item` slot is given (and no
 *    default-slot vnodes). Body iterates `data` from context, renders
 *    `#item` per row with the full `defineList()` state plus per-row
 *    `{ data, index }` slot props (per-row keys win — see
 *    `mergeSlotProps`). Stable `:key` resolution via
 *    `useList().getItemKey()`, falling back to the row index.
 *  - **Manual** when default-slot vnodes are present. Body renders the
 *    children as-written; iteration is the consumer's job (used for
 *    virtual scrolling and other escape-hatch scenarios). The default
 *    slot receives the full `defineList()` return as slot props (Q9).
 */
export const listBodyThemeDefaults: ComponentThemeDefinition<ListBodyThemeClasses> = { classes: { root: 'vc-list-body' } };

export default defineComponent({
    name: 'VCListBody',
    props: listBodyProps,
    slots: Object as SlotsType<{
        default: ListBodyState;
        item: ListItemSlotPayload;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listBody', props, listBodyThemeDefaults);
        const ctx = useList('VCListBody');

        return () => {
            const rootClass = theme.value.root || undefined;

            // Manual mode: invoke default once, decide based on what came back.
            const defaultVNodes = slots.default?.(ctx);
            if (hasMeaningfulVNodes(defaultVNodes)) {
                if (props.asChild) {
                    const cloned = applyAsChild(defaultVNodes, { class: rootClass });
                    if (cloned) return cloned;
                }
                return h(props.tag, { class: rootClass }, defaultVNodes);
            }

            // Auto-iterate mode: render each row through `#item`.
            // Optimisation (#2): when the slot returns exactly one
            // meaningful vnode, key it directly via cloneVNode instead
            // of wrapping in a keyed Fragment — saves one vnode per row.
            if (slots.item) {
                const rows: VNode[] = ctx.data.value.map((item, index) => {
                    const id = ctx.getItemKey(item as never);
                    const key = id ?? index;
                    const slotProps = mergeSlotProps(ctx, { data: item, index });
                    const result = slots.item!(slotProps as ListItemSlotPayload);
                    const meaningful = meaningfulVNodes(result);
                    if (meaningful.length === 1) {
                        return cloneVNode(meaningful[0], { key });
                    }
                    return h(Fragment, { key }, result);
                });
                return h(props.tag, { class: rootClass }, rows);
            }

            // No slot, no children — render the wrapper anyway so themes
            // can target it (or hide it via `:empty`).
            return h(props.tag, { class: rootClass });
        };
    },
});
</script>
