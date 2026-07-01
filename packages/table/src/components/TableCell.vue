<script lang="ts">
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type {
    ExtractPublicPropTypes,
    PropType,
    VNodeArrayChildren,
} from 'vue';
import {
    isMeaningfulSlotContent,
    themableProps,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
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
    /**
     * Renders a selection checkbox/radio for this row. Pairs with
     * `<VCTableHeadCell isSelector>` to build a selection column.
     * State mirrors `selection.isSelected(rowKey)`; clicking toggles
     * that row independently of any row-click handler. Falls back
     * to the default slot when selection is off.
     */
    isSelector: { type: Boolean, default: false },
    /** `aria-label` for the per-row checkbox (defaults to `'Select row'`). */
    selectorAriaLabel: { type: String, default: 'Select row' },
    ...themableProps<TableCellThemeClasses>(),
};

export type TableCellProps = ExtractPublicPropTypes<typeof tableCellProps>;

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
            // Selector cell — renders a checkbox / radio bound to the
            // current row's selection state. Short-circuits the
            // default-cell rendering entirely so consumers don't need
            // to pass slot content. Falls back to the default render
            // path when selection is off, so consumers can keep
            // `is-selector` cells in place when toggling selection.
            if (props.isSelector && tableCtx?.selection.mode.value !== undefined && rowCtx) {
                const rowKey = rowCtx.selectionKey.value;
                const mode = tableCtx.selection.mode.value;
                const checked = tableCtx.selection.isSelected(rowKey);
                // ARIA grid role is always required here — the outer
                // guard already established `mode !== undefined`, so
                // the parent `<table>` carries `role="grid"`.
                return h(
                    props.isRowHeader ? 'th' : 'td',
                    mergeProps(attrs, {
                        class: theme.value.root || undefined,
                        'data-label': props.dataLabel || undefined,
                        'data-sticky-column': props.stickyColumn ? '' : undefined,
                        scope: props.isRowHeader ? 'row' : undefined,
                        role: props.isRowHeader ? 'rowheader' : 'gridcell',
                    }),
                    [
                        h('input', {
                            type: mode === 'single' ? 'radio' : 'checkbox',
                            class: 'vc-table-selector-checkbox',
                            'aria-label': props.selectorAriaLabel,
                            checked,
                            onClick: (e: globalThis.MouseEvent) => {
                                e.stopPropagation();
                                if (rowKey === undefined) return;
                                tableCtx.selection.toggle(rowKey);
                            },
                        }),
                    ],
                );
            }

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
                !isMeaningfulSlotContent(slotVNodes)
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
