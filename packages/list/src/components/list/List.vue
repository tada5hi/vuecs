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
import { provideListContext } from './context';
import ListHeader from './ListHeader.vue';
import ListBody from './ListBody.vue';
import ListLoading from './ListLoading.vue';
import ListNoMore from './ListNoMore.vue';
import ListFooter from './ListFooter.vue';
import type { ListThemeClasses } from './types';
import { useList } from './use-list';
import type { UseListReturn } from './use-list';

const listProps = {
    /** Pre-built `useList()` return value. When set, the simple `data`/`busy`/`total`/`meta` props are ignored (Q7). */
    state: { type: Object as PropType<UseListReturn<unknown, unknown, Record<string, unknown>>>, default: undefined },

    // Convenience props for the no-state case. Internally constructed
    // into a minimal useList() invocation if `state` is omitted.
    data: { type: Array as PropType<unknown[]>, default: undefined },
    busy: { type: Boolean, default: undefined },
    total: { type: Number, default: undefined },
    meta: { type: null as unknown as PropType<unknown>, default: undefined },

    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListProps = ExtractPublicPropTypes<typeof listProps>;

const SHORTHAND_SLOT_NAMES = ['header', 'item', 'loading', 'noMore', 'footer'] as const;

function hasMeaningfulVNodes(nodes: VNode[] | undefined): boolean {
    if (!nodes) return false;
    return nodes.some((vnode) => {
        // Fragments wrap arbitrary content (e.g. <template> blocks, slot
        // forwarding); recurse into children rather than treating the
        // wrapper itself as meaningful — an empty fragment is empty.
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

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

export default defineComponent({
    name: 'VCList',
    props: listProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('list', props, { classes: { root: 'vc-list' } });

        // Q7 — `:state` wins over the simple props; both is a usage error.
        // Resolved once at setup. `useList()` already wraps its inputs in
        // `computed`, so the simple-prop path stays reactive without a
        // `computed` wrapper out here.
        if (isDev && props.state && (
            props.data !== undefined ||
            props.busy !== undefined ||
            props.total !== undefined ||
            props.meta !== undefined
        )) {
            console.warn(
                '[VCList] Both `:state` and one of `:data` / `:busy` / `:total` / `:meta` were provided. ' +
                '`:state` wins; the convenience props are ignored.',
            );
        }

        const state = props.state ?? useList({
            data: () => props.data ?? [],
            busy: () => !!props.busy,
            total: () => props.total,
            meta: () => props.meta,
        });

        provideListContext(state);

        return () => {
            // Pass state into the default slot so compound consumers can
            // bind it: `<VCList v-slot="{ data, busy, ... }">`. Children
            // also have it via context injection — slot props are an
            // ergonomic shortcut.
            const defaultVNodes = slots.default?.(state as unknown as Record<string, unknown>);
            const isCompound = hasMeaningfulVNodes(defaultVNodes);
            const usesShorthand = SHORTHAND_SLOT_NAMES.some((name) => slots[name]);

            // Q10 — warn in dev if both modes are used at once.
            if (isDev && isCompound && usesShorthand) {
                console.warn(
                    '[VCList] Detected both compound children and named shorthand slots. Pick one mode per `<VCList>` instance — ' +
                    'either compose children (`<VCListBody>`, `<VCListHeader>`, …) explicitly OR use the named slots ' +
                    '(`#header`, `#item`, …) to let `<VCList>` auto-compose. Falling back to compound mode for this render.',
                );
            }

            const rootClass = theme.value.root || undefined;

            if (isCompound) {
                return h(props.tag, { class: rootClass }, defaultVNodes);
            }

            // Shorthand mode: auto-compose all five sections, threading
            // each named slot to the matching part. Empty slots fall through
            // to the part's own default rendering (e.g. <VCListNoMore>'s
            // behavioral-defaults content).
            type SlotCtx = Record<string, unknown>;
            const children: VNode[] = [
                h(ListHeader, {}, slots.header ? { default: (ctx: SlotCtx) => slots.header!(ctx) } : {}),
                h(ListBody, {}, slots.item ? { item: (ctx: SlotCtx) => slots.item!(ctx) } : {}),
                h(ListLoading, {}, slots.loading ? { default: (ctx: SlotCtx) => slots.loading!(ctx) } : {}),
                h(ListNoMore, {}, slots.noMore ? { default: (ctx: SlotCtx) => slots.noMore!(ctx) } : {}),
                h(ListFooter, {}, slots.footer ? { default: (ctx: SlotCtx) => slots.footer!(ctx) } : {}),
            ];

            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
