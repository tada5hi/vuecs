<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    mergeProps,
    toRef,
} from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    isObject,
    themableProps,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { provideTableRowContext, useTable } from '../composables/context';
import type { RowSelectionKey } from '../composables/selection';
import type { TableRowThemeClasses } from '../types';
import { filterRowClickEvent } from '../utils/render-utils';

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
    ...themableProps<TableRowThemeClasses>(),
};

export type TableRowProps = ExtractPublicPropTypes<typeof tableRowProps>;

export default defineComponent({
    name: 'VCTableRow',
    inheritAttrs: false,
    props: tableRowProps,
    setup(props, { attrs, slots }) {
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

        // Provide row context for child cells (needed for cellVariants resolution).
        if (props.index !== undefined) {
            provideTableRowContext({
                row: toRef(props, 'row'),
                index: toRef(props, 'index') as unknown as import('vue').Ref<number>,
                rowVariant,
                cellVariants,
                focused,
                selectionKey,
                selected: autoSelected,
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

        // Roving tabindex when grid-mode is active: only the focused
        // row carries tabindex=0; others get -1, so Tab exits the grid
        // instead of cycling row-by-row (W3C grid pattern). Outside
        // selection mode, every clickable row stays tabindex=0 — the
        // v0.1 behavior.
        const ariaSelected = computed<'true' | 'false' | undefined>(() => {
            if (!selectionActive.value) return undefined;
            return autoSelected.value ? 'true' : 'false';
        });

        const tabindex = computed<number | undefined>(() => {
            if (!isInteractive.value) return undefined;
            if (!selectionActive.value) return 0;
            // Grid mode: roving. Default first row when focusedRow is null.
            const focusIdx = ctx?.focusedRow.value;
            if (focusIdx === null || focusIdx === undefined) {
                return props.index === 0 ? 0 : -1;
            }
            return props.index === focusIdx ? 0 : -1;
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
            const total = ctx?.data.value.length ?? 0;
            const i = props.index;
            const move = (target: number) => {
                event.preventDefault();
                const clamped = Math.max(0, Math.min(total - 1, target));
                ctx?.setFocusedRow(clamped);
                const tr = event.currentTarget as globalThis.HTMLElement | null;
                if (!tr) return;
                const direction = clamped > i ? 'nextElementSibling' : 'previousElementSibling';
                let sibling: globalThis.Element | null = tr;
                const steps = Math.abs(clamped - i);
                for (let s = 0; s < steps; s += 1) {
                    sibling = sibling ? sibling[direction] : null;
                }
                if (sibling instanceof globalThis.HTMLElement) sibling.focus();
                // Shift+arrow extends selection from the range anchor
                // to the new focused row (multi mode only).
                if (event.shiftKey && selectionActive.value && selectionMode.value === 'multi') {
                    const targetRow = ctx?.data.value[clamped];
                    if (targetRow !== undefined) {
                        const targetKey = ctx?.getRowKey(targetRow, clamped);
                        if (targetKey !== undefined) {
                            ctx?.selection.toggle(targetKey, { range: true });
                        }
                    }
                }
            };
            if (event.key === 'ArrowDown') {
                move(i + 1);
            } else if (event.key === 'ArrowUp') {
                move(i - 1);
            } else if (event.key === 'Home') {
                move(0);
            } else if (event.key === 'End') {
                move(total - 1);
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

        return () => h(
            'tr',
            mergeProps(attrs, {
                class: theme.value.root || undefined,
                // ARIA grid pattern: explicit `role="row"` is required
                // on `<tr>` children when the parent table has
                // `role="grid"` (the implicit role doesn't apply
                // under an overridden parent role). Selection-mode
                // also drives `aria-selected`.
                role: selectionActive.value ? 'row' : undefined,
                'aria-selected': ariaSelected.value,
                tabindex: tabindex.value,
                'data-row-variant': rowVariant.value || undefined,
                onClick: isInteractive.value ? onClick : undefined,
                onKeydown: isInteractive.value ? onKeydown : undefined,
                onFocus: isInteractive.value ? onFocus : undefined,
            }),
            slots.default?.(),
        );
    },
});
</script>
