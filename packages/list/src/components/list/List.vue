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
import { defineList, provideList } from '../../composables';
import type { ListState } from '../../composables';
import ListHeader from './ListHeader.vue';
import ListBody from './ListBody.vue';
import ListLoading from './ListLoading.vue';
import ListEmpty from './ListEmpty.vue';
import ListFooter from './ListFooter.vue';
import { applyAsChild, hasMeaningfulVNodes, mergeSlotProps } from '../../utils';
import type { ListThemeClasses } from '../../types';

const listProps = {
    /** Pre-built `defineList()` return value. When set, the simple `data`/`busy`/`total`/`meta` props are ignored (Q7). */
    state: { type: Object as PropType<ListState<unknown, Record<string, unknown>>>, default: undefined },

    // Convenience props for the no-state case. Internally constructed
    // into a minimal defineList() invocation if `state` is omitted.
    data: { type: Array as PropType<unknown[]>, default: undefined },
    busy: { type: Boolean, default: undefined },
    total: { type: Number, default: undefined },
    meta: { type: Object as PropType<Record<string, unknown>>, default: undefined },

    tag: { type: String, default: 'div' },
    /**
     * Reka-style as-child: render by cloning the default slot's first
     * vnode (compound mode) instead of emitting a wrapper. Has no
     * effect in shorthand mode — the auto-composed parts always need
     * a real wrapper to host them.
     */
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListProps = ExtractPublicPropTypes<typeof listProps>;

const SHORTHAND_SLOT_NAMES = ['header', 'item', 'loading', 'empty', 'footer'] as const;

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

export default defineComponent({
    name: 'VCList',
    props: listProps,
    slots: Object as SlotsType<{
        default: ListState;
        header: ListState;
        item: ListState & { data: unknown; index: number };
        loading: ListState;
        empty: ListState;
        footer: ListState;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('list', props, { classes: { root: 'vc-list' } });

        // Q7 — `:state` wins over the simple props; both is a usage error.
        // Resolved once at setup. `defineList()` already wraps its inputs in
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

        // `meta` is forwarded verbatim by `defineList()` (no longer a
        // MaybeRefOrGetter under the unified contract), so the convenience
        // path snapshots `props.meta` at setup time. Consumers needing
        // reactive meta should construct their own state and pass `:state`.
        const state: ListState = props.state ?? defineList({
            data: () => props.data ?? [],
            busy: () => !!props.busy,
            total: () => props.total,
            meta: props.meta,
        });

        provideList(state);

        return () => {
            // Pass state into the default slot so compound consumers can
            // bind it: `<VCList v-slot="{ data, busy, ... }">`. Children
            // also have it via context injection — slot props are an
            // ergonomic shortcut.
            const defaultVNodes = slots.default?.(state);
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
                if (props.asChild) {
                    const cloned = applyAsChild(defaultVNodes, { class: rootClass });
                    if (cloned) return cloned;
                }
                return h(props.tag, { class: rootClass }, defaultVNodes);
            }

            // Shorthand mode: auto-compose all five sections, threading
            // each named slot to the matching part. Empty slots fall through
            // to the part's own default rendering (e.g. <VCListEmpty>'s
            // behavioral-defaults content).
            const children: VNode[] = [
                h(ListHeader, {}, slots.header ?
                    { default: (ctx: ListState) => slots.header!(ctx) } :
                    {}),
                h(ListBody, {}, slots.item ?
                    {
                        item: (ctx: ListState & { data: unknown; index: number }) => slots.item!(
                            mergeSlotProps(ctx, {}),
                        ),
                    } :
                    {}),
                h(ListLoading, {}, slots.loading ?
                    { default: (ctx: ListState) => slots.loading!(ctx) } :
                    {}),
                h(ListEmpty, {}, slots.empty ?
                    { default: (ctx: ListState) => slots.empty!(ctx) } :
                    {}),
                h(ListFooter, {}, slots.footer ?
                    { default: (ctx: ListState) => slots.footer!(ctx) } :
                    {}),
            ];

            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
