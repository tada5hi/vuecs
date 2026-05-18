<script lang="ts">
import {
    Fragment,
    computed,
    defineComponent,
    h,
    mergeProps,
    ref,
    toRef,
    watch,
} from 'vue';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNode,
} from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import {
    provideHeadCellCountContext,
    provideTableContext,
} from '../composables/context';
import { useSortMachine } from '../composables/sort';
import type {
    SortDirection,
    TableColumn,
    TableColumnRaw,
    TableSlotProps,
    TableSortState,
    TableThemeClasses,
} from '../types';
import { normalizeColumns } from '../utils/render-utils';
import VCTableHeader from './TableHeader.vue';
import VCTableBody from './TableBody.vue';
import VCTableRow from './TableRow.vue';
import VCTableHeadCell from './TableHeadCell.vue';
import VCTableCell from './TableCell.vue';

/**
 * Recursively check whether `nodes` (a slot return) contains a vnode
 * whose `type` equals `target`. Recurses into Vue `Fragment` vnodes so
 * `<template v-if>` / `<template v-for>` wrapping around a part
 * doesn't hide it from the auto-render check.
 *
 * Used by `<VCTable>` to detect whether the consumer wrote a manual
 * `<VCTableHeader>` / `<VCTableBody>` in the default slot — if not,
 * and `:columns` is set, the table renders the missing band itself.
 */
function containsComponent(nodes: unknown, target: unknown): boolean {
    if (nodes == null || nodes === false) return false;
    if (Array.isArray(nodes)) {
        for (const child of nodes) {
            if (containsComponent(child, target)) return true;
        }
        return false;
    }
    if (typeof nodes !== 'object') return false;
    const v = nodes as VNode;
    if (v.type === target) return true;
    if (v.type === Fragment) return containsComponent(v.children, target);
    return false;
}

const tableThemeDefaults = {
    classes: {
        root: 'vc-table',
        scrollContainer: 'vc-table-scroll-container',
    },
};

const tableProps = {
    /** Row data array. */
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    /** Column definitions (TableColumn or bare-string shorthand). When omitted, columns are derived from `Object.keys(data[0])`. */
    columns: { type: Array as PropType<TableColumnRaw<unknown>[]>, default: undefined },
    /** Busy flag — drives `aria-busy` on the `<table>` and gates the loading-band render. */
    busy: { type: Boolean, default: false },
    /** Controlled sort state (single column). Use `v-model:sort`. */
    sort: { type: [Object, null] as PropType<TableSortState>, default: null },
    /** When `true`, the cycle skips the `null` step: `null → asc → desc → asc`. */
    mustSort: { type: Boolean, default: false },
    /** Wrap the `<table>` in an overflow scroll container. */
    scrollable: { type: Boolean, default: false },
    /** When `:scrollable`, sticks the `<thead>` to the top of the scroll container. */
    stickyHeader: { type: Boolean, default: false },
    /** When `:scrollable`, applied as `max-height` on the scroll container (any CSS length, e.g. `'24rem'`). */
    maxHeight: { type: String, default: undefined },
    /** Opt-in row-click affordance — adds `tabindex` + cursor-pointer on every row and emits `@row-click`. */
    rowClickable: { type: Boolean, default: false },
    /** Density shorthand for `themeVariant.density`. */
    density: { type: String as PropType<'compact' | 'normal' | 'spacious'>, default: undefined },
    /** Alternating row backgrounds — shorthand for `themeVariant.striped`. */
    striped: { type: Boolean, default: undefined },
    /** Cell borders — shorthand for `themeVariant.bordered`. */
    bordered: { type: Boolean, default: undefined },
    /** Row hover highlight — shorthand for `themeVariant.hover`. */
    hover: { type: Boolean, default: undefined },
    /** HTML tag to render. */
    tag: { type: String, default: 'table' },
    ...themableProps<TableThemeClasses>(),
};

export type TableProps = ExtractPublicPropTypes<typeof tableProps>;

export default defineComponent({
    name: 'VCTable',
    inheritAttrs: false,
    props: tableProps,
    emits: ['update:sort', 'row-click'],
    slots: Object as SlotsType<{
        default(props: TableSlotProps): unknown;
        caption(): unknown;
        colgroup(): unknown;
    }>,
    setup(props, {
        attrs, 
        slots, 
        emit, 
    }) {
        const themeProps = useThemeProps(
            props,
            'density',
            'striped',
            'bordered',
            'hover',
            'stickyHeader',
        );
        const theme = useComponentTheme('table', themeProps, tableThemeDefaults);

        const dataRef = toRef(props, 'data');
        const rawColumns = toRef(props, 'columns');
        const columns = computed<TableColumn<unknown>[]>(
            () => normalizeColumns(rawColumns.value, dataRef.value),
        );

        const sortSource = toRef(props, 'sort');
        const mustSortRef = toRef(props, 'mustSort');
        const sortMachine = useSortMachine({
            source: sortSource,
            columns,
            mustSort: mustSortRef,
            emit: (next) => emit('update:sort', next),
        });

        // D3 — Shape B colspan auto-counting from <VCTableHeadCell> siblings
        // that register via context. Shape A overrides via `columns.length`.
        const childCellCount = ref(0);
        provideHeadCellCountContext({
            register: () => { childCellCount.value += 1; },
            unregister: () => { childCellCount.value = Math.max(0, childCellCount.value - 1); },
        });
        const colspan = computed(() => {
            if (columns.value.length > 0) return columns.value.length;
            return Math.max(1, childCellCount.value);
        });
        watch(
            () => columns.value.length > 0,
            (hasColumns) => {
                if (hasColumns) childCellCount.value = 0;
            },
        );

        const focusedRow = ref<number | null>(null);
        const setFocusedRow = (index: number | null) => { focusedRow.value = index; };

        const emitRowClick = (row: unknown, index: number, event: Event) => {
            emit('row-click', row, index, event);
        };

        const wrapperEl = ref<globalThis.HTMLElement | null>(null);

        provideTableContext({
            data: dataRef,
            busy: toRef(props, 'busy'),
            columns,
            sort: sortMachine.state,
            setSort: (key: string, direction?: SortDirection) => sortMachine.setSort(key, direction),
            rowClickable: toRef(props, 'rowClickable'),
            focusedRow,
            setFocusedRow,
            colspan,
            emitRowClick,
            wrapperEl,
        });

        const slotProps = computed<TableSlotProps>(() => ({
            data: dataRef.value as unknown[],
            busy: props.busy,
            columns: columns.value,
            sort: sortMachine.state.value,
            setSort: sortMachine.setSort,
        }));

        const setWrapperRef = (el: unknown) => {
            wrapperEl.value = (el as globalThis.HTMLElement | null) ?? null;
        };

        return () => {
            const inner: unknown[] = [];
            if (slots.caption) inner.push(h('caption', null, slots.caption() as never));
            if (slots.colgroup) inner.push(h('colgroup', null, slots.colgroup() as never));

            // Driver auto-render (plan 033 v0.2-B): when `:columns` is set
            // and the consumer's default slot doesn't already contain a
            // `<VCTableHeader>` / `<VCTableBody>`, render the missing
            // band(s) automatically. Consumer-provided slot content
            // (e.g. `<VCTableEmpty>`, `<VCTableLoading>`) flows as
            // siblings so the band-rendering precedence is unaffected.
            const slotChildren = slots.default?.(slotProps.value);
            const cols = columns.value;
            const autoRender = cols.length > 0;
            const hasHeader = autoRender && containsComponent(slotChildren, VCTableHeader);
            const hasBody = autoRender && containsComponent(slotChildren, VCTableBody);

            if (autoRender && !hasHeader) {
                inner.push(h(VCTableHeader, null, () => h(VCTableRow, null, () => cols.map((col) => h(
                    VCTableHeadCell,
                    {
                        key: col.key,
                        columnKey: col.key,
                        sortable: col.sortable,
                        isRowHeader: false,
                    },
                    () => col.label,
                )))));
            }

            if (slotChildren !== undefined) inner.push(slotChildren);

            if (autoRender && !hasBody) {
                inner.push(h(VCTableBody, null, {
                    row: ({ row, index }: { row: unknown; index: number }) => h(
                        VCTableRow,
                        { row, index },
                        () => cols.map((col) => h(VCTableCell, {
                            key: col.key,
                            columnKey: col.key,
                            isRowHeader: col.isRowHeader,
                            dataLabel: col.label,
                        })),
                    ),
                }));
            }

            // `attrs` always forward to the `<table>` itself — consumers'
            // `:class` / `@click` / etc target the same element regardless
            // of whether `:scrollable` is set.
            const tableNode = h(
                props.tag,
                mergeProps(attrs, {
                    class: theme.value.root || undefined,
                    'aria-busy': props.busy ? 'true' : undefined,
                }),
                inner as never,
            );

            // Always wrap the `<table>` in a positioned wrapper. This is
            // the teleport target for `<VCTableLoading :overlay>` — a
            // `<div>` inside a `<table>` is foster-parented out by the
            // HTML parser, breaking the overlay; rendering it as a
            // sibling of the `<table>` (inside this wrapper) keeps the
            // overlay correctly sized against the table area.
            const wrapper = h(
                'div',
                {
                    ref: setWrapperRef,
                    class: 'vc-table-wrapper',
                    style: { position: 'relative' },
                },
                [tableNode],
            );

            if (!props.scrollable) return wrapper;

            return h(
                'div',
                {
                    class: theme.value.scrollContainer || undefined,
                    style: props.maxHeight ?
                        { maxHeight: props.maxHeight, overflow: 'auto' } :
                        { overflow: 'auto' },
                },
                [wrapper],
            );
        };
    },
});
</script>
