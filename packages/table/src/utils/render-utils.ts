import { isObject } from '@vuecs/core';
import type { TableColumn, TableColumnRaw } from '../types';

/**
 * Convert a key like `'firstName'` / `'first_name'` / `'first-name'` to
 * `'First Name'`. Used by the bare-string column shorthand to derive
 * a label when only the key is given.
 */
export function startCase(input: string): string {
    if (!input) return '';
    return input
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

/**
 * Normalize the `:columns` prop into a uniform `TableColumn[]`.
 *
 * - **Explicit array**: pass through, fill `label` from `startCase(key)`.
 * - **Bare-string shorthand**: `['id', 'name']` → `[{ key, label }, ...]`.
 * - **Auto-derive**: when `columns` is undefined/empty AND `data[0]` is an
 *   object, derive the columns from `Object.keys(data[0])`, skipping
 *   underscore-prefixed row-meta keys (`_rowVariant` / `_cellVariants`).
 */
export function normalizeColumns<Row>(
    columns: ReadonlyArray<TableColumnRaw<Row>> | undefined,
    data: ReadonlyArray<Row>,
): TableColumn<Row>[] {
    const fromRaw = (col: TableColumnRaw<Row>): TableColumn<Row> => {
        if (typeof col === 'string') {
            return { key: col, label: startCase(col) };
        }
        return { label: startCase(col.key), ...col };
    };

    if (columns && columns.length > 0) {
        return columns.map(fromRaw);
    }

    if (data.length === 0 || !isObject(data[0])) return [];

    const first = data[0] as Record<string, unknown>;
    return Object.keys(first)
        .filter((key) => !key.startsWith('_'))
        .map((key) => ({ key, label: startCase(key) }));
}

/**
 * Resolve a column's value against a row.
 *
 * - String accessor: dot-path lookup (e.g. `'profile.email'` → `row.profile.email`)
 * - Function accessor: invoked with the row
 * - Falls back to `row[column.key]`
 */
export function resolveCellValue<Row>(column: TableColumn<Row>, row: Row): unknown {
    const { accessor } = column;
    if (typeof accessor === 'function') {
        return accessor(row);
    }
    if (typeof accessor === 'string') {
        return resolveDotPath(row, accessor);
    }
    if (isObject(row)) {
        return (row as Record<string, unknown>)[column.key];
    }
    return undefined;
}

function resolveDotPath(obj: unknown, path: string): unknown {
    if (!isObject(obj)) return undefined;
    let cur: unknown = obj;
    for (const part of path.split('.')) {
        if (!isObject(cur)) return undefined;
        cur = (cur as Record<string, unknown>)[part];
    }
    return cur;
}

/**
 * Resolve attribute objects, supporting both static-object and function forms
 * used by `cellAttrs` and `headerAttrs`.
 */
export function resolveAttrs<Ctx>(
    attrs: Record<string, unknown> | ((ctx: Ctx) => Record<string, unknown>) | undefined,
    ctx: Ctx,
): Record<string, unknown> | undefined {
    if (!attrs) return undefined;
    return typeof attrs === 'function' ? attrs(ctx) : attrs;
}

// ──────────────────────────────────────────────────────────────────────────
// filterEvent — ported from bootstrap-vue-next's utils/filterEvent.ts
// (plan 028 §"filterEvent — richer interactive-descendant exclusion")
// ──────────────────────────────────────────────────────────────────────────

/**
 * Selectors that mark an element (or an ancestor of it) as interactive —
 * row-click handlers should NOT fire when the click originates inside one
 * of these. Plan 028 D5 ships this list; the closest-ancestor matching
 * (vs direct-match) is what catches clicks on text INSIDE a button or
 * anchor.
 */
const INTERACTIVE_SELECTOR = [
    'a',
    'button',
    'input',
    'select',
    'textarea',
    'label[for]',
    '[role="button"]',
    '[role="link"]',
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]:not([tabindex="-1"])',
    '.vc-overlay-portal-content',
].join(',');

/**
 * Returns `true` when a row-level click should be suppressed because the
 * event originated inside an interactive descendant — a button, anchor,
 * form input, role=button/link, an explicitly-focusable element, or a
 * portal'd overlay rendered into the document body (e.g. a
 * `<VCDropdownMenu>` action menu inside the row).
 *
 * Use at the row click handler: `if (filterRowClickEvent(event)) return;`.
 */
export function filterRowClickEvent(event: Event): boolean {
    const { target } = event;
    if (!(target instanceof Element)) return false;
    const hit = target.closest(INTERACTIVE_SELECTOR);
    return hit !== null;
}
