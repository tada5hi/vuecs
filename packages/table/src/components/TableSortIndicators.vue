<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import {
    themableProps,
    useComponentDefaults,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { useTable } from '../composables/context';
import type {
    SortDescriptor,
    TableColumn,
    TableSortIndicatorsThemeClasses,
    TableSortState,
} from '../types';
import type {} from '../defaults';

const tableSortIndicatorsThemeDefaults = {
    classes: {
        root: 'vc-table-sort-indicators',
        label: 'vc-table-sort-indicators-label',
        empty: 'vc-table-sort-indicators-empty',
        chip: 'vc-table-sort-indicators-chip',
        chipPosition: 'vc-table-sort-indicators-chip-position',
        chipLabel: 'vc-table-sort-indicators-chip-label',
        chipArrow: 'vc-table-sort-indicators-chip-arrow',
        chipRemove: 'vc-table-sort-indicators-chip-remove',
        add: 'vc-table-sort-indicators-add',
        clear: 'vc-table-sort-indicators-clear',
    },
};

const behavioralDefaults = {
    label: 'Sort:',
    emptyContent: 'no columns sorted yet',
    addLabel: '+ Add column',
    clearLabel: 'Clear all',
    removeAriaLabel: 'Remove sort key',
    toggleAscTitle: 'Click to toggle descending',
    toggleDescTitle: 'Click to toggle ascending',
    arrowAsc: '↑',
    arrowDesc: '↓',
    removeGlyph: '×',
};

const tableSortIndicatorsProps = {
    /**
     * Sort state to render. Use `v-model:sort` for two-way binding.
     * When omitted, the component falls back to `useTable()` context
     * (i.e. when used inside a `<VCTable>` slot) — note that with the
     * default `<table>` rendering, slot children render INSIDE the
     * `<table>`, so the v-model path is the recommended placement
     * for chip rows above / below the table.
     */
    sort: { type: Array as PropType<TableSortState>, default: undefined },
    /**
     * Columns the sort can reference. Required when using v-model
     * mode (to look up labels + filter the add-column dropdown).
     * Falls back to `useTable()` context when omitted.
     */
    columns: { type: Array as PropType<TableColumn[]>, default: undefined },
    /** Override the leading label text. Falls back to global defaults. */
    label: { type: String, default: undefined },
    /** Override the empty-state copy. Falls back to global defaults. */
    emptyContent: { type: String, default: undefined },
    /** Override the add-column trigger text. Falls back to global defaults. */
    addLabel: { type: String, default: undefined },
    /** Override the clear-all trigger text. Falls back to global defaults. */
    clearLabel: { type: String, default: undefined },
    /** Override the aria-label applied to per-chip remove buttons. */
    removeAriaLabel: { type: String, default: undefined },
    /** Hide the add-column dropdown (consumer brings their own affordance). */
    hideAdd: { type: Boolean, default: false },
    /** Hide the clear-all button. */
    hideClear: { type: Boolean, default: false },
    ...themableProps<TableSortIndicatorsThemeClasses>(),
};

export type TableSortIndicatorsProps = ExtractPublicPropTypes<typeof tableSortIndicatorsProps>;

export type TableSortIndicatorsChipSlotProps = {
    descriptor: SortDescriptor;
    /** 0-based index in the sort array. */
    index: number;
    /** 1-based position (`index + 1`). */
    position: number;
    column: TableColumn | undefined;
    /** Toggle this descriptor's direction (asc ↔ desc). */
    toggle: () => void;
    /** Remove this descriptor from the sort. */
    remove: () => void;
};

export type TableSortIndicatorsAddSlotProps = {
    /** Columns that are `:sortable` but not currently in the sort array. */
    options: TableColumn[];
    /** Append a column to the sort with `asc` direction. */
    add: (key: string) => void;
};

export type TableSortIndicatorsClearSlotProps = {
    /** Clear the entire sort. */
    clear: () => void;
};

/**
 * Discoverable, modifier-key-free alternative to Shift-click for
 * managing multi-column sort state. Renders a chip per active
 * `SortDescriptor`, an add-column dropdown for unsorted sortable
 * columns, and a clear-all action.
 *
 * Two wiring modes:
 *
 * 1. **v-model (recommended)** — pass `:sort` + `:columns` and bind
 *    `v-model:sort`. Place the chip row anywhere (above or below
 *    the table). This is the only mode that supports the natural
 *    "chip row above table" layout because `<VCTable>`'s default
 *    slot children render inside `<table>` and a `<div>` there is
 *    invalid HTML.
 *
 *    ```vue
 *    <VCTableSortIndicators v-model:sort="sort" :columns="columns" />
 *    <VCTable v-model:sort="sort" :columns :data ... />
 *    ```
 *
 * 2. **Context fallback** — mount inside a `<VCTable>` and omit
 *    `:sort` / `:columns`. The component reads from `useTable()`
 *    and calls `setSortState`. Only safe in custom layouts where
 *    a `<div>` is legal at the mount point.
 *
 * Slot customization:
 * - `default` — replace the whole layout (slot props include all
 *   chip handlers + add + clear)
 * - `#label` — replace the leading "Sort:" label
 * - `#empty` — replace the empty-state hint
 * - `#chip="{ descriptor, index, position, toggle, remove }"` —
 *   replace per-chip rendering
 * - `#add="{ options, add }"` — replace the add-column trigger
 * - `#clear="{ clear }"` — replace the clear-all trigger
 *
 * Text strings flow through `useComponentDefaults('tableSortIndicators', …)`
 * so consumers can localize via
 * `app.use(vuecs, { defaults: { tableSortIndicators: { … } } })`.
 */
export default defineComponent({
    name: 'VCTableSortIndicators',
    inheritAttrs: false,
    props: tableSortIndicatorsProps,
    emits: ['update:sort'] as ['update:sort'],
    slots: Object as SlotsType<{
        default(props: {
            sort: SortDescriptor[];
            chips: TableSortIndicatorsChipSlotProps[];
            add: TableSortIndicatorsAddSlotProps;
            clear: TableSortIndicatorsClearSlotProps;
        }): unknown;
        label(): unknown;
        empty(): unknown;
        chip(props: TableSortIndicatorsChipSlotProps): unknown;
        add(props: TableSortIndicatorsAddSlotProps): unknown;
        clear(props: TableSortIndicatorsClearSlotProps): unknown;
    }>,
    setup(props, {
        attrs, 
        emit, 
        slots, 
    }) {
        const ctx = useTable();
        const defaults = useComponentDefaults('tableSortIndicators', props, behavioralDefaults);
        const theme = useComponentTheme(
            'tableSortIndicators',
            useThemeProps(props),
            tableSortIndicatorsThemeDefaults,
        );

        // Resolved sources. The explicit `:sort` / `:columns` props
        // win over the context — this lets the chip row be placed
        // outside the `<VCTable>` (the recommended path) while
        // still working as a compound child in custom layouts.
        const resolvedSort = computed<TableSortState>(() => {
            if (props.sort !== undefined) return props.sort;
            return (ctx?.sort.value ?? []) as TableSortState;
        });
        const resolvedColumns = computed<TableColumn[]>(() => {
            if (props.columns !== undefined) return props.columns;
            return (ctx?.columns.value ?? []) as TableColumn[];
        });

        function commitSort(next: TableSortState): void {
            // Always emit so v-model consumers see the change. When
            // sharing context with a `<VCTable>` (sort prop unset),
            // also push into the table's machine state.
            emit('update:sort', next);
            if (props.sort === undefined && ctx) ctx.setSortState(next);
        }

        const columnByKey = computed(() => {
            const map = new Map<string, TableColumn>();
            for (const col of resolvedColumns.value) map.set(col.key, col);
            return map;
        });

        const unsortedSortable = computed<TableColumn[]>(() => {
            const inSort = new Set(resolvedSort.value.map((s) => s.key));
            return resolvedColumns.value.filter((c) => c.sortable && !inSort.has(c.key));
        });

        function toggleDirection(key: string) {
            commitSort(resolvedSort.value.map((s) => (s.key === key ?
                { ...s, direction: s.direction === 'asc' ? 'desc' : 'asc' as const } :
                s)));
        }

        function removeKey(key: string) {
            commitSort(resolvedSort.value.filter((s) => s.key !== key));
        }

        function appendKey(key: string) {
            if (!key) return;
            commitSort([...resolvedSort.value, { key, direction: 'asc' }]);
        }

        function clearAll() {
            commitSort([]);
        }

        const chipSlotProps = computed<TableSortIndicatorsChipSlotProps[]>(() => resolvedSort.value
            .map((descriptor, index) => ({
                descriptor,
                index,
                position: index + 1,
                column: columnByKey.value.get(descriptor.key),
                toggle: () => toggleDirection(descriptor.key),
                remove: () => removeKey(descriptor.key),
            })));

        return () => {
            // Render nothing when we have neither v-model state nor a
            // table context — there's no useful interaction to expose.
            if (props.sort === undefined && !ctx) return null;

            const sortState = resolvedSort.value;
            const t = theme.value;
            const d = defaults.value;

            const addSlotProps: TableSortIndicatorsAddSlotProps = {
                options: unsortedSortable.value,
                add: appendKey,
            };
            const clearSlotProps: TableSortIndicatorsClearSlotProps = { clear: clearAll };

            const renderChip = (chip: TableSortIndicatorsChipSlotProps) => {
                if (slots.chip) return slots.chip(chip);
                const isAsc = chip.descriptor.direction === 'asc';
                return h('button', {
                    key: chip.descriptor.key,
                    type: 'button',
                    class: t.chip || undefined,
                    title: isAsc ? d.toggleAscTitle : d.toggleDescTitle,
                    'data-sort-key': chip.descriptor.key,
                    'data-direction': chip.descriptor.direction,
                    onClick: chip.toggle,
                }, [
                    h('span', { class: t.chipPosition || undefined }, `${chip.position}.`),
                    h('span', { class: t.chipLabel || undefined }, chip.column?.label ?? chip.descriptor.key),
                    h('span', { class: t.chipArrow || undefined }, isAsc ? d.arrowAsc : d.arrowDesc),
                    h('span', {
                        class: t.chipRemove || undefined,
                        role: 'button',
                        tabindex: 0,
                        'aria-label': d.removeAriaLabel,
                        onClick: (e: Event) => {
                            e.stopPropagation();
                            chip.remove();
                        },
                        onKeydown: (e: globalThis.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                chip.remove();
                            }
                        },
                    }, d.removeGlyph),
                ]);
            };

            const renderLabel = () => (slots.label ? slots.label() : h(
                'span',
                { class: t.label || undefined },
                d.label,
            ));

            const renderEmpty = () => (slots.empty ? slots.empty() : h(
                'span',
                { class: t.empty || undefined },
                d.emptyContent,
            ));

            const renderAdd = () => {
                if (props.hideAdd || addSlotProps.options.length === 0) return null;
                if (slots.add) return slots.add(addSlotProps);
                return h('select', {
                    class: t.add || undefined,
                    'aria-label': d.addLabel,
                    onChange: (e: Event) => {
                        const target = e.target as globalThis.HTMLSelectElement;
                        appendKey(target.value);
                        target.value = '';
                    },
                }, [
                    h('option', { value: '' }, d.addLabel),
                    ...addSlotProps.options.map((col) => h(
                        'option',
                        { key: col.key, value: col.key },
                        col.label ?? col.key,
                    )),
                ]);
            };

            const renderClear = () => {
                if (props.hideClear || sortState.length === 0) return null;
                if (slots.clear) return slots.clear(clearSlotProps);
                return h('button', {
                    type: 'button',
                    class: t.clear || undefined,
                    onClick: clearAll,
                }, d.clearLabel);
            };

            if (slots.default) {
                return h(
                    'div',
                    mergeProps(attrs, { class: t.root || undefined }),
                    slots.default({
                        sort: sortState,
                        chips: chipSlotProps.value,
                        add: addSlotProps,
                        clear: clearSlotProps,
                    }) as never,
                );
            }

            const chipsContent = sortState.length === 0 ?
                [renderEmpty()] :
                chipSlotProps.value.map(renderChip);

            return h(
                'div',
                mergeProps(attrs, {
                    class: t.root || undefined,
                    role: 'toolbar',
                    'aria-label': 'Active sort columns',
                }),
                ([
                    renderLabel(),
                    ...chipsContent,
                    renderAdd(),
                    renderClear(),
                ]) as never,
            );
        };
    },
});
</script>
