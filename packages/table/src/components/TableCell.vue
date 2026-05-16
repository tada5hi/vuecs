<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { useTableRow } from '../composables/context';
import type { TableCellThemeClasses } from '../types';

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

        return () => h(
            props.isRowHeader ? 'th' : 'td',
            mergeProps(attrs, {
                class: theme.value.root || undefined,
                'data-label': props.dataLabel || undefined,
                'data-sticky-column': props.stickyColumn ? '' : undefined,
                scope: props.isRowHeader ? 'row' : undefined,
            }),
            slots.default?.(),
        );
    },
});
</script>
