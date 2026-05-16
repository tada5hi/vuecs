<script lang="ts">
import { 
    computed, 
    defineComponent, 
    h, 
    mergeProps, 
} from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { useTable, useTableRow } from '../composables/context';
import type { TableCellThemeClasses } from '../types';
import { resolveAttrs, resolveCellValue } from '../utils/render-utils';

const tableCellThemeDefaults = { classes: { root: 'vc-table-cell' } };

const tableCellProps = {
    /** Render as `<th scope="row">` instead of `<td>` (mirror of `column.isRowHeader`). */
    isRowHeader: { type: Boolean, default: false },
    /** Column key this cell corresponds to — used to resolve `_cellVariants[key]` from row meta. */
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

        // Resolve the driver column for this cell (for accessor +
        // formatter + cellAttrs fallthrough). When a `<VCTableCell>` is
        // used outside the driver (no :column-key or no `<VCTable>`),
        // `column.value` is undefined and the cell falls back to
        // slot-only content.
        const column = computed(() => {
            if (!props.columnKey || !tableCtx) return undefined;
            return tableCtx.columns.value.find((c) => c.key === props.columnKey);
        });
        const value = computed(() => {
            if (!column.value || !rowCtx) return undefined;
            return resolveCellValue(column.value, rowCtx.row.value);
        });
        const formatted = computed(() => {
            if (!column.value) return undefined;
            if (column.value.formatter && rowCtx) {
                return column.value.formatter({
                    value: value.value,
                    key: column.value.key,
                    row: rowCtx.row.value,
                });
            }
            return value.value === undefined || value.value === null ? '' : String(value.value);
        });
        const dataLabel = computed(() => props.dataLabel ?? column.value?.label);
        const dynamicCellAttrs = computed(() => {
            if (!column.value?.cellAttrs || !rowCtx) return undefined;
            return resolveAttrs(column.value.cellAttrs, {
                value: value.value,
                key: column.value.key,
                row: rowCtx.row.value,
            });
        });

        return () => {
            const slotContent = slots.default?.();
            const content = slotContent ?? formatted.value;
            return h(
                props.isRowHeader ? 'th' : 'td',
                mergeProps(attrs, dynamicCellAttrs.value ?? {}, {
                    class: theme.value.root || undefined,
                    'data-label': dataLabel.value || undefined,
                    'data-sticky-column': props.stickyColumn ? '' : undefined,
                    scope: props.isRowHeader ? 'row' : undefined,
                }),
                content,
            );
        };
    },
});
</script>
