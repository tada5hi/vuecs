<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    mergeProps,
    ref,
    toRef,
    watch,
} from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import {
    provideHeadCellCountContext,
    provideTableContext,
} from '../composables/context';
import { useRowSelectionMachine } from '../composables/selection';
import type {
    RowSelectionKey,
    RowSelectionMode,
    RowSelectionValue,
} from '../composables/selection';
import { useSortMachine } from '../composables/sort';
import type {
    SortDirection,
    TableColumn,
    TableColumnRaw,
    TableSlotProps,
    TableSortState,
    TableThemeClasses,
} from '../types';
import { composeTableInner } from '../utils/auto-render';
import { normalizeColumns } from '../utils/render-utils';

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
    /**
     * Row selection mode (plan 033 v1.x-A). When set, the table flips
     * to ARIA `role="grid"` (+ `aria-multiselectable` for multi) and
     * rows render with `aria-selected`. `undefined` keeps the v0.1
     * plain-table semantics.
     */
    selectionMode: { type: String as PropType<RowSelectionMode>, default: undefined },
    /**
     * Controlled selection state. Use `v-model:selection`. Type is
     * `string|number` for single mode, `(string|number)[]` for multi.
     * `null` clears the selection.
     */
    selection: {
        type: [String, Number, Array, null] as PropType<RowSelectionValue<RowSelectionMode> | null>,
        default: null,
    },
    /**
     * Resolve a row's selection key. Defaults to `row.id` (falling
     * back to the row index when absent). Pass a function for richer
     * mappings (e.g. `(row) => row.uuid`).
     */
    getRowKey: {
        type: Function as PropType<(row: unknown, index: number) => RowSelectionKey>,
        default: undefined,
    },
    /**
     * Stacked responsive mode (v0.2-D). When `true`, sets
     * `data-responsive="true"` on the `<table>` so the structural CSS
     * (and any theme-specific overrides) can collapse the table into
     * per-row cards at narrow viewports. Uses each cell's `data-label`
     * as the per-row column label.
     */
    responsive: { type: Boolean, default: false },
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
    emits: ['update:sort', 'update:selection', 'row-click'],
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

        // Interactive-row registry. Each `<VCTableRow>` registers
        // itself when `isInteractive` flips on, unregisters when off.
        // Drives the roving-tabindex fallback (first-interactive gets
        // the tab stop, not blindly row 0) and the arrow-nav skip
        // semantics (next/prev interactive, not next/prev data index).
        // Set is wrapped in a Ref + reassigned on mutation so Vue's
        // reactivity catches it (Set's internal mutations aren't
        // tracked by default).
        const interactiveRows = ref<Set<number>>(new Set());
        const registerInteractiveRow = (index: number) => {
            if (interactiveRows.value.has(index)) return;
            const next = new Set(interactiveRows.value);
            next.add(index);
            interactiveRows.value = next;
        };
        const unregisterInteractiveRow = (index: number) => {
            if (!interactiveRows.value.has(index)) return;
            const next = new Set(interactiveRows.value);
            next.delete(index);
            interactiveRows.value = next;
        };

        // Selection wiring (plan 033 v1.x-A). Always construct the
        // machine; when `selectionMode` is undefined it reports a
        // no-op (isSelected → false; toggle → no-op) so descendants
        // don't need to null-check before calling.
        const selectionMode = computed(() => props.selectionMode);
        const selectionValue = computed(() => props.selection);
        const getRowKey = (row: unknown, index: number): RowSelectionKey => {
            const custom = props.getRowKey;
            if (typeof custom === 'function') return custom(row, index);
            if (row && typeof row === 'object') {
                const { id } = (row as { id?: unknown });
                if (typeof id === 'string' || typeof id === 'number') return id;
            }
            return index;
        };
        const selection = useRowSelectionMachine({
            mode: selectionMode,
            value: selectionValue,
            emit: (next) => emit('update:selection', next),
            keyAt: (index) => {
                // Bound the lookup by `data.length` instead of by
                // `row === undefined` so that `data` arrays containing
                // legitimate `undefined` entries (the table accepts
                // `unknown[]`) don't prematurely terminate range scans.
                if (index < 0 || index >= dataRef.value.length) return undefined;
                return getRowKey(dataRef.value[index], index);
            },
        });

        provideTableContext({
            data: dataRef,
            busy: toRef(props, 'busy'),
            columns,
            sort: sortMachine.state,
            setSort: (key: string, direction?: SortDirection) => sortMachine.setSort(key, direction),
            rowClickable: toRef(props, 'rowClickable'),
            focusedRow,
            setFocusedRow,
            selection,
            getRowKey,
            interactiveRows,
            registerInteractiveRow,
            unregisterInteractiveRow,
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
            // Driver auto-render (plan 033 v0.2-B): when `:columns` is set
            // and the consumer's default slot doesn't already contain a
            // `<VCTableHeader>` / `<VCTableBody>`, render the missing
            // band(s) automatically. Consumer-provided slot content
            // (e.g. `<VCTableEmpty>`, `<VCTableLoading>`) flows as
            // siblings so the band-rendering precedence is unaffected.
            const inner = composeTableInner({
                cols: columns.value,
                slotChildren: slots.default?.(slotProps.value),
                captionSlot: slots.caption,
                colgroupSlot: slots.colgroup,
            });

            // `attrs` always forward to the `<table>` itself — consumers'
            // `:class` / `@click` / etc target the same element regardless
            // of whether `:scrollable` is set.
            const mode = selectionMode.value;
            // Build the merge props conditionally so a disabled
            // selection mode doesn't paint `role: undefined` /
            // `aria-multiselectable: undefined` over consumer-supplied
            // attribute fallthrough. `mergeProps` keeps explicit
            // `undefined` keys on the merged result, which would
            // shadow attrs.
            const selectionAttrs: Record<string, unknown> = mode === undefined ?
                {} :
                {
                    role: 'grid',
                    ...(mode === 'multi' ? { 'aria-multiselectable': 'true' } : {}),
                };
            const tableNode = h(
                props.tag,
                mergeProps(attrs, {
                    class: theme.value.root || undefined,
                    'aria-busy': props.busy ? 'true' : undefined,
                    'data-responsive': props.responsive ? 'true' : undefined,
                    ...selectionAttrs,
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
