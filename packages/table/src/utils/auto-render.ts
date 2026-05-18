import { Fragment, h } from 'vue';
import type { VNode } from 'vue';
import VCTableBody from '../components/TableBody.vue';
import VCTableCell from '../components/TableCell.vue';
import VCTableHeadCell from '../components/TableHeadCell.vue';
import VCTableHeader from '../components/TableHeader.vue';
import VCTableRow from '../components/TableRow.vue';
import type { TableColumn } from '../types';

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
}): unknown[] {
    const {
        cols, 
        slotChildren, 
        captionSlot, 
        colgroupSlot,
    } = opts;

    const inner: unknown[] = [];
    if (captionSlot) inner.push(h('caption', null, captionSlot() as never));
    if (colgroupSlot) inner.push(h('colgroup', null, colgroupSlot() as never));

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

    return inner;
}
