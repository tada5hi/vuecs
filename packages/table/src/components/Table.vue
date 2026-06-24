<script lang="ts">
import {
    computed,
    defineComponent,
    getCurrentInstance,
    h,
    mergeProps,
    ref,
    shallowRef,
    toRef,
    triggerRef,
    watch,
} from 'vue';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    PublicProps,
    SlotsType,
} from 'vue';
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
    GenericComponentShape,
    SortDirection,
    TableCellSlotProps,
    TableColumn,
    TableColumnRaw,
    TableExpandableTrigger,
    TableExpansionSlotProps,
    TableHeadCellSlotProps,
    TableSlotProps,
    TableSortState,
    TableThemeClasses,
} from '../types';
import { composeTableInner } from '../utils/auto-render';
import { normalizeColumns } from '../utils/render-utils';
import { sortRows } from '../utils/sort-rows';

const tableThemeDefaults = {
    classes: {
        root: 'vc-table',
        scrollContainer: 'vc-table-scroll-container',
    },
};

// Local alias to avoid a multi-line type cast at the call site
// (operator-linebreak lint friction). The slot signature mirrors
// `TableExpansionSlotProps` but with `unknown` row type.
type ExpansionSlotFn = (slotProps: { row: unknown; index: number }) => unknown;

const tableProps = {
    /** Row data array. */
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    /** Column definitions (TableColumn or bare-string shorthand). When omitted, columns are derived from `Object.keys(data[0])`. */
    columns: { type: Array as PropType<TableColumnRaw<unknown>[]>, default: undefined },
    /** Busy flag — drives `aria-busy` on the `<table>` and gates the loading-band render. */
    busy: { type: Boolean, default: false },
    /**
     * Render a skeleton body while `:busy` is true (replaces the
     * real `<VCTableBody>` rows with `<VCTablePlaceholder>` rows
     * matching `:columns.length`). Header stays. Opt-in: when this
     * is `false` (default) the existing `:busy` semantic (aria-busy
     * + optional `<VCTableLoading>` band) is preserved unchanged.
     */
    placeholder: { type: Boolean, default: false },
    /**
     * Number of skeleton rows to render when `:busy && :placeholder`.
     * Defaults to the current `:data.length` (so the layout doesn't
     * jump on the first load → busy → data cycle), with a floor of
     * `5` when `:data` is empty.
     */
    placeholderRows: { type: Number, default: undefined },
    /**
     * Controlled sort state as `SortDescriptor[]`. Use `v-model:sort`.
     * Empty array means "no sort". Since v1.x-B this is always an
     * array (BREAKING change from v0.1's `{ key, direction } | null`).
     * Single-column sort is just an array of length 0 or 1.
     */
    sort: { type: Array as PropType<TableSortState>, default: () => [] },
    /** When `true`, the cycle skips the `null` step: `null → asc → desc → asc`. */
    mustSort: { type: Boolean, default: false },
    /**
     * Enable multi-column sort. When `true`, Shift-click on a
     * sortable header adds it as a secondary descriptor (or cycles
     * its direction if already present). Plain click without Shift
     * replaces multi-sort with single-sort of the clicked column.
     * Default `false` — Shift-click behaves identically to plain
     * click and the sort array stays length 0–1.
     */
    multiSort: { type: Boolean, default: false },
    /**
     * Maximum number of sort keys retained when `:multi-sort` is on.
     * Adding a key past the cap drops the oldest descriptor. `0`
     * means unlimited. Default `3` (matches Excel / bvnext / TanStack
     * convention).
     */
    maxSortKeys: { type: Number, default: 3 },
    /**
     * When `true`, the table reorders `:data` internally using
     * `accessor` (or `formatter` output if `column.sortByFormatted`),
     * honoring `column.sortFn` / `nullsFirst` if set. `v-model:sort`
     * still emits intent so consumers stay observable. Default
     * `false` — v0.1 controlled-sort behaviour preserved.
     */
    clientSort: { type: Boolean, default: false },
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
    /**
     * Enable per-row expansion panels (plan 038). Each rendered row
     * gets an auto-injected trigger cell (at the position given by
     * `:expandableTrigger`); the expansion panel content comes from
     * the table's `#expansion` scoped slot (driver mode) or each row's
     * own `#expansion` slot (manual / Shape B).
     */
    expandable: { type: Boolean, default: false },
    /**
     * Controlled set of expanded row keys. Use `v-model:expanded`.
     * Matches `getRowKey` resolution; defaults to `[]`. Pass a single
     * key array (`[rowKey]`) for one-row open, `[]` to collapse all.
     *
     * In `:expansion-mode="single"` the v-model carries a bare key
     * (or `null` for "no row open") — the prop type allows the
     * `null` shape so a `ref<RowSelectionKey | null>(null)` round-trip
     * doesn't trigger Vue prop-type warnings.
     */
    expanded: {
        type: [String, Number, Array, null] as PropType<RowSelectionKey | RowSelectionKey[] | null>,
        default: () => [],
    },
    /**
     * Expansion mode. `'multi'` (default) allows multiple rows open at
     * once. `'single'` makes the expansion behave like an accordion —
     * opening a new row collapses the previously-open one.
     */
    expansionMode: { type: String as PropType<'single' | 'multi'>, default: 'multi' },
    /**
     * Where to place the auto-injected trigger column.
     * - `'leading'` (default) — prepended before all data columns.
     * - `'trailing'` — appended after the last data column.
     * - `'none'` — no auto-injection; consumer places
     *   `<VCTableExpandTrigger>` inside a data cell.
     */
    expandableTrigger: {
        type: String as PropType<TableExpandableTrigger>,
        default: 'leading',
    },
    /** Density shorthand for `themeVariant.density`. */
    density: { type: String as PropType<'compact' | 'normal' | 'spacious'>, default: undefined },
    /** Alternating row backgrounds — shorthand for `themeVariant.striped`. */
    striped: { type: Boolean, default: undefined },
    /** Cell borders — shorthand for `themeVariant.bordered`. */
    bordered: { type: Boolean, default: undefined },
    /** Row hover highlight — shorthand for `themeVariant.hover`. */
    hover: { type: Boolean, default: undefined },
    /**
     * Element or component to render as. Defaults to `'table'`. Pass a
     * string tag or a component.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'table' },
    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    ...themableProps<TableThemeClasses>(),
};

export type TableProps = ExtractPublicPropTypes<typeof tableProps>;

// ──────────────────────────────────────────────────────────────────────────
// Generic-over-`Row` facade (issue #1601)
//
// `<VCTable>` is published as a generic component so consumer slot
// templates infer their row type from `:data` / `:columns`:
//
//   <VCTable :data="users">
//     <template #cell-name="{ row }">{{ row.email }}</template>  <!-- row: User -->
//   </VCTable>
//
// The runtime stays a plain `defineComponent` (vuecs convention — render
// functions, no `<script setup>`); the default export is cast to a
// generic call/return signature `vue-tsc` recognizes. See
// `GenericComponentShape` in `../types` for the mechanism.
// ──────────────────────────────────────────────────────────────────────────

/**
 * Per-`Row` slot map for the generic facade. Mirrors the runtime
 * `SlotsType` below, but threads the inferred `Row` into every
 * row-bearing slot.
 */
interface TableSlots<Row> {
    default?: (props: TableSlotProps<Row>) => unknown;
    caption?: () => unknown;
    colgroup?: () => unknown;
    [cellSlot: `cell-${string}`]: (props: TableCellSlotProps<Row>) => unknown;
    [headerSlot: `header-${string}`]: (props: TableHeadCellSlotProps<Row>) => unknown;
    expansion?: (props: TableExpansionSlotProps<Row>) => unknown;
}

/**
 * Public props with the `Row`-typed arms (`data` / `columns` /
 * `getRowKey`) and the emit handlers spliced back in — functional
 * components surface events through `on*` props, not a runtime `emits`
 * option, so they must be declared here for `v-model:*` / `@row-click`
 * to type-check at the call site.
 */
type TablePropsGeneric<Row> =    & Omit<TableProps, 'data' | 'columns' | 'getRowKey'> &
    {
        data?: Row[];
        columns?: TableColumnRaw<Row>[];
        getRowKey?: (row: Row, index: number) => RowSelectionKey;
        'onUpdate:sort'?: (value: TableSortState) => void;
        'onUpdate:selection'?: (value: RowSelectionValue<RowSelectionMode> | null) => void;
        'onUpdate:expanded'?: (value: RowSelectionKey | RowSelectionKey[] | null) => void;
        // Vue camelCases a kebab event name into its handler-prop key, so
        // template `@row-click` resolves to `onRowClick` (NOT `onRow-click`).
        // The `update:*` keys above are the exception — Vue does NOT
        // camelCase the segment after the colon, so they stay hyphenated.
        onRowClick?: (row: Row, index: number, event: Event) => void;
    } &
    PublicProps;

/**
 * Generic `<VCTable>` type. `Row` is unconstrained (matching every
 * `<Row = unknown>` generic in `../types`) so interface-typed rows infer
 * cleanly — a `Record<string, …>` constraint would reject `interface
 * User {}` ("index signature is missing"). Defaults to
 * `Record<string, unknown>` for untyped call sites.
 */
type VCTableComponent = <Row = Record<string, unknown>>(
    ...args: Parameters<GenericComponentShape<TablePropsGeneric<Row>, TableSlots<Row>>>
) => ReturnType<GenericComponentShape<TablePropsGeneric<Row>, TableSlots<Row>>>;

const VCTable = defineComponent({
    name: 'VCTable',
    inheritAttrs: false,
    props: tableProps,
    emits: ['update:sort', 'update:selection', 'update:expanded', 'row-click'],
    slots: Object as SlotsType<{
        default(props: TableSlotProps): unknown;
        caption(): unknown;
        colgroup(): unknown;
        /**
         * Per-column cell override. Dispatched by the columns-driver
         * auto-render path; the key suffix matches `TableColumn['key']`.
         * Wins over `<VCTableCell>`'s `accessor` + `formatter` auto-
         * render. (Closes #1592.)
         */
        [cellSlot: `cell-${string}`]: (props: TableCellSlotProps) => unknown;
        /**
         * Per-column header override. Dispatched by the columns-driver
         * auto-render path; key suffix matches `TableColumn['key']`.
         * Wins over the default `col.label` text. (Closes #1592.)
         */
        [headerSlot: `header-${string}`]: (props: TableHeadCellSlotProps) => unknown;
        /**
         * Per-row expansion panel content (plan 038). Bridged through
         * the auto-render path to each row's own `#expansion` slot;
         * receives the row data + index.
         */
        expansion(props: TableExpansionSlotProps): unknown;
    }>,
    setup(props, {
        attrs,
        slots,
        emit,
    }) {
        // Detect whether the consumer bound `v-model:expanded` (or
        // wired `@update:expanded` directly). Used to distinguish
        // "consumer wants empty initial state" (bound v-model with
        // `ref([])`) from "consumer didn't opt into expansion v-model
        // at all" (prop falls through to default). Without this
        // signal, an explicit `:expanded="[]"` to collapse all rows
        // would silently fall back to stale internal state.
        //
        // Vue's `emits` declaration removes the listener from `attrs`,
        // so we read from `vnode.props` instead — the parent's raw
        // VNode props preserve the listener regardless of how the
        // child declares its event API.
        const vmInstance = getCurrentInstance();
        const hasExpandedVModel = !!(
            vmInstance?.vnode.props && 'onUpdate:expanded' in vmInstance.vnode.props
        );
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
        const maxSortKeysRef = toRef(props, 'maxSortKeys');
        const sortMachine = useSortMachine({
            source: sortSource,
            columns,
            mustSort: mustSortRef,
            maxSortKeys: maxSortKeysRef,
            emit: (next) => emit('update:sort', next),
        });

        // Client-side sort (plan 033 v1.x-B). When `:client-sort` is
        // set, the table reorders `:data` itself using the resolved
        // sort descriptors. Always emits `update:sort` so consumers
        // still observe the state changes.
        const visibleData = computed<unknown[]>(() => {
            if (!props.clientSort || sortMachine.state.value.length === 0) {
                return dataRef.value;
            }
            return sortRows(dataRef.value, {
                columns: columns.value,
                sorts: sortMachine.state.value,
            });
        });

        // D3 — Shape B colspan auto-counting from <VCTableHeadCell> siblings
        // that register via context. Shape A overrides via `columns.length`.
        const childCellCount = ref(0);
        provideHeadCellCountContext({
            register: () => { childCellCount.value += 1; },
            unregister: () => { childCellCount.value = Math.max(0, childCellCount.value - 1); },
        });
        const colspan = computed(() => {
            const base = columns.value.length > 0 ?
                columns.value.length :
                Math.max(1, childCellCount.value);
            // Auto-injected expansion trigger adds +1 to the spanning
            // colspan so `<VCTableEmpty>` / `<VCTableLoading>` /
            // expansion panels span the FULL rendered width (including
            // the trigger column). When `:expandableTrigger="none"`
            // the consumer keeps the trigger inside a data cell, so
            // no bump is needed.
            const triggerBump = props.expandable && props.expandableTrigger !== 'none' ? 1 : 0;
            return base + triggerBump;
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
        // Set mutations aren't reactivity-tracked, so we hold the
        // Set in a shallow ref and call `triggerRef` after each
        // in-place `add`/`delete`. Previously the code allocated a
        // FRESH Set on every register/unregister — during mount of a
        // table with N interactive rows that was O(N²) allocations
        // (each new row copies the prior Set).
        const interactiveRows = shallowRef<Set<number>>(new Set());
        const registerInteractiveRow = (index: number) => {
            if (interactiveRows.value.has(index)) return;
            interactiveRows.value.add(index);
            triggerRef(interactiveRows);
        };
        const unregisterInteractiveRow = (index: number) => {
            if (!interactiveRows.value.has(index)) return;
            interactiveRows.value.delete(index);
            triggerRef(interactiveRows);
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
                // Look up against the VISIBLE data view, not the raw
                // source — when `:client-sort` reorders rows, the
                // index seen in selection events matches the rendered
                // position, so range-select spans the rendered order.
                const view = visibleData.value;
                if (index < 0 || index >= view.length) return undefined;
                return getRowKey(view[index], index);
            },
        });

        // ──────────────────────────────────────────────────────────────────
        // Expansion machine (plan 038) — reuses the shared
        // `useSelectionMachine` from `@vuecs/core`. The "selection"
        // semantic generalizes to "set of currently open row keys": a
        // single-mode machine acts as an accordion, multi-mode allows
        // any number of rows open at once.
        // ──────────────────────────────────────────────────────────────────

        // Local mirror of the expansion state used when the consumer
        // didn't bind `v-model:expanded`. Stored in the canonical
        // shape per mode (bare key | null for single, array for multi)
        // so reads from `expansionValue` don't need re-normalization.
        const initialExpansionInternal = (): RowSelectionKey | RowSelectionKey[] | null => {
            const init = props.expanded;
            if (props.expansionMode === 'single') {
                if (typeof init === 'string' || typeof init === 'number') return init;
                if (Array.isArray(init) && init.length > 0) return init[0];
                return null;
            }
            if (Array.isArray(init)) return init;
            if (typeof init === 'string' || typeof init === 'number') return [init];
            return [];
        };
        const expansionInternal = ref<RowSelectionKey | RowSelectionKey[] | null>(
            initialExpansionInternal(),
        );

        // Normalize an incoming value to the machine's expected shape
        // per mode (single: bare key | null; multi: array). The machine
        // compares `value.value === key` in single mode, so feeding it
        // a wrapped array would never match (bug fix vs. original
        // expansionValue that wrapped bare keys for both modes).
        const normalizeForMachine = (
            source: RowSelectionKey | RowSelectionKey[] | null | undefined,
            mode: RowSelectionMode,
        ): RowSelectionValue<RowSelectionMode> | null => {
            if (mode === 'single') {
                if (typeof source === 'string' || typeof source === 'number') return source;
                if (Array.isArray(source)) return source.length > 0 ? source[0] : null;
                return null;
            }
            if (Array.isArray(source)) return source;
            if (typeof source === 'string' || typeof source === 'number') return [source];
            return [];
        };

        // Effective expansion state for the machine to read. When
        // v-model is bound, the consumer's prop is authoritative
        // (including empty `[]` for "collapse all"). When unbound,
        // the local internal mirror takes over.
        const expansionValue = computed<RowSelectionValue<RowSelectionMode> | null>(() => {
            if (!props.expandable) return null;
            const source = hasExpandedVModel ? props.expanded : expansionInternal.value;
            return normalizeForMachine(source as never, props.expansionMode);
        });

        // Seed expansion from `row._expanded` row-meta flags the FIRST
        // time data becomes non-empty. The original `onMounted` seed
        // missed the canonical async pattern (`data: []` → fetch →
        // `data: [...]`) because mount fired against the empty array.
        // A watcher with `immediate: true` handles both sync and
        // async data — `seedAttempted` ensures one-shot semantics.
        let seedAttempted = false;
        const trySeed = () => {
            if (seedAttempted || !props.expandable) return;
            const view = visibleData.value;
            if (view.length === 0) return;
            const seeds: RowSelectionKey[] = [];
            for (const [i, row] of view.entries()) {
                if (
                    row && typeof row === 'object' &&
                    (row as Record<string, unknown>)._expanded === true
                ) {
                    seeds.push(getRowKey(row, i));
                }
            }
            seedAttempted = true;
            if (seeds.length === 0) return;
            // Skip the seed when the consumer already established an
            // initial expanded state — explicit beats implicit.
            const currentValue = hasExpandedVModel ? props.expanded : expansionInternal.value;
            const currentIsEmpty = currentValue == null ||
                (Array.isArray(currentValue) && currentValue.length === 0);
            if (!currentIsEmpty) return;
            let finalSeed = seeds;
            if (props.expansionMode === 'single' && seeds.length > 1) {
                if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.warn(
                        '[VCTable] :expansion-mode="single" but multiple rows carry _expanded: true — using the first.',
                    );
                }
                finalSeed = [seeds[0]];
            }
            const writeBack = props.expansionMode === 'single' ? finalSeed[0] : finalSeed;
            if (hasExpandedVModel) {
                emit('update:expanded', writeBack);
            } else {
                expansionInternal.value = writeBack;
                // Echo to consumer listeners that exist outside v-model
                // (handlers attached directly via `@update:expanded`
                // are caught by `hasExpandedVModel`; only `null` here
                // means truly no listener — safe no-op anyway).
            }
        };
        watch(visibleData, () => { trySeed(); }, { immediate: true });

        const expansionMode = computed<RowSelectionMode | undefined>(() => {
            if (!props.expandable) return undefined;
            return props.expansionMode;
        });

        const expansion = useRowSelectionMachine({
            mode: expansionMode,
            value: expansionValue,
            emit: (next) => {
                // Guard against late emits after `:expandable` flipped
                // off (the machine should be no-op in that case, but
                // belt-and-braces against any setValue() call path).
                if (!props.expandable) return;
                // Mirror to local state in the canonical per-mode
                // shape so subsequent reads of `expansionValue` (when
                // no v-model is bound) see the updated set.
                if (!hasExpandedVModel) {
                    if (next === null) {
                        expansionInternal.value = props.expansionMode === 'single' ? null : [];
                    } else {
                        expansionInternal.value = next;
                    }
                }
                emit('update:expanded', next);
            },
            keyAt: (index) => {
                const view = visibleData.value;
                if (index < 0 || index >= view.length) return undefined;
                return getRowKey(view[index], index);
            },
        });

        provideTableContext({
            // When `:client-sort` is on, descendants see the sorted view
            // — `<VCTableBody>` iterates `ctx.data`, so threading the
            // sorted view here is what reorders rendered rows. When
            // off, this is the unsorted source array (v0.1 behaviour).
            data: visibleData,
            busy: toRef(props, 'busy'),
            columns,
            sort: sortMachine.state,
            setSort: (
                key: string,
                opts?: { append?: boolean; direction?: SortDirection },
            ) => sortMachine.setSort(key, {
                ...opts,
                // Shift-click only appends when `<VCTable :multi-sort>`
                // is on — otherwise the prop would be advisory only
                // and headers would always grow the array.
                append: props.multiSort ? opts?.append : false,
            }),
            setSortState: sortMachine.setState,
            maxSortKeys: maxSortKeysRef,
            supportsSortMutation: true,
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
            expandable: toRef(props, 'expandable'),
            expandableTrigger: toRef(props, 'expandableTrigger'),
            expansion,
        });

        const slotProps = computed<TableSlotProps>(() => ({
            data: visibleData.value,
            busy: props.busy,
            columns: columns.value,
            sort: sortMachine.state.value,
            setSort: sortMachine.setSort,
        }));

        const setWrapperRef = (el: unknown) => {
            wrapperEl.value = (el as globalThis.HTMLElement | null) ?? null;
        };

        return () => {
            // Skeleton-mode integration (issue #1476 follow-on):
            // when `:busy && :placeholder` and we have columns, swap
            // the body band for a skeleton sized to the current data
            // (or 5 if empty — first-load case). Header continues
            // auto-rendering from columns so the layout matches.
            const inPlaceholderMode = props.busy && props.placeholder && columns.value.length > 0;
            const skeletonRowCount = inPlaceholderMode ?
                (props.placeholderRows ?? (props.data.length || 5)) :
                undefined;

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
                slots,
                sort: sortMachine.state.value,
                setSort: sortMachine.setSort,
                placeholderRows: skeletonRowCount,
                expandable: props.expandable,
                expandableTrigger: props.expandableTrigger,
                expansionSlot: slots.expansion as ExpansionSlotFn | undefined,
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
                props.tag ?? props.as,
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

// Runtime is the `defineComponent` above; the cast only re-types the
// public surface as generic-over-`Row`. Identical at runtime.
export default VCTable as unknown as VCTableComponent;
</script>
