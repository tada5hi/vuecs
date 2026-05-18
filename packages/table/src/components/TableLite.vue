<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    mergeProps,
    ref,
    toRef,
    watch,
} from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import {
    provideHeadCellCountContext,
    provideTableContext,
} from '../composables/context';
import { useRowSelectionMachine } from '../composables/selection';
import type { RowSelectionKey } from '../composables/selection';
import type {
    TableColumn,
    TableColumnRaw,
    TableSlotProps,
    TableThemeClasses,
} from '../types';
import { composeTableInner } from '../utils/auto-render';
import { normalizeColumns } from '../utils/render-utils';

const tableLiteThemeDefaults = {
    classes: {
        root: 'vc-table',
        scrollContainer: 'vc-table-scroll-container',
    },
};

/**
 * Slim sibling of `<VCTable>` — same columns driver + theme system +
 * auto-render, but with the sort + row-click + keyboard-nav machinery
 * stripped out (plan 033 v0.2-C). Consumers who want their own state
 * plumbing (e.g. tanstack-table on top) import this instead of the
 * full `<VCTable>`. Lite-only consumers tree-shake `useSortMachine`
 * out of their bundle.
 *
 * Provides the same `TableContext` shape so child components
 * (`<VCTableRow>`, `<VCTableHeadCell>`, …) work identically — the
 * sort / row-click hooks are wired to no-ops, so sortable headers and
 * `:row-clickable` rows visually behave as if the consumer hadn't
 * opted in.
 */
const tableLiteProps = {
    /** Row data array. */
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    /** Column definitions (TableColumn or bare-string shorthand). When omitted, columns are derived from `Object.keys(data[0])`. */
    columns: { type: Array as PropType<TableColumnRaw<unknown>[]>, default: undefined },
    /** Busy flag — drives `aria-busy` on the `<table>` and gates the loading-band render. */
    busy: { type: Boolean, default: false },
    /** Wrap the `<table>` in an overflow scroll container. */
    scrollable: { type: Boolean, default: false },
    /** When `:scrollable`, sticks the `<thead>` to the top of the scroll container. */
    stickyHeader: { type: Boolean, default: false },
    /** When `:scrollable`, applied as `max-height` on the scroll container. */
    maxHeight: { type: String, default: undefined },
    /** Stacked responsive mode opt-in. Same shape as `<VCTable :responsive>`. */
    responsive: { type: Boolean, default: false },
    /** Density shorthand for `themeVariant.density`. */
    density: { type: String as PropType<'compact' | 'normal' | 'spacious'>, default: undefined },
    /** Alternating row backgrounds — shorthand for `themeVariant.striped`. */
    striped: { type: Boolean, default: undefined },
    /** Cell borders — shorthand for `themeVariant.bordered`. */
    bordered: { type: Boolean, default: undefined },
    /** Row hover highlight — shorthand for `themeVariant.hover`. */
    hover: { type: Boolean, default: undefined },
    /** HTML tag to render. */
    tag: { type: String, default: 'table' },
    ...themableProps<TableThemeClasses>(),
};

export type TableLiteProps = ExtractPublicPropTypes<typeof tableLiteProps>;

const NOOP_SORT_STATE = ref(null);

// Lite-shared, perma-disabled selection mode + value refs. Module-level
// singletons are safe here because the values are intentionally
// read-only at the context contract level (selection is a no-op in
// Lite). Sharing avoids allocating one ref pair per VCTableLite mount.
const NOOP_SELECTION_MODE = computed<undefined>(() => undefined);
const NOOP_SELECTION_VALUE = computed<null>(() => null);

export default defineComponent({
    name: 'VCTableLite',
    inheritAttrs: false,
    props: tableLiteProps,
    slots: Object as SlotsType<{
        default(props: TableSlotProps): unknown;
        caption(): unknown;
        colgroup(): unknown;
    }>,
    setup(props, { attrs, slots }) {
        const themeProps = useThemeProps(
            props,
            'density',
            'striped',
            'bordered',
            'hover',
            'stickyHeader',
        );
        const theme = useComponentTheme('table', themeProps, tableLiteThemeDefaults);

        const dataRef = toRef(props, 'data');
        const rawColumns = toRef(props, 'columns');
        const columns = computed<TableColumn<unknown>[]>(
            () => normalizeColumns(rawColumns.value, dataRef.value),
        );

        // Same headcell-count provider as `<VCTable>` so Shape B
        // (`<VCTableHeader>` written manually) keeps auto-resolving
        // colspan for `<VCTableEmpty>` / `<VCTableLoading>`.
        const childCellCount = ref(0);
        provideHeadCellCountContext({
            register: () => { childCellCount.value += 1; },
            unregister: () => { childCellCount.value = Math.max(0, childCellCount.value - 1); },
        });
        const colspan = computed(() => {
            if (columns.value.length > 0) return columns.value.length;
            return Math.max(1, childCellCount.value);
        });
        watch(
            () => columns.value.length > 0,
            (hasColumns) => {
                if (hasColumns) childCellCount.value = 0;
            },
        );

        const wrapperEl = ref<globalThis.HTMLElement | null>(null);

        // Build a no-op selection machine. With mode permanently
        // undefined, `isSelected: () => false` and `toggle` is a
        // no-op — child rows behave as if the consumer hadn't opted
        // in to selection.
        const liteSelection = useRowSelectionMachine({
            mode: NOOP_SELECTION_MODE,
            value: NOOP_SELECTION_VALUE,
            emit: () => {},
            keyAt: () => undefined,
        });
        const liteGetRowKey = (row: unknown, index: number): RowSelectionKey => {
            if (row && typeof row === 'object') {
                const { id } = (row as { id?: unknown });
                if (typeof id === 'string' || typeof id === 'number') return id;
            }
            return index;
        };

        // No-op sort + row-click hooks. `<VCTableHeadCell :sortable>`
        // and `<VCTableRow>` read these from context; with rowClickable
        // permanently false and `sort` permanently null, the
        // descendants visually behave as if the consumer hadn't opted
        // in to either feature.
        provideTableContext({
            data: dataRef,
            busy: toRef(props, 'busy'),
            columns,
            sort: NOOP_SORT_STATE,
            setSort: () => {},
            rowClickable: computed(() => false),
            focusedRow: ref(null),
            setFocusedRow: () => {},
            colspan,
            emitRowClick: () => {},
            wrapperEl,
            selection: liteSelection,
            getRowKey: liteGetRowKey,
        });

        const slotProps = computed<TableSlotProps>(() => ({
            data: dataRef.value as unknown[],
            busy: props.busy,
            columns: columns.value,
            sort: null,
            setSort: () => {},
        }));

        const setWrapperRef = (el: unknown) => {
            wrapperEl.value = (el as globalThis.HTMLElement | null) ?? null;
        };

        return () => {
            const inner = composeTableInner({
                cols: columns.value,
                slotChildren: slots.default?.(slotProps.value),
                captionSlot: slots.caption,
                colgroupSlot: slots.colgroup,
            });

            const tableNode = h(
                props.tag,
                mergeProps(attrs, {
                    class: theme.value.root || undefined,
                    'aria-busy': props.busy ? 'true' : undefined,
                    'data-responsive': props.responsive ? 'true' : undefined,
                }),
                inner as never,
            );

            const wrapper = h(
                'div',
                {
                    ref: setWrapperRef,
                    class: 'vc-table-wrapper',
                    style: { position: 'relative' },
                },
                [tableNode],
            );

            if (!props.scrollable) return wrapper;

            return h(
                'div',
                {
                    class: theme.value.scrollContainer || undefined,
                    style: props.maxHeight ?
                        { maxHeight: props.maxHeight, overflow: 'auto' } :
                        { overflow: 'auto' },
                },
                [wrapper],
            );
        };
    },
});
</script>
