import { Fragment, h } from 'vue';
import type { VNode } from 'vue';
import { VCPlaceholder } from '@vuecs/placeholder';
import VCTableBody from '../components/TableBody.vue';
import VCTableCell from '../components/TableCell.vue';
import VCTableFooter from '../components/TableFooter.vue';
import VCTableHeadCell from '../components/TableHeadCell.vue';
import VCTableHeader from '../components/TableHeader.vue';
import VCTableRow from '../components/TableRow.vue';
import type {
    SortDirection,
    TableCellSlotProps,
    TableColumn,
    TableExpandableTrigger,
    TableHeadCellSlotProps,
    TableSortState,
} from '../types';
import { resolveCellValue } from './render-utils';

/**
 * Recursively check whether `nodes` (a slot return) contains a vnode
 * whose `type` equals `target`. Recurses into Vue `Fragment` vnodes so
 * `<template v-if>` / `<template v-for>` wrapping around a part
 * doesn't hide it from the auto-render check.
 *
 * Used by `<VCTable>` and `<VCTableLite>` to detect whether the
 * consumer wrote a manual `<VCTableHeader>` / `<VCTableBody>` in the
 * default slot — if not, and `:columns` is set, the table renders the
 * missing band itself.
 */
export function containsComponent(nodes: unknown, target: unknown): boolean {
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

/**
 * Flatten a slot return into a single-level array, unwrapping
 * `Fragment` vnodes so partition logic operates on a flat sequence.
 * Fragments only serve as grouping markers and lose no DOM semantics
 * when flattened.
 */
function flattenSlot(nodes: unknown): unknown[] {
    if (nodes == null || nodes === false) return [];
    if (Array.isArray(nodes)) return nodes.flatMap(flattenSlot);
    if (typeof nodes !== 'object') return [nodes];
    const v = nodes as VNode;
    if (v.type === Fragment) return flattenSlot(v.children);
    return [nodes];
}

/**
 * Partition slot children into vnodes that should render BEFORE the
 * auto-body and vnodes that should render AFTER it. Body precedence
 * rules:
 *
 *   <thead>           ← always first
 *   <tbody>           ← auto-rendered band
 *   <VCTableEmpty>    ← own <tbody>, gated on empty data
 *   <VCTableLoading>  ← own <tbody>, gated on busy
 *   <tfoot>           ← must come last (HTML5 says SHOULD; matches
 *                       browser visual placement so the source order
 *                       lines up with the rendered order)
 *
 * Only `<VCTableFooter>` is partitioned to "after"; everything else
 * keeps source order in "before".
 */
function partitionBeforeAfterBody(nodes: unknown): { before: unknown[]; after: unknown[] } {
    const flat = flattenSlot(nodes);
    const before: unknown[] = [];
    const after: unknown[] = [];
    for (const n of flat) {
        if (n && typeof n === 'object' && (n as VNode).type === VCTableFooter) {
            after.push(n);
        } else {
            before.push(n);
        }
    }
    return {
        before,
        after,
    };
}

/**
 * Compose the inner children of a `<table>` for the driver auto-render
 * path (plan 033 v0.2-B). Returns the array of vnodes in the order
 * the table should render them:
 *
 *   caption? · colgroup? · autoHeader? · slotChildren · autoBody?
 *
 * Header / body auto-render fires when `columns.length > 0` AND the
 * matching part isn't already present in `slotChildren` (Fragment-
 * aware via `containsComponent`).
 */
export function composeTableInner(opts: {
    cols: TableColumn<unknown>[];
    slotChildren: unknown;
    captionSlot?: (() => unknown) | undefined;
    colgroupSlot?: (() => unknown) | undefined;
    /**
     * Consumer's slot map. When set, the auto-render path dispatches
     * `#cell-<key>` slots onto each `<VCTableCell>` and `#header-<key>`
     * slots onto each `<VCTableHeadCell>`. Closes the gap between the
     * documented `TableColumn` JSDoc (which advertises these slot
     * names) and the auto-render runtime (which previously ignored
     * them — see issue #1592).
     *
     * Typed as a permissive dynamic-key map (not Vue's `Slots` /
     * `InternalSlots`) so callers can pass `slots` from a strictly-
     * typed `defineComponent({ slots: SlotsType<{…}> })` setup
     * argument without TS rejecting the assignment.
     */
    slots?: Record<string, ((slotProps?: unknown) => unknown) | undefined>;
    /**
     * Current sort state. Forwarded to the `#header-<key>` slot props
     * (`sort` field) so consumers can render their own indicator. Only
     * read when `slots` is provided.
     */
    sort?: TableSortState;
    /**
     * `setSort` callback. Forwarded to the `#header-<key>` slot props
     * so a custom header can drive sort changes. Only read when
     * `slots` is provided.
     */
    setSort?: (key: string, opts?: { direction?: SortDirection }) => void;
    /**
     * When set, the body band is REPLACED by a skeleton `<tbody>`
     * with `placeholderRows × cols.length` placeholder bars. Header
     * still auto-renders from `cols` (real column labels); any
     * consumer-provided `<VCTableBody>` / `<VCTableLoading>` /
     * `<VCTableEmpty>` in `slotChildren` is suppressed so the
     * skeleton fully owns the rows region while loading.
     */
    placeholderRows?: number | undefined;
    /**
     * `<VCTable :expandable>` opt-in (plan 038). When true, the
     * auto-rendered header gets a leading/trailing placeholder `<th>`
     * for the trigger column, and each auto-rendered `<VCTableRow>`
     * is mounted with `expandable={true}` + the `#expansion` slot
     * bridge.
     */
    expandable?: boolean;
    /**
     * Trigger placement when `expandable` is on. `'none'` skips both
     * the placeholder `<th>` and the trigger-cell auto-injection
     * (consumer places `<VCTableExpandTrigger>` inside a data cell).
     */
    expandableTrigger?: TableExpandableTrigger;
    /** `#expansion` slot from `<VCTable>`, forwarded into each auto-rendered row. */
    expansionSlot?: ((slotProps: { row: unknown; index: number }) => unknown) | undefined;
}): unknown[] {
    const {
        cols,
        slotChildren,
        captionSlot,
        colgroupSlot,
        slots,
        sort,
        setSort,
        placeholderRows,
        expandable = false,
        expandableTrigger = 'leading',
        expansionSlot,
    } = opts;

    const injectTrigger = expandable && expandableTrigger !== 'none';

    const inner: unknown[] = [];
    if (captionSlot) inner.push(h('caption', null, captionSlot() as never));
    if (colgroupSlot) inner.push(h('colgroup', null, colgroupSlot() as never));

    const autoRender = cols.length > 0;
    const hasHeader = autoRender && containsComponent(slotChildren, VCTableHeader);
    const hasBody = autoRender && containsComponent(slotChildren, VCTableBody);

    // Misalignment guard (plan 038): when the consumer writes a manual
    // `<VCTableHeader>` AND opts into expandable rows (driver mode),
    // the body's auto-injected trigger column will out-count the
    // consumer's header columns by one. Dev-warn so the misalignment
    // is visible — fixing it requires either consumer-side
    // `<VCTableHeadCell aria-hidden>` or switching to auto-header.
    if (
        process.env.NODE_ENV !== 'production' &&
        autoRender && hasHeader && injectTrigger
    ) {
        // eslint-disable-next-line no-console
        console.warn(
            `[VCTable] :expandable is on with a manual <VCTableHeader>. The auto-injected body trigger column will not have a matching header cell. Add a \`<VCTableHeadCell aria-hidden="true" />\` at the same edge (:expandable-trigger="${expandableTrigger ?? 'leading'}") OR omit the manual <VCTableHeader> to let the driver auto-render align both bands.`,
        );
    }

    if (autoRender && !hasHeader) {
        // Render a single empty `<th>` placeholder for the auto-injected
        // trigger column. Carries `aria-hidden="true"` so screen readers
        // don't announce an empty column header; structural CSS sizes
        // it to `width: 1%; white-space: nowrap` so it shrinks to
        // chevron-button width.
        const triggerHeaderCell = injectTrigger ? h(VCTableHeadCell, {
            class: 'vc-table-expand-trigger-header',
            'aria-hidden': 'true',
        }) : null;

        inner.push(h(VCTableHeader, null, () => h(VCTableRow, null, () => {
            const dataHeaders = cols.map((col) => {
            // Consumer `#header-<key>` slot wins over the default
            // `col.label` text — see issue #1592. The auto-render path
            // used to ignore these slots silently; now it dispatches
            // them with the documented `TableHeadCellSlotProps` shape.
                const headerSlot = slots?.[`header-${col.key}`];
                const cellProps = {
                    key: col.key,
                    columnKey: col.key,
                    sortable: col.sortable,
                    stickyColumn: col.stickyColumn,
                    title: col.headerTitle,
                    abbr: col.headerAbbr,
                    // `column.class` applies to BOTH <th> and <td>; `headerClass`
                    // is the header-only additive. Vue normalizes the array.
                    class: [col.class, col.headerClass],
                };
                if (headerSlot) {
                    const matched = sort?.find((s) => s.key === col.key);
                    const slotProps: TableHeadCellSlotProps<unknown> = {
                        column: col,
                        key: col.key,
                        sort: matched ? matched.direction : null,
                        setSort: (direction) => {
                            if (!setSort) return;
                            setSort(col.key, direction ? { direction } : undefined);
                        },
                    };
                    return h(VCTableHeadCell, cellProps, () => headerSlot(slotProps));
                }
                return h(VCTableHeadCell, cellProps, () => col.label);
            });

            // Place the trigger header cell at the configured edge.
            if (triggerHeaderCell === null) return dataHeaders;
            return expandableTrigger === 'trailing' ?
                [dataHeaders, triggerHeaderCell] :
                [triggerHeaderCell, dataHeaders];
        })));
    }

    // Partition slot children so `<VCTableFooter>` always lands AFTER
    // the auto-body. Without this, the common terse form
    // `<VCTable :columns :data><VCTableFooter>…</VCTableFooter></VCTable>`
    // would source-order as `thead → tfoot → tbody`, which violates
    // the HTML5 SHOULD-be-last rule for `<tfoot>` and de-syncs source
    // order from visual placement (browsers render `<tfoot>` last
    // anyway). Everything else (`<VCTableEmpty>`, `<VCTableLoading>`,
    // ad-hoc consumer nodes) keeps source order in `before`.
    const { before, after } = partitionBeforeAfterBody(slotChildren);
    if (before.length > 0) inner.push(before);

    if (placeholderRows !== undefined && cols.length > 0) {
        // Placeholder mode — skip the real body + any
        // consumer-supplied `<VCTableLoading>` / `<VCTableEmpty>`
        // (those siblings in `before` / `after` would render
        // alongside the skeleton, which looks like a double-loader).
        // Render a plain `<tbody>` with `placeholderRows × cols`
        // skeleton bars; widths vary per index so the result reads
        // as tabular data (same pattern `<VCTablePlaceholder>` uses).
        const pattern = [60, 80, 45, 90, 55, 75, 65];
        const widthFor = (rowIdx: number, colIdx: number) => {
            const len = pattern.length;
            const idx = ((rowIdx * 3 + colIdx) % len + len) % len;
            return `${pattern[idx]}%`;
        };
        const rowRange = Array.from({ length: Math.max(0, placeholderRows) }, (_, i) => i);
        inner.push(h(
            'tbody',
            { class: 'vc-table-placeholder-body', 'aria-hidden': 'true' },
            rowRange.map((r) => h(
                'tr',
                { class: 'vc-table-placeholder-row' },
                cols.map((_, c) => h(
                    'td',
                    { class: 'vc-table-placeholder-cell' },
                    [h(VCPlaceholder, { width: widthFor(r, c) })],
                )),
            )),
        ));
        return inner;
    }

    if (autoRender && !hasBody) {
        inner.push(h(VCTableBody, null, {
            row: ({ row, index }: { row: unknown; index: number }) => {
                const rowProps = expandable ? {
                    row,
                    index,
                    expandable: true,
                    expandableTrigger,
                } : { row, index };
                const rowSlots: Record<string, (slotProps?: unknown) => unknown> = {
                    default: () => cols.map((col) => {
                        const cellProps = {
                            key: col.key,
                            columnKey: col.key,
                            isRowHeader: col.isRowHeader,
                            stickyColumn: col.stickyColumn,
                            dataLabel: col.label,
                            class: [col.class, col.cellClass],
                        };
                        // Consumer `#cell-<key>` slot wins over
                        // `<VCTableCell>`'s auto-render path. Slot props
                        // mirror `TableCellSlotProps` — see issue #1592.
                        const cellSlot = slots?.[`cell-${col.key}`];
                        if (cellSlot) {
                            const slotProps: TableCellSlotProps<unknown> = {
                                row,
                                value: resolveCellValue(col, row),
                                key: col.key,
                                column: col,
                                index,
                            };
                            return h(VCTableCell, cellProps, () => cellSlot(slotProps));
                        }
                        return h(VCTableCell, cellProps);
                    }),
                };
                // Bridge the table-level `#expansion` slot through to
                // each row's own `#expansion` slot. Only emit the slot
                // when the consumer provided one — Vue treats `slots`
                // record entries as always-defined.
                if (expandable && expansionSlot) {
                    rowSlots.expansion = (slotProps) => expansionSlot(
                        slotProps as { row: unknown; index: number },
                    );
                }
                return h(VCTableRow, rowProps, rowSlots);
            },
        }));
    }

    if (after.length > 0) inner.push(after);

    return inner;
}
