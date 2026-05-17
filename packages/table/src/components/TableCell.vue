<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { 
    ExtractPublicPropTypes, 
    PropType, 
    Slot, 
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
 * Detect whether the consumer-passed default slot actually has content
 * (vs being an empty / whitespace-only / comment-only render).
 *
 * Vue passes `slots.default` as a render fn that's always present when
 * a `<template>` slot is declared (even if empty), so a naive
 * `slots.default?.()` check would always pick the slot path and skip
 * the auto-render. Walk the returned vnode array and look for at least
 * one element / text node with non-whitespace content.
 */
function hasMeaningfulSlotContent(slot: Slot | undefined): boolean {
    if (!slot) return false;
    const vnodes = slot();
    if (!Array.isArray(vnodes)) return !!vnodes;
    for (const v of vnodes) {
        // Comments + static placeholders → skip.
        if (typeof v.type === 'symbol') {
            // Text nodes: type === Text symbol; children is the text.
            if (typeof v.children === 'string' && v.children.trim().length > 0) return true;
            continue;
        }
        // Element or component vnode.
        return true;
    }
    return false;
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
            // anything.
            let content: unknown = slots.default?.();
            if (
                props.columnKey &&
                tableCtx &&
                rowCtx &&
                !hasMeaningfulSlotContent(slots.default)
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

            return h(
                props.isRowHeader ? 'th' : 'td',
                mergeProps(attrs, {
                    class: theme.value.root || undefined,
                    'data-label': props.dataLabel || undefined,
                    'data-sticky-column': props.stickyColumn ? '' : undefined,
                    scope: props.isRowHeader ? 'row' : undefined,
                }),
                content as string | VNodeArrayChildren,
            );
        };
    },
});
</script>
