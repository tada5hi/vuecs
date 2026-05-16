<script lang="ts">
import { 
    computed, 
    defineComponent, 
    h, 
    mergeProps, 
    onBeforeUnmount, 
    onMounted, 
} from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { useHeadCellCountContext, useTable } from '../composables/context';
import type { SortDirection, TableHeadCellThemeClasses } from '../types';

const tableHeadCellThemeDefaults = {
    classes: {
        root: 'vc-table-head-cell',
        sortIcon: 'vc-table-head-cell-sort-icon',
    },
};

const tableHeadCellProps = {
    /** Column key — required for sort wiring (omit for purely presentational heads). */
    columnKey: { type: String, default: undefined },
    /** Mark this header sortable. When set, click + Enter/Space cycle sort state. */
    sortable: { type: Boolean, default: false },
    /** Override scope ("col" / "colgroup" / "row" / "rowgroup"). Smart default: colspan→colgroup, rowspan→rowgroup, else col. */
    scope: { type: String as PropType<'col' | 'colgroup' | 'row' | 'rowgroup'>, default: undefined },
    /** Native `<th colspan>` (forwarded; also drives the smart scope default). */
    colspan: { type: Number, default: undefined },
    /** Native `<th rowspan>` (forwarded; also drives the smart scope default). */
    rowspan: { type: Number, default: undefined },
    /** Native `<th title>`. */
    title: { type: String, default: undefined },
    /** Native `<th abbr>`. */
    abbr: { type: String, default: undefined },
    /** Alignment helper — selects the `align.<value>` theme variant. */
    align: { type: String as PropType<'left' | 'center' | 'right'>, default: undefined },
    /** `position: sticky` on this header cell. Forwarded as `themeVariant.stickyColumn`. */
    stickyColumn: { type: Boolean, default: undefined },
    ...themableProps<TableHeadCellThemeClasses>(),
};

export type TableHeadCellProps = ExtractPublicPropTypes<typeof tableHeadCellProps>;

export default defineComponent({
    name: 'VCTableHeadCell',
    inheritAttrs: false,
    props: tableHeadCellProps,
    setup(props, { attrs, slots }) {
        const ctx = useTable();

        // Register against the head-cell-count context so Shape B
        // (manual <VCTableHeader>) can auto-resolve the empty / loading
        // colspan. The `<VCTableFooter>` provides a no-op variant, so
        // cells in the footer skip this.
        const countCtx = useHeadCellCountContext();
        onMounted(() => countCtx?.register());
        onBeforeUnmount(() => countCtx?.unregister());

        // Theme — fold sorted state + stickyColumn into themeVariant
        const themeProps = useThemeProps(props, 'align', 'stickyColumn');
        const sortDirection = computed<SortDirection | null>(() => {
            if (!props.sortable || !props.columnKey || !ctx) return null;
            const s = ctx.sort.value;
            return s && s.key === props.columnKey ? s.direction : null;
        });

        const mergedThemeProps = {
            get themeClass() { return themeProps.themeClass; },
            get themeVariant() {
                return {
                    ...(themeProps.themeVariant ?? {}),
                    sorted: sortDirection.value ?? 'none',
                };
            },
        };
        const theme = useComponentTheme('tableHeadCell', mergedThemeProps, tableHeadCellThemeDefaults);

        // Smart scope default — col / colgroup / rowgroup per the multi-axis
        // span hints. Consumers can still override via `:scope`.
        const resolvedScope = computed(() => {
            if (props.scope) return props.scope;
            if (props.colspan && props.colspan > 1) return 'colgroup';
            if (props.rowspan && props.rowspan > 1) return 'rowgroup';
            return 'col';
        });

        const ariaSort = computed(() => {
            if (!props.sortable) return undefined;
            const d = sortDirection.value;
            if (d === 'asc') return 'ascending';
            if (d === 'desc') return 'descending';
            return 'none';
        });

        function onClick(event: globalThis.MouseEvent) {
            if (!props.sortable || !props.columnKey) return;
            event.preventDefault();
            ctx?.setSort(props.columnKey);
        }

        function onKeydown(event: globalThis.KeyboardEvent) {
            if (!props.sortable || !props.columnKey) return;
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                ctx?.setSort(props.columnKey);
            }
        }

        return () => h(
            'th',
            mergeProps(attrs, {
                class: theme.value.root || undefined,
                scope: resolvedScope.value,
                'data-sticky-column': props.stickyColumn ? '' : undefined,
                colspan: props.colspan,
                rowspan: props.rowspan,
                title: props.title,
                abbr: props.abbr,
                'aria-sort': ariaSort.value,
                tabindex: props.sortable ? 0 : undefined,
                role: props.sortable ? 'columnheader' : undefined,
                onClick: props.sortable ? onClick : undefined,
                onKeydown: props.sortable ? onKeydown : undefined,
            }),
            [
                slots.default?.(),
                props.sortable && sortDirection.value ?
                    h('span', {
                        class: theme.value.sortIcon || undefined,
                        'aria-hidden': 'true',
                        'data-sort': sortDirection.value,
                    }, sortDirection.value === 'asc' ? '↑' : '↓') :
                    null,
            ],
        );
    },
});
</script>
