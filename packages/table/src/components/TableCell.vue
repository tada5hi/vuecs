<script lang="ts">
import {
    Comment,
    Fragment,
    Text,
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type {
    ExtractPublicPropTypes,
    PropType,
    VNode,
    VNodeArrayChildren,
} from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { useTable, useTableRow } from '../composables/context';
import { resolveCellValue } from '../utils/render-utils';
import type { TableCellThemeClasses } from '../types';

const tableCellThemeDefaults = { classes: { root: 'vc-table-cell' } };

const tableCellProps = {
    /** Render as `<th scope="row">` instead of `<td>` (mirror of `column.isRowHeader`). */
    isRowHeader: { type: Boolean, default: false },
    /**
     * Column key this cell corresponds to — used to resolve
     * `_cellVariants[key]` from row meta AND to look up the column's
     * `accessor` / `formatter` for the default-render path.
     */
    columnKey: { type: String, default: undefined },
    /** Forward-compat for stacked-mode CSS — emitted as `data-label`. */
    dataLabel: { type: String, default: undefined },
    /** Alignment helper — selects the `align.<value>` theme variant. */
    align: { type: String as PropType<'left' | 'center' | 'right'>, default: undefined },
    /** `position: sticky` on this cell. Forwarded as `themeVariant.stickyColumn`. */
    stickyColumn: { type: Boolean, default: undefined },
    ...themableProps<TableCellThemeClasses>(),
};

export type TableCellProps = ExtractPublicPropTypes<typeof tableCellProps>;

/**
 * Detect whether the consumer-passed default slot's rendered vnodes
 * contain any meaningful content (vs being an empty / whitespace-only
 * / comment-only render).
 *
 * Vue passes `slots.default` as a render fn that's always present when
 * a `<template>` slot is declared (even if empty), so a naive
 * `slots.default?.()` truthy check would always pick the slot path
 * and skip the auto-render. Walk the rendered vnodes and recurse into
 * `Fragment` children — a `<template v-if>` / `<template v-for>` /
 * multi-child template renders as a Fragment whose `children` is the
 * actual content. Without recursion those would be falsely classified
 * as empty.
 *
 * Takes the pre-rendered vnodes (not the slot fn) so the caller can
 * invoke the slot at most once per render — slot fns can be
 * non-trivial and should not be called twice.
 */
function hasMeaningfulSlotContent(nodes: unknown): boolean {
    if (nodes == null || nodes === false) return false;
    if (typeof nodes === 'string') return nodes.trim().length > 0;
    if (typeof nodes === 'number') return true;
    if (Array.isArray(nodes)) {
        for (const child of nodes) {
            if (hasMeaningfulSlotContent(child)) return true;
        }
        return false;
    }
    if (typeof nodes !== 'object') return false;
    const v = nodes as VNode;
    if (v.type === Comment) return false;
    if (v.type === Text) {
        return typeof v.children === 'string' && v.children.trim().length > 0;
    }
    if (v.type === Fragment) {
        return hasMeaningfulSlotContent(v.children);
    }
    // Element or component vnode (string tag, object component, symbol other than the above).
    return true;
}

export default defineComponent({
    name: 'VCTableCell',
    inheritAttrs: false,
    props: tableCellProps,
    setup(props, { attrs, slots }) {
        const tableCtx = useTable();
        const rowCtx = useTableRow();
        const themeProps = useThemeProps(props, 'align', 'stickyColumn');

        const mergedThemeProps = {
            get themeClass() { return themeProps.themeClass; },
            get themeVariant() {
                const cellVariant = props.columnKey ?
                    rowCtx?.cellVariants.value[props.columnKey] ?? undefined :
                    undefined;
                return {
                    ...(themeProps.themeVariant ?? {}),
                    ...(cellVariant ? { cellVariant } : {}),
                };
            },
        };
        const theme = useComponentTheme('tableCell', mergedThemeProps, tableCellThemeDefaults);

        return () => {
            // Default-render path: when the consumer didn't provide slot
            // content AND we have enough context (table column lookup + row
            // value), resolve via `accessor` + `formatter`. Slot content
            // always wins — the consumer keeps full control when they pass
            // anything. Invoke `slots.default` at most once per render.
            const slotVNodes = slots.default?.();
            let content: unknown = slotVNodes;
            if (
                props.columnKey &&
                tableCtx &&
                rowCtx &&
                !hasMeaningfulSlotContent(slotVNodes)
            ) {
                const column = tableCtx.columns.value
                    .find((c) => c.key === props.columnKey);
                if (column) {
                    const value = resolveCellValue(column, rowCtx.row.value);
                    if (column.formatter) {
                        content = column.formatter({
                            value,
                            key: column.key,
                            row: rowCtx.row.value,
                        });
                    } else if (value === undefined || value === null) {
                        content = '';
                    } else {
                        content = String(value);
                    }
                }
            }

            // ARIA grid pattern: when the parent table has `role="grid"`
            // (selection-mode active), implicit `<td>` / `<th>` roles
            // don't carry through the overridden parent role. Cells
            // need explicit `gridcell` / `rowheader` so assistive tech
            // sees a complete grid structure.
            const inGrid = tableCtx?.selection.mode.value !== undefined;
            let cellRole: 'rowheader' | 'gridcell' | undefined;
            if (inGrid) cellRole = props.isRowHeader ? 'rowheader' : 'gridcell';
            const ariaAttrs: Record<string, unknown> = inGrid ? { role: cellRole } : {};

            return h(
                props.isRowHeader ? 'th' : 'td',
                mergeProps(attrs, {
                    class: theme.value.root || undefined,
                    'data-label': props.dataLabel || undefined,
                    'data-sticky-column': props.stickyColumn ? '' : undefined,
                    scope: props.isRowHeader ? 'row' : undefined,
                    ...ariaAttrs,
                }),
                content as string | VNodeArrayChildren,
            );
        };
    },
});
</script>
