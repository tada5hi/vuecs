<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { 
    Comment, 
    Fragment, 
    Text, 
    defineComponent, 
    h, 
} from 'vue';
import type { ExtractPublicPropTypes, PropType, VNode } from 'vue';
import { injectListContextOrThrow } from './context';
import type { ListBodyThemeClasses } from './types';

const listBodyProps = {
    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListBodyThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListBodyProps = ExtractPublicPropTypes<typeof listBodyProps>;

/**
 * `<VCListBody>` has two modes (Q4):
 *  - **Auto-iterate** — when only an `#item` slot is given (and no
 *    default-slot vnodes). Body iterates `data` from context, renders
 *    `#item` per row with `{ data, index, …state }` slot props. Stable
 *    keys via `useList().getItemKey()` (`itemId` / `itemKey` honoring),
 *    falling back to the row index.
 *  - **Manual** — when default-slot vnodes are present. Body renders the
 *    children as-written; iteration is the consumer's job (used for
 *    virtual scrolling and other escape-hatch scenarios). The default
 *    slot receives the full `useList()` return as slot props (Q9).
 */
function hasMeaningfulVNodes(nodes: VNode[] | undefined): boolean {
    if (!nodes) return false;
    return nodes.some((vnode) => {
        // Fragments wrap arbitrary content; recurse into children rather
        // than treating the wrapper itself as meaningful.
        if (vnode.type === Fragment) {
            const children = Array.isArray(vnode.children) ? (vnode.children as VNode[]) : undefined;
            return hasMeaningfulVNodes(children);
        }
        if (vnode.type === Comment) return false;
        if (vnode.type === Text) {
            const text = vnode.children;
            return typeof text === 'string' && text.trim().length > 0;
        }
        return true;
    });
}

export default defineComponent({
    name: 'VCListBody',
    props: listBodyProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('listBody', props, { classes: { root: 'vc-list-body' } });
        const ctx = injectListContextOrThrow('VCListBody');

        return () => {
            const rootClass = theme.value.root || undefined;

            // Manual mode: invoke default once, decide based on what came back.
            const defaultVNodes = slots.default?.(ctx as unknown as Record<string, unknown>);
            if (hasMeaningfulVNodes(defaultVNodes)) {
                return h(props.tag, { class: rootClass }, defaultVNodes);
            }

            // Auto-iterate mode: render each row through `#item`. Each
            // iteration produces a vnode array; wrap in a keyed Fragment
            // so Vue's diff treats every row as a stable unit even when
            // the slot returns multiple top-level vnodes.
            if (slots.item) {
                const rows = ctx.data.value.map((item, index) => {
                    const id = ctx.getItemKey(item as never);
                    const key = id ?? index;
                    // Spread `ctx` first so per-row `data` / `index` win
                    // over the list-state `data` (the array) — Q9 says the
                    // #item slot adds `{ data, index }` *on top of* state.
                    return h(
                        Fragment,
                        { key },
                        slots.item!({
                            ...ctx,
                            data: item,
                            index,
                        }),
                    );
                });
                return h(props.tag, { class: rootClass }, rows);
            }

            // No slot, no children — render the wrapper anyway so themes
            // can target it.
            return h(props.tag, { class: rootClass });
        };
    },
});
</script>
