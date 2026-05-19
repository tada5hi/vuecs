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

function renderHeadContent(args: {
    isSelector: boolean;
    selectionMode: 'single' | 'multi' | undefined;
    selectAllState: 'all' | 'some' | 'none';
    selectorAriaLabel: string;
    onSelectorClick: () => void;
    defaultSlot: (() => unknown) | undefined;
}): unknown {
    if (!args.isSelector) return args.defaultSlot?.();
    // Empty in single mode — "select-all" doesn't apply.
    if (args.selectionMode === 'single') return null;
    // No selection mode at all → fall back to whatever the consumer
    // put in the slot so the column doesn't visually collapse.
    if (args.selectionMode === undefined) return args.defaultSlot?.();
    return h('input', {
        type: 'checkbox',
        class: 'vc-table-selector-checkbox',
        'aria-label': args.selectorAriaLabel,
        checked: args.selectAllState === 'all',
        // jsdom + real browsers both require setting `indeterminate`
        // as a property (no attribute form). Vue's runtime forwards
        // prop-style bindings via `el.indeterminate = …`.
        indeterminate: args.selectAllState === 'some',
        onClick: (e: globalThis.MouseEvent) => {
            e.stopPropagation();
            args.onSelectorClick();
        },
    });
}

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
    /**
     * Renders a select-all checkbox when the parent table has
     * `:selection-mode="multi"`. State is derived from the current
     * selection: checked = all rows selected; indeterminate = some
     * rows selected; unchecked = none. Clicking toggles between
     * select-all and clear-all. In `single` mode the header
     * renders empty (only one row can be selected); when selection
     * is off, the slot's default content renders so the column
     * collapses gracefully.
     */
    isSelector: { type: Boolean, default: false },
    /** `aria-label` for the select-all checkbox (defaults to `'Select all rows'`). */
    selectorAriaLabel: { type: String, default: 'Select all rows' },
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
        // Sort state is `SortDescriptor[]` since v1.x-B. Find THIS
        // column's entry to drive the indicator arrow + numeric badge.
        const sortDirection = computed<SortDirection | null>(() => {
            if (!props.sortable || !props.columnKey || !ctx) return null;
            const found = ctx.sort.value.find((s) => s.key === props.columnKey);
            return found ? found.direction : null;
        });
        const sortIndex = computed<number | null>(() => {
            if (!props.sortable || !props.columnKey || !ctx) return null;
            const i = ctx.sort.value.findIndex((s) => s.key === props.columnKey);
            return i < 0 ? null : i + 1;
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
            ctx?.setSort(props.columnKey, { append: event.shiftKey });
        }

        // Select-all state — derived from the visible data set and
        // the current selection. Visible-data check matches the
        // documented "select-all" mental model: if the user has
        // filtered rows out, select-all only affects the visible
        // subset.
        const allRowKeys = computed<(string | number)[]>(() => {
            if (!ctx) return [];
            const data = ctx.data.value;
            return data.map((row, i) => ctx.getRowKey(row, i));
        });
        const selectAllState = computed<'all' | 'some' | 'none'>(() => {
            if (!ctx || ctx.selection.mode.value !== 'multi') return 'none';
            const keys = allRowKeys.value;
            if (keys.length === 0) return 'none';
            let selectedCount = 0;
            for (const k of keys) if (ctx.selection.isSelected(k)) selectedCount += 1;
            if (selectedCount === 0) return 'none';
            if (selectedCount === keys.length) return 'all';
            return 'some';
        });
        function onSelectorClick() {
            if (!ctx || ctx.selection.mode.value !== 'multi') return;
            // 'all' → clear; 'none' or 'some' → select all visible.
            // Matches the platform-standard select-all interaction
            // (Gmail / GitHub / macOS Finder).
            if (selectAllState.value === 'all') ctx.selection.setValue([]);
            else ctx.selection.setValue([...allRowKeys.value]);
        }

        function onKeydown(event: globalThis.KeyboardEvent) {
            if (!props.sortable || !props.columnKey) return;
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                ctx?.setSort(props.columnKey, { append: event.shiftKey });
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
                // Numeric multi-sort badge index. `null` (or 1 — the
                // primary key) doesn't emit the attribute, so the
                // structural CSS `::after` badge only shows for
                // secondary/tertiary keys; primary key still gets the
                // up/down arrow span below.
                'data-sort-index': sortIndex.value !== null && sortIndex.value > 1 ?
                    String(sortIndex.value) :
                    undefined,
                tabindex: props.sortable ? 0 : undefined,
                // Explicit `role="columnheader"` is required whenever the
                // parent table has `role="grid"` (selection-mode active)
                // OR the header is sortable (vuecs's tabindex pattern).
                // Outside both cases, `<th>` inside `<thead>` carries the
                // implicit `columnheader` role.
                role: (props.sortable || ctx?.selection.mode.value !== undefined) ?
                    'columnheader' :
                    undefined,
                onClick: props.sortable ? onClick : undefined,
                onKeydown: props.sortable ? onKeydown : undefined,
            }),
            [
                // Selector head — checkbox in multi mode; empty in
                // single mode (only one row can be selected so a
                // "select-all" doesn't apply). Falls through to the
                // default slot when selection is off entirely so the
                // column collapses gracefully if a consumer keeps
                // `is-selector` cells in place when toggling
                // selection off.
                renderHeadContent({
                    isSelector: props.isSelector,
                    selectionMode: ctx?.selection.mode.value,
                    selectAllState: selectAllState.value,
                    selectorAriaLabel: props.selectorAriaLabel,
                    onSelectorClick,
                    defaultSlot: slots.default,
                }),
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
