<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import {
    computed, 
    defineComponent, 
    h, 
    shallowRef, 
    triggerRef,
} from 'vue';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
} from 'vue';
import {
    defineList,
    provideListContext,
    useSelectionMachine,
} from '../../composables';
import type { ListState, SelectionKey, SelectionMode } from '../../composables';
import type { ListThemeClasses } from '../../types';

const listProps = {
    /** Pre-built `defineList()` return value. When set, the convenience props are ignored. */
    state: {
        type: Object as PropType<ListState<unknown, Record<string, unknown>>>,
        default: undefined,
    },

    /** Convenience props for the no-state case. Internally constructed via `defineList()`. */
    data: { type: Array as PropType<unknown[]>, default: undefined },
    busy: { type: Boolean, default: undefined },
    total: { type: Number, default: undefined },
    meta: { type: Object as PropType<Record<string, unknown>>, default: undefined },

    /**
     * Outer container element. Default `'div'`. Set `'section'` (+
     * `aria-labelledby`) for landmark semantics; otherwise leave it as
     * a generic container.
     */
    tag: { type: String, default: 'div' },

    /**
     * Selection cardinality. Setting this opts into listbox ARIA
     * semantics, keyboard navigation, and selectable rows. Omit to
     * disable selection entirely.
     */
    selectionMode: {
        type: String as PropType<SelectionMode>,
        default: undefined,
        validator: (value: unknown): boolean => value === undefined || value === 'single' || value === 'multi',
    },

    /**
     * `v-model:selection` — bound by parent. `SelectionKey[]` for multi,
     * `SelectionKey | null` for single. Items are identified via the
     * `getItemKey()` configured on the underlying `defineList()`.
     *
     * `null` is accepted at runtime even though it's not listed in
     * `type` — Vue only enforces `type` for the listed constructors and
     * allows `null` regardless (unless `required: true`).
     */
    selection: {
        type: [Array, String, Number] as PropType<SelectionKey[] | SelectionKey | null>,
        default: null,
    },

    themeClass: { type: Object as PropType<ThemeClassesOverride<ListThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListProps = ExtractPublicPropTypes<typeof listProps>;

const isDev = (() => {
    const p = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
    return p !== undefined && p.env?.NODE_ENV !== 'production';
})();

export const listThemeDefaults: ComponentThemeDefinition<ListThemeClasses> = {
    classes: {
        root: 'vc-list',
        header: 'vc-list-header',
        footer: 'vc-list-footer',
    },
};

/**
 * `<VCList>` — outer container + state + selection coordinator.
 *
 * Owns:
 *  - The `defineList()` state (data / busy / total / meta + mutators)
 *  - Theme-class resolution for the list-level slot map (root / header / footer)
 *  - Selection state machine (single / multi v-model)
 *
 * Renders a generic `<div>` (configurable via `tag`) with the default
 * slot's children. The default slot is given resolved theme classes as
 * a slot prop; descendants read state + selection via `useList()`.
 *
 * Header / footer chrome is consumer-authored markup with classes from
 * the slot prop:
 *
 * ```vue
 * <VCList :data="items">
 *   <template v-slot="{ classes }">
 *     <header :class="classes.header">…</header>
 *     <VCListBody>…</VCListBody>
 *     <footer :class="classes.footer">…</footer>
 *   </template>
 * </VCList>
 * ```
 */
export default defineComponent({
    name: 'VCList',
    props: listProps,
    emits: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        'update:selection': (value: SelectionKey[] | SelectionKey | null) => true,
    },
    slots: Object as SlotsType<{
        default: { classes: ListThemeClasses };
    }>,
    setup(props, { slots, emit }) {
        const theme = useComponentTheme('list', props, listThemeDefaults);

        if (isDev && props.state && (
            props.data !== undefined ||
            props.busy !== undefined ||
            props.total !== undefined ||
            props.meta !== undefined
        )) {
            // eslint-disable-next-line no-console
            console.warn(
                '[VCList] Both `:state` and one of `:data` / `:busy` / `:total` / `:meta` were provided. ' +
                '`:state` wins; the convenience props are ignored.',
            );
        }

        // `data`/`busy`/`total` pass getters so they react to prop
        // updates. `meta` is captured by value — matches
        // `defineList`'s "verbatim forward" semantic. Consumers who
        // need reactive meta inside the convenience-prop path should
        // wrap individual fields in `Ref` / `computed` themselves
        // (e.g. `:meta="{ count: computed(...) }"`) OR construct a
        // `ListState` via `defineList()` directly and pass `:state`.
        const state: ListState = props.state ?? defineList({
            data: () => props.data ?? [],
            busy: () => !!props.busy,
            total: () => props.total,
            meta: props.meta,
        });

        // Selection state machine. Always present in the context bag;
        // when `selectionMode` is undefined, the machine reports
        // `isSelected: () => false` and `toggle` is a no-op — so
        // descendants don't need to null-check before calling.
        const selectionMode = computed(() => props.selectionMode);
        const selectionValue = computed(() => props.selection);
        const keyAt = (index: number): SelectionKey | undefined => {
            const item = state.data.value[index];
            if (item === undefined) return undefined;
            return state.getItemKey(item);
        };
        const selection = useSelectionMachine({
            mode: selectionMode,
            value: selectionValue,
            emit: (next) => emit('update:selection', next),
            keyAt,
        });

        const classes = computed(() => theme.value);

        // Tab-stop registry. Each `<VCListItem>` calls `register`
        // when it's selectable + enabled (eligible to receive
        // keyboard focus); the lowest registered index becomes the
        // initial `tabindex="0"` row. Set mutations aren't reactive
        // by default, so we hold a shallowRef and triggerRef on
        // each in-place mutation (parallel to the table's
        // `interactiveRows` pattern).
        const eligibleIndices = shallowRef<Set<number>>(new Set());
        const registerEligibleItem = (index: number) => {
            if (eligibleIndices.value.has(index)) return;
            eligibleIndices.value.add(index);
            triggerRef(eligibleIndices);
        };
        const unregisterEligibleItem = (index: number) => {
            if (!eligibleIndices.value.has(index)) return;
            eligibleIndices.value.delete(index);
            triggerRef(eligibleIndices);
        };
        const firstTabStopIndex = computed<number | null>(() => {
            let min: number | null = null;
            for (const i of eligibleIndices.value) {
                if (min === null || i < min) min = i;
            }
            return min;
        });

        provideListContext({
            state: state as ListState<unknown, Record<string, unknown>>,
            classes,
            selection,
            registerEligibleItem,
            unregisterEligibleItem,
            firstTabStopIndex,
        });

        return () => h(
            props.tag,
            { class: theme.value.root || undefined },
            slots.default?.({ classes: theme.value }),
        );
    },
});
</script>
