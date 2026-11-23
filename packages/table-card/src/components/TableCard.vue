<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    PublicProps,
    Slot,
    SlotsType,
    VNode,
    VNodeChild,
} from 'vue';
import {
    isMeaningfulSlotContent,
    themableProps,
    useComponentDefaults,
    useComponentTheme,
} from '@vuecs/core';
import type { GenericComponentShape } from '@vuecs/core';
import {
    VCCard,
    VCCardBody,
    VCCardDescription,
    VCCardFooter,
    VCCardHeader,
    VCCardTitle,
    VCEmptyState,
} from '@vuecs/elements';
import { VCFormInput } from '@vuecs/forms';
import { VCPagination } from '@vuecs/pagination';
import type { PaginationMeta } from '@vuecs/pagination';
import { VCTable } from '@vuecs/table';
import type {
    RowSelectionKey,
    TableColumnRaw,
    TablePropsGeneric,
    TableSlots,
    TableSortState,
} from '@vuecs/table';
import type {
    TableCardDefaults,
    TableCardNoResultsSlotProps,
    TableCardThemeClasses,
} from '../types';
import { tableCardThemeDefaults } from './theme';

const tableCardProps = {
    /** Card heading. */
    title: { type: String, default: undefined },
    /** Secondary text under the heading. */
    description: { type: String, default: undefined },
    /** Row data, forwarded to `<VCTable>`. */
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    /** Column definitions, forwarded to `<VCTable>`. */
    columns: { type: Array as PropType<TableColumnRaw<unknown>[]>, default: undefined },
    /** Sort state, forwarded to `<VCTable>`. Use `v-model:sort`. */
    sort: { type: Array as PropType<TableSortState>, default: undefined },
    /** Render the search input in the header. */
    searchable: { type: Boolean, default: false },
    /** Search text. Use `v-model:search`. */
    search: { type: String, default: undefined },
    /** Debounce window (ms) for `update:search`. `0` emits on every keystroke. */
    searchDebounce: { type: Number, default: 300 },
    /** Search input placeholder. Falls back to the `searchPlaceholder` default. */
    searchPlaceholder: { type: String, default: undefined },
    /** Loading flag — bind a data source's `loading`. Wins over the empty state. */
    busy: { type: Boolean, default: false },
    /** A search / filter is active — an empty result renders the `noResults` state. */
    filtered: { type: Boolean, default: false },
    /** Total number of records (server-side). Pagination hides when `total <= limit`. */
    total: { type: Number, default: 0 },
    /** Page size. `0` hides the pagination. */
    limit: { type: Number, default: 0 },
    /** Offset of the current page. */
    offset: { type: Number, default: 0 },
    ...themableProps<TableCardThemeClasses>(),
};

export type TableCardProps = ExtractPublicPropTypes<typeof tableCardProps>;

/**
 * Per-`Row` slot map for the generic facade. Every `<VCTable>` slot
 * (`cell-<key>`, `header-<key>`, `default`, …) is forwarded to the table.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public type name and declaration merging.
export interface TableCardSlots<Row> extends TableSlots<Row> {
    /** Header actions (buttons, filters) next to the search input. */
    actions?: () => unknown;
    /** Side panel next to the table; wraps below it on narrow widths. */
    aside?: () => unknown;
    /** Replaces the built-in `empty` state. */
    empty?: () => unknown;
    /** Replaces the built-in `noResults` state. */
    noResults?: (props: TableCardNoResultsSlotProps) => unknown;
}

/**
 * Public props with the `Row`-typed arms and the emit handlers spliced
 * back in (a cast-to-function component surfaces events through props).
 */
export type TableCardPropsGeneric<Row> = & Omit<TableCardProps, 'data' | 'columns'> &
    {
        data?: Row[];
        columns?: TableColumnRaw<Row>[];
        'onUpdate:search'?: (value: string) => void;
        'onUpdate:sort'?: (value: TableSortState) => void;
        onPage?: (meta: PaginationMeta) => void;
        onReset?: () => void;
        // Forwarded to `<VCTable>` as fallthrough attrs (see `inheritAttrs`
        // below); spliced in so they type-check Row-typed. Vue camelCases
        // `@row-click` into `onRowClick`.
        onRowClick?: (row: Row, index: number, event: Event) => void;
        getRowKey?: (row: Row, index: number) => RowSelectionKey;
    } &
    // The table's remaining handler props, derived so they can't drift.
    Pick<TablePropsGeneric<Row>, 'onUpdate:selection' | 'onUpdate:expanded'> &
    PublicProps;

/** Generic `<VCTableCard>` type — `Row` is inferred from `:data` / `:columns`. */
export type VCTableCardComponent = <Row = Record<string, unknown>>(
    ...args: Parameters<GenericComponentShape<TableCardPropsGeneric<Row>, TableCardSlots<Row>>>
) => ReturnType<GenericComponentShape<TableCardPropsGeneric<Row>, TableCardSlots<Row>>>;

const tableCardBehavioralDefaults: TableCardDefaults = {
    searchPlaceholder: 'Search…',
    emptyTitle: 'No entries yet',
};

/** Slots the card renders itself; every other slot is forwarded to `<VCTable>`. */
const OWN_SLOTS = new Set(['actions', 'aside', 'empty', 'noResults']);

/**
 * `<VCTableCard>` — the card frame around a collection table: header
 * (title, description, search, `#actions`), body (`<VCTable>` or an empty
 * state, plus an optional `#aside`) and footer (`<VCPagination>`). A thin
 * composition — table, pagination, search input and empty state keep
 * their own behavior; the card only decides which of them render.
 *
 * `class` / `style` land on the card root; every other attribute
 * (including listeners such as `@row-click`) is forwarded to `<VCTable>`,
 * so table options like `get-row-key`, `expandable` or `striped` need no
 * card prop.
 */
const VCTableCard = defineComponent({
    name: 'VCTableCard',
    inheritAttrs: false,
    props: tableCardProps,
    emits: ['update:search', 'update:sort', 'page', 'reset'],
    slots: Object as SlotsType<{
        actions(): unknown;
        aside(): unknown;
        empty(): unknown;
        noResults(props: TableCardNoResultsSlotProps): unknown;
        [tableSlot: string]: (props: never) => unknown;
    }>,
    setup(props, {
        attrs,
        slots,
        emit,
    }) {
        const theme = useComponentTheme('tableCard', props, tableCardThemeDefaults);
        const defaults = useComponentDefaults('tableCard', props, tableCardBehavioralDefaults);

        const reset = () => emit('reset');

        const renderHeader = (classes: TableCardThemeClasses): VNodeChild => {
            const heading: VNodeChild[] = [];

            if (props.title) {
                heading.push(h(VCCardTitle, { class: classes.title || undefined }, () => props.title));
            }

            if (props.description) {
                heading.push(h(VCCardDescription, { class: classes.description || undefined }, () => props.description));
            }

            const toolbar: VNodeChild[] = [];

            if (props.searchable) {
                const placeholder = defaults.value.searchPlaceholder;

                toolbar.push(h(VCFormInput, {
                    type: 'search',
                    modelValue: props.search,
                    debounce: props.searchDebounce,
                    placeholder,
                    'aria-label': placeholder,
                    class: classes.search || undefined,
                    'onUpdate:modelValue': (value: string) => emit('update:search', value),
                }));
            }

            const actions = slots.actions?.();

            if (isMeaningfulSlotContent(actions)) {
                toolbar.push(h('div', { class: classes.actions || undefined }, actions as VNode[]));
            }

            if (heading.length === 0 && toolbar.length === 0) {
                return null;
            }

            return h(VCCardHeader, { class: classes.header || undefined }, () => [
                heading.length > 0 ? h('div', { class: classes.heading || undefined }, heading) : null,
                toolbar.length > 0 ? h('div', { class: classes.toolbar || undefined }, toolbar) : null,
            ]);
        };

        const renderMain = (): VNodeChild => {
            // `busy` wins: an empty `data` during the first load (or a
            // reload) shows skeleton rows, never the empty state.
            if (!props.busy && props.data.length === 0) {
                if (props.filtered) {
                    return slots.noResults ?
                        slots.noResults({ reset }) as VNodeChild :
                        h(VCEmptyState, { variant: 'noResults', onAction: reset });
                }

                return slots.empty ?
                    slots.empty() as VNodeChild :
                    h(VCEmptyState, { variant: 'empty', title: defaults.value.emptyTitle });
            }

            const tableSlots: Record<string, Slot> = {};

            Object.keys(slots).forEach((name) => {
                if (!OWN_SLOTS.has(name)) {
                    tableSlots[name] = slots[name] as Slot;
                }
            });

            // `class` / `style` belong to the card root.
            const tableAttrs = Object.fromEntries(Object.entries(attrs)
                .filter(([key]) => key !== 'class' && key !== 'style'));

            return h(VCTable as Component, mergeProps(tableAttrs, {
                data: props.data,
                columns: props.columns,
                sort: props.sort,
                busy: props.busy,
                placeholder: true,
                'onUpdate:sort': (value: TableSortState) => emit('update:sort', value),
            }), tableSlots);
        };

        return () => {
            const classes = theme.value;

            const body: VNodeChild[] = [h('div', { class: classes.main || undefined }, [renderMain()])];

            const aside = slots.aside?.();

            if (isMeaningfulSlotContent(aside)) {
                body.push(h('div', { class: classes.aside || undefined }, aside as VNode[]));
            }

            const paginated = props.limit > 0 && props.total > props.limit;

            return h(VCCard, {
                class: [classes.root || undefined, attrs.class],
                style: attrs.style,
            }, () => [
                renderHeader(classes),
                h(VCCardBody, { class: classes.body || undefined }, () => body),
                paginated ?
                    h(VCCardFooter, { class: classes.footer || undefined }, () => h(VCPagination, {
                        total: props.total,
                        limit: props.limit,
                        offset: props.offset,
                        busy: props.busy,
                        onLoad: (meta: PaginationMeta) => emit('page', meta),
                    })) :
                    null,
            ]);
        };
    },
});

export default VCTableCard as unknown as VCTableCardComponent;
</script>
