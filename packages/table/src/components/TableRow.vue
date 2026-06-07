<script lang="ts">
import {
    Fragment,
    computed,
    defineComponent,
    h,
    mergeProps,
    nextTick,
    onBeforeUnmount,
    ref,
    toRef,
    useId,
    watch,
} from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { Presence } from 'reka-ui';
import {
    isObject,
    themableProps,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import {
    provideTableRowContext,
    useTable,
} from '../composables/context';
import type { TableRowExpansionState } from '../composables/context';
import type { RowSelectionKey } from '../composables/selection';
import type {
    TableExpandableTrigger,
    TableExpansionSlotProps,
    TableRowThemeClasses,
} from '../types';
import { filterRowClickEvent } from '../utils/render-utils';
import { tableExpandTriggerCellThemeDefaults } from '../theme';
import VCTableExpandTrigger from './TableExpandTrigger.vue';
import VCTableRowExpansion from './TableRowExpansion.vue';

const tableRowThemeDefaults = { classes: { root: 'vc-table-row' } };

const tableRowProps = {
    /** Current row data — used to resolve `_rowVariant` / `_cellVariants` and to emit `@row-click`. */
    row: { type: null as unknown as PropType<unknown>, default: undefined },
    /** Row index — used by row keyboard navigation + focused-row tracking. */
    index: { type: Number, default: undefined },
    /** Mark the row disabled — forwarded to `themeVariant.disabled`. */
    disabled: { type: Boolean, default: undefined },
    /**
     * Manual override for the row's selected state. When set, wins over
     * the auto-resolved selection from `useTable().selection`. Leave
     * undefined to let `<VCTable :selection>` drive selection state.
     */
    selected: { type: Boolean, default: undefined },
    /**
     * Render this row as expandable (plan 038). When set, the row's
     * slot contract gains the `#expansion` scoped slot, and the row
     * mounts as a Vue Fragment of TWO `<tr>` elements when expanded
     * (the data row + the expansion row).
     *
     * **Important:** consumer-supplied attributes (including `:class`,
     * `:style`, and DOM event listeners) on `<VCTableRow expandable>`
     * apply to the DATA row only — the expansion `<tr>` is implicit
     * and not directly addressable. Style the expansion via the
     * `tableRowExpansion` theme key instead.
     *
     * State resolution priority:
     *   1. `:open` prop is set → fully controlled (emit `update:open`,
     *      no table-level interaction)
     *   2. Parent `<VCTable :expandable>` provides an expansion
     *      machine → table-level state via `v-model:expanded`
     *   3. Else → internal state, seeded from `row._expanded`
     */
    expandable: { type: Boolean, default: false },
    /**
     * Per-row controlled override of the expansion open state. When
     * set, the row detaches from any table-level `:expanded` and
     * emits `update:open` instead of `update:expanded`.
     */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /**
     * Where the auto-injected trigger column lives.
     * - `'leading'` (default) — prepended before all data cells.
     * - `'trailing'` — appended after the last data cell.
     * - `'none'` — no auto-injection; place `<VCTableExpandTrigger>`
     *   inside a data cell yourself.
     *
     * Inherits from `<VCTable :expandableTrigger>` when this prop is
     * undefined.
     */
    expandableTrigger: { type: String as PropType<TableExpandableTrigger>, default: undefined },
    ...themableProps<TableRowThemeClasses>(),
};

export type TableRowProps = ExtractPublicPropTypes<typeof tableRowProps>;

export default defineComponent({
    name: 'VCTableRow',
    inheritAttrs: false,
    props: tableRowProps,
    emits: ['update:open'],
    setup(props, {
        attrs,
        slots,
        emit,
    }) {
        const ctx = useTable();

        // Resolve row-meta variants from the row payload.
        const rowVariant = computed<string | null>(() => {
            if (!isObject(props.row)) return null;
            const v = (props.row as Record<string, unknown>)._rowVariant;
            return typeof v === 'string' ? v : null;
        });
        const cellVariants = computed<Record<string, string>>(() => {
            if (!isObject(props.row)) return {};
            const v = (props.row as Record<string, unknown>)._cellVariants;
            return isObject(v) ? (v as Record<string, string>) : {};
        });
        const focused = computed(() => {
            if (props.index === undefined) return false;
            return ctx?.focusedRow.value === props.index;
        });

        // Selection (plan 033 v1.x-A). When the parent table has a
        // selection mode set, derive `selected` from the selection
        // state. Manual `:selected` on the row wins for declarative
        // marking (the v0.1 escape hatch).
        const selectionKey = computed<RowSelectionKey>(() => {
            if (props.index === undefined) return -1;
            return ctx?.getRowKey(props.row, props.index) ?? props.index;
        });
        const selectionMode = computed(() => ctx?.selection.mode.value);
        const autoSelected = computed<boolean>(() => {
            if (props.selected !== undefined) return props.selected;
            // Short-circuit when this row has no index — the selection
            // key falls back to `-1`, which could phantom-match if a
            // consumer's selection array literally contains `-1`.
            if (props.index === undefined) return false;
            return ctx?.selection.isSelected(selectionKey.value) ?? false;
        });

        // Theme — fold row-meta variant + per-row flags into themeVariant
        const themeProps = useThemeProps(props, 'disabled');
        const mergedThemeProps = {
            get themeClass() { return themeProps.themeClass; },
            get themeVariant() {
                return {
                    ...(themeProps.themeVariant ?? {}),
                    ...(rowVariant.value ? { rowVariant: rowVariant.value } : {}),
                    focused: focused.value,
                    selected: autoSelected.value,
                };
            },
        };
        const theme = useComponentTheme('tableRow', mergedThemeProps, tableRowThemeDefaults);

        // ──────────────────────────────────────────────────────────────────
        // Expansion state (plan 038)
        //
        // Three-tier resolution:
        //   1. `:open` prop bound → fully controlled, emit `update:open`
        //   2. Table-level expansion machine + `:expandable` → controlled
        //      via the shared selection machine (one slot in the keyed
        //      set per expanded row)
        //   3. Else → internal `ref(false)`, seeded once from
        //      `row._expanded`
        // ──────────────────────────────────────────────────────────────────

        // Internal expansion state for the "no table-level machine, no
        // controlled `:open`" path. Seeded ONCE at setup from
        // `row._expanded` — but ONLY when the row will actually use
        // the internal path. When the table provides an expansion
        // machine, the table owns the seed (see `<VCTable>`'s
        // `trySeed`); a parallel row-level seed here would be wasted
        // and could mask bugs in the table-level path.
        const internalOpen = ref<boolean>(false);
        if (
            !ctx?.expansion &&
            props.open === undefined &&
            isObject(props.row)
        ) {
            const seed = (props.row as Record<string, unknown>)._expanded;
            if (seed === true) internalOpen.value = true;
        }

        const expansionMode = computed<'controlled' | 'table' | 'internal' | 'off'>(() => {
            if (!props.expandable) return 'off';
            if (props.open !== undefined) return 'controlled';
            // Table-level state requires a stable index (the table's
            // expansion machine resolves the key via `keyAt(index)`).
            // Manual rows without `:index` fall back to internal state
            // — they can still expand via `:open` controlled mode or
            // the `_expanded` row-meta seed.
            if (
                ctx?.expansion &&
                ctx.expandable.value &&
                props.index !== undefined
            ) return 'table';
            return 'internal';
        });

        const expansionOpen = computed<boolean>(() => {
            const mode = expansionMode.value;
            if (mode === 'off') return false;
            if (mode === 'controlled') return props.open === true;
            if (mode === 'table') {
                return ctx?.expansion?.isSelected(selectionKey.value) ?? false;
            }
            return internalOpen.value;
        });

        const toggleExpansion = () => {
            const mode = expansionMode.value;
            if (mode === 'off') return;
            if (mode === 'controlled') {
                emit('update:open', !(props.open === true));
                return;
            }
            if (mode === 'table') {
                ctx?.expansion?.toggle(selectionKey.value);
                return;
            }
            internalOpen.value = !internalOpen.value;
        };

        const triggerId = `vc-table-expand-trigger-${useId()}`;
        const panelId = `vc-table-expand-panel-${useId()}`;

        // Stable expansion state record per row. `expandable` is treated
        // as a static feature flag (toggling it at runtime isn't a
        // documented use case); the per-cycle reactivity lives in the
        // `open` ComputedRef<boolean> inside (ComputedRef satisfies
        // the Ref interface for read-only consumers, no cast needed).
        const expansionState: TableRowExpansionState | null = props.expandable ? {
            open: expansionOpen,
            toggle: toggleExpansion,
            triggerId,
            panelId,
        } : null;

        // Provide row context for child cells. Required for:
        //   - cellVariants resolution on `<VCTableCell>` (needs row data + index)
        //   - `<VCTableExpandTrigger>` to read expansion state
        //
        // When `:index` is missing but the row is expandable, we still
        // provide context so manual rows (Shape B with no index, e.g.
        // a controlled `<VCTableRow expandable :open>`) keep working.
        // Cell-variant resolution that depends on a real index will
        // see `-1` and skip — that's a documented limitation for
        // index-less manual rows.
        if (props.index !== undefined || expansionState !== null) {
            provideTableRowContext({
                row: toRef(props, 'row'),
                index: computed(() => props.index ?? -1) as unknown as import('vue').Ref<number>,
                rowVariant,
                cellVariants,
                focused,
                selectionKey,
                selected: autoSelected,
                expansion: expansionState,
            });
        }

        // Row interactivity gating. Selection mode enables row-level
        // keyboard nav even without `:row-clickable` (per the v1.x-A
        // ARIA grid pattern). The two opt-ins compose: a selectable
        // row IS focusable; a `:row-clickable` row also emits the
        // public `@row-click` event.
        const selectionActive = computed(() => selectionMode.value !== undefined);
        const isInteractive = computed(() => (
            (ctx?.rowClickable.value || selectionActive.value) &&
            props.index !== undefined &&
            !props.disabled
        ));

        // Register with the table's interactive-row registry so the
        // roving-tabindex fallback can pick the first INTERACTIVE row
        // (not just row 0, which might be disabled) and arrow nav can
        // skip non-interactive rows. Wired via `watch` (not
        // `watchEffect`) so the registry mutations don't recursively
        // re-trigger this effect — the watcher reads `isInteractive`
        // + `props.index` explicitly and only re-fires when those
        // values change.
        watch(
            [isInteractive, () => props.index],
            ([active, idx], [, prevIdx]) => {
                if (!ctx) return;
                // Unregister the previous index whenever it changes
                // (rare, but covers re-keyed rows).
                if (prevIdx !== undefined && prevIdx !== idx) {
                    ctx.unregisterInteractiveRow(prevIdx);
                }
                if (active && idx !== undefined) {
                    ctx.registerInteractiveRow(idx);
                } else if (idx !== undefined) {
                    ctx.unregisterInteractiveRow(idx);
                }
            },
            { immediate: true },
        );
        onBeforeUnmount(() => {
            if (ctx && props.index !== undefined) {
                ctx.unregisterInteractiveRow(props.index);
            }
        });

        // Roving tabindex when grid-mode is active: only the focused
        // row carries tabindex=0; others get -1, so Tab exits the grid
        // instead of cycling row-by-row (W3C grid pattern). Outside
        // selection mode, every clickable row stays tabindex=0 — the
        // v0.1 behavior.
        const tabindex = computed<number | undefined>(() => {
            if (!isInteractive.value) return undefined;
            if (!selectionActive.value) return 0;
            // Grid mode: roving tabindex. Fall back to the FIRST
            // interactive row (read from the registry) when
            // `focusedRow` is unset OR points at a row that is no
            // longer interactive (e.g. disabled now, or data shrunk
            // past it). Picking the first interactive row — not
            // blindly row 0 — keeps Tab navigation working when row 0
            // happens to be disabled.
            const focusIdx = ctx?.focusedRow.value;
            const interactives = ctx?.interactiveRows.value;
            const focusActive = focusIdx !== null &&
                focusIdx !== undefined &&
                interactives !== undefined &&
                interactives.has(focusIdx);
            if (focusActive) {
                return props.index === focusIdx ? 0 : -1;
            }
            if (!interactives || interactives.size === 0) return -1;
            let firstInteractive: number | null = null;
            for (const idx of interactives) {
                if (firstInteractive === null || idx < firstInteractive) firstInteractive = idx;
            }
            return props.index === firstInteractive ? 0 : -1;
        });

        function activateSelection(event: globalThis.MouseEvent | globalThis.KeyboardEvent) {
            if (!selectionActive.value || props.index === undefined) return;
            ctx?.selection.toggle(selectionKey.value, {
                range: event.shiftKey,
                toggle: event.metaKey || event.ctrlKey,
            });
            ctx?.setFocusedRow(props.index);
        }

        function onClick(event: globalThis.MouseEvent) {
            if (!isInteractive.value) return;
            const rowEl = event.currentTarget as globalThis.Element | null;
            if (filterRowClickEvent(event, rowEl)) return;
            if (props.index === undefined) return;
            ctx?.setFocusedRow(props.index);
            activateSelection(event);
            if (ctx?.rowClickable.value) {
                ctx?.emitRowClick(props.row, props.index, event);
            }
        }

        function onKeydown(event: globalThis.KeyboardEvent) {
            if (!isInteractive.value || props.index === undefined) return;
            // W3C grid pattern: when focus is on an interactive
            // descendant (e.g. the expansion trigger button), let the
            // descendant own activation keys. Without this guard,
            // pressing Enter on a focused `<VCTableExpandTrigger>` in
            // grid mode toggles BOTH expansion (button click) AND
            // row selection (this handler). Arrow / Home / End still
            // bubble — they're row-level navigation, not activation.
            if (
                (event.key === 'Enter' || event.key === ' ') &&
                event.target !== event.currentTarget
            ) {
                return;
            }
            const i = props.index;

            // Build a sorted snapshot of currently interactive row
            // indices. Arrow / Home / End walk THIS list rather than
            // the raw data range, so disabled rows are skipped instead
            // of becoming dead spots in keyboard navigation.
            const interactives = ctx?.interactiveRows.value;
            const sorted = interactives && interactives.size > 0 ?
                Array.from(interactives).sort((a, b) => a - b) :
                [];
            const posInSorted = sorted.indexOf(i);

            const moveTo = (target: number) => {
                event.preventDefault();
                if (sorted.length === 0) return;
                const clamped = Math.max(0, Math.min(sorted.length - 1, target));
                const nextIdx = sorted[clamped];
                ctx?.setFocusedRow(nextIdx);
                const tr = event.currentTarget as globalThis.HTMLElement | null;
                if (!tr) return;
                // Defer the DOM .focus() until after Vue re-renders
                // with the updated tabindex. The roving-tabindex
                // pattern only ever has ONE row carrying `tabindex="0"`
                // at a time; walking siblings before the re-render
                // would never find the new target (all other rows
                // still carry `tabindex="-1"`). After the tick, only
                // the new target row carries `tabindex="0"`, so the
                // walker latches on it cleanly and disabled rows
                // (carrying `tabindex="-1"`) are correctly skipped.
                nextTick(() => {
                    const direction = nextIdx > i ? 'nextElementSibling' : 'previousElementSibling';
                    let sibling: globalThis.Element | null = tr[direction];
                    while (sibling) {
                        if (
                            sibling instanceof globalThis.HTMLElement &&
                            sibling.tagName === 'TR' &&
                            sibling.getAttribute('tabindex') === '0'
                        ) {
                            sibling.focus();
                            break;
                        }
                        sibling = sibling[direction];
                    }
                });
                // Shift+arrow extends selection from the range anchor
                // to the new focused row (multi mode only). Seed the
                // anchor to the CURRENT row when none exists yet, so
                // the first Shift+arrow press includes the starting
                // row in the range.
                if (event.shiftKey && selectionActive.value && selectionMode.value === 'multi' && ctx) {
                    if (ctx.selection.rangeAnchor.value === null) {
                        const currentRow = ctx.data.value[i];
                        if (currentRow !== undefined) {
                            ctx.selection.rangeAnchor.value = ctx.getRowKey(currentRow, i);
                        }
                    }
                    const targetRow = ctx.data.value[nextIdx];
                    if (targetRow !== undefined) {
                        const targetKey = ctx.getRowKey(targetRow, nextIdx);
                        ctx.selection.toggle(targetKey, { range: true });
                    }
                }
            };

            if (event.key === 'ArrowDown') {
                moveTo(posInSorted + 1);
            } else if (event.key === 'ArrowUp') {
                moveTo(posInSorted - 1);
            } else if (event.key === 'Home') {
                moveTo(0);
            } else if (event.key === 'End') {
                moveTo(sorted.length - 1);
            } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateSelection(event);
                if (ctx?.rowClickable.value) {
                    ctx?.emitRowClick(props.row, i, event);
                }
            }
        }

        function onFocus() {
            if (!isInteractive.value || props.index === undefined) return;
            ctx?.setFocusedRow(props.index);
        }

        // Trigger-cell theme (separate theme key — see plan 038).
        // Resolved once at setup so the render fn doesn't re-resolve it.
        const triggerCellTheme = useComponentTheme(
            'tableExpandTriggerCell',
            {} as never,
            tableExpandTriggerCellThemeDefaults,
        );

        return () => {
            // Conditional ARIA spread — only paint role/aria-selected
            // when selection is active. Painting `role: undefined`
            // shadows consumer-provided attrs through mergeProps and
            // breaks the plain-table escape hatch for manual rows.
            const selectionAttrs: Record<string, unknown> = selectionActive.value ?
                {
                    role: 'row',
                    'aria-selected': autoSelected.value ? 'true' : 'false',
                } :
                {};

            const mode = expansionMode.value;
            const isExpandable = mode !== 'off';
            const open = expansionOpen.value;

            // Resolve effective trigger placement. Per-row prop wins
            // over table-level default; fallback to `'leading'`.
            const triggerPlacement: TableExpandableTrigger = props.expandableTrigger ??
                ctx?.expandableTrigger.value ??
                'leading';

            // Build the row's data cells. When `:expandable` is set and
            // the trigger isn't `'none'`, inject a leading/trailing
            // `<td>` containing the trigger button.
            const dataSlotChildren = slots.default?.() ?? [];
            const triggerCell = isExpandable && triggerPlacement !== 'none' ? h(
                'td',
                {
                    class: triggerCellTheme.value.root || undefined,
                    // Keep the trigger cell from being part of any
                    // sticky-column visual stack — it owns its own
                    // narrow layout.
                    'data-expand-trigger-cell': 'true',
                },
                [h(VCTableExpandTrigger)],
            ) : null;

            // Flatten the trigger cell into the data-slot children so
            // the `<td>` nodes are direct row children. Nesting an
            // array would force Vue to wrap the inner list in a
            // Fragment + extra comment vnodes inside the `<tr>`.
            // `dataSlotChildren` may itself be an array or a single
            // vnode — normalize before splicing.
            let cells: unknown;
            const dataChildren = Array.isArray(dataSlotChildren) ?
                dataSlotChildren :
                [dataSlotChildren];
            if (triggerCell === null) {
                cells = dataChildren;
            } else if (triggerPlacement === 'trailing') {
                cells = [...dataChildren, triggerCell];
            } else {
                cells = [triggerCell, ...dataChildren];
            }

            const dataRow = h(
                'tr',
                mergeProps(attrs, {
                    class: theme.value.root || undefined,
                    tabindex: tabindex.value,
                    'data-row-variant': rowVariant.value || undefined,
                    ...selectionAttrs,
                    onClick: isInteractive.value ? onClick : undefined,
                    onKeydown: isInteractive.value ? onKeydown : undefined,
                    onFocus: isInteractive.value ? onFocus : undefined,
                }),
                cells as never,
            );

            if (!isExpandable) return dataRow;

            // Expansion is on. Build the second `<tr>` and let Reka's
            // `Presence` handle the unmount-delay so close animations
            // play before the DOM disappears.
            const colspan = (ctx?.colspan.value ?? 1);
            const rowIndex = props.index;
            const rowData = props.row;

            const expansionRow = h(
                Presence,
                { present: open },
                {
                    default: () => h(
                        VCTableRowExpansion,
                        {
                            colspan,
                            panelId,
                            triggerId,
                            open,
                        },
                        {
                            default: () => slots.expansion?.({
                                row: rowData,
                                index: rowIndex as number,
                            } as TableExpansionSlotProps),
                        },
                    ),
                },
            );

            // Returning a Fragment vnode (rather than a bare array) so
            // Vue treats the two `<tr>` as siblings under `<tbody>`
            // without inserting an intermediate comment-vnode wrapper.
            // `inheritAttrs: false` (above) means consumer attrs land
            // on the DATA row only via `mergeProps(attrs, …)` — the
            // expansion row is implicit and doesn't take attrs.
            return h(Fragment, [dataRow, expansionRow]);
        };
    },
});
</script>
