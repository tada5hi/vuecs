import { ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

// `focusedIndex`/`moveFocus` were intentionally removed from the
// machine's public shape — focus state lives on `TableContext.focusedRow`
// (the single source of truth that VCTableRow's roving tabindex reads).
// Keeping a second focus model on the machine made the API misleading;
// the slim machine focuses purely on selection state.

/**
 * Selection state machine for `<VCTable>` (plan 033 v1.x-A).
 *
 * Near-identical shape to `@vuecs/list`'s `useSelectionMachine` — the
 * underlying state machinery is data-shape-agnostic (string|number keys,
 * `keyAt` mapper, mode-aware toggle / range / focus). Duplicated here
 * for v1.x-A to keep the PR scoped to `@vuecs/table`; a follow-up will
 * promote the shared composable into `@vuecs/core/utils/composables`
 * so both packages consume it from layer 0.
 */

export type RowSelectionMode = 'single' | 'multi';
export type RowSelectionKey = string | number;
export type RowSelectionValue<M extends RowSelectionMode | undefined> =    M extends 'multi' ? RowSelectionKey[] :
    M extends 'single' ? (RowSelectionKey | null) :
        null;

export type RowSelectionState = {
    mode: ComputedRef<RowSelectionMode | undefined>;
    value: ComputedRef<RowSelectionValue<RowSelectionMode> | null>;
    isSelected(key: RowSelectionKey | undefined): boolean;
    toggle(key: RowSelectionKey, opts?: { range?: boolean; toggle?: boolean }): void;
    /** Range anchor — set on plain click; used by Shift+click / Shift+arrow. */
    rangeAnchor: Ref<RowSelectionKey | null>;
};

export type UseRowSelectionMachineArgs = {
    mode: ComputedRef<RowSelectionMode | undefined>;
    value: ComputedRef<RowSelectionValue<RowSelectionMode> | null>;
    emit: (next: RowSelectionValue<RowSelectionMode> | null) => void;
    /** Resolve the selection key at a given row index (for range select). */
    keyAt: (index: number) => RowSelectionKey | undefined;
};

export function useRowSelectionMachine(args: UseRowSelectionMachineArgs): RowSelectionState {
    const rangeAnchor: Ref<RowSelectionKey | null> = ref(null);

    const isSelected = (key: RowSelectionKey | undefined): boolean => {
        if (key === undefined) return false;
        const v = args.value.value;
        const m = args.mode.value;
        if (m === 'multi') return Array.isArray(v) && v.includes(key);
        if (m === 'single') return v === key;
        return false;
    };

    const toggle = (
        key: RowSelectionKey,
        opts: { range?: boolean; toggle?: boolean } = {},
    ): void => {
        const m = args.mode.value;
        if (m === undefined) return;

        if (m === 'single') {
            args.emit(args.value.value === key ? null : key);
            rangeAnchor.value = key;
            return;
        }

        // m === 'multi'
        const current = (Array.isArray(args.value.value) ? args.value.value : []) as RowSelectionKey[];

        if (opts.range && rangeAnchor.value !== null) {
            const anchor = rangeAnchor.value;
            const anchorIdx = indexOfKey(args.keyAt, anchor);
            const targetIdx = indexOfKey(args.keyAt, key);
            if (anchorIdx < 0 || targetIdx < 0) {
                // Anchor row no longer in data — reset anchor + no-op
                // so the next Shift+click works, instead of silently
                // degrading to a single-row toggle.
                rangeAnchor.value = key;
                return;
            }
            const [from, to] = anchorIdx <= targetIdx ?
                [anchorIdx, targetIdx] :
                [targetIdx, anchorIdx];
            const span: RowSelectionKey[] = [];
            for (let i = from; i <= to; i += 1) {
                const k = args.keyAt(i);
                if (k !== undefined) span.push(k);
            }
            const set = new Set<RowSelectionKey>(current);
            for (const k of span) set.add(k);
            args.emit(Array.from(set));
            return;
        }

        if (opts.toggle) {
            // Ctrl/Cmd+click — toggle membership without affecting others.
            const idx = current.indexOf(key);
            const next = idx >= 0 ?
                [...current.slice(0, idx), ...current.slice(idx + 1)] :
                [...current, key];
            args.emit(next);
            rangeAnchor.value = key;
            return;
        }

        // Plain click — toggle membership.
        const idx = current.indexOf(key);
        const next = idx >= 0 ?
            [...current.slice(0, idx), ...current.slice(idx + 1)] :
            [...current, key];
        args.emit(next);
        rangeAnchor.value = key;
    };

    return {
        mode: args.mode,
        value: args.value,
        isSelected,
        toggle,
        rangeAnchor,
    };
}

/**
 * Defensive cap on `indexOfKey` iteration. The contract assumes
 * `keyAt(i)` eventually returns `undefined` past the end of the data
 * (the in-tree caller bounds by `data.length`), but a buggy custom
 * `keyAt` that always returns a value would otherwise spin forever.
 * One million rows is well past any realistic table size; consumers
 * hitting this limit are doing something pathological.
 */
const MAX_KEY_AT_ITERATIONS = 1_000_000;

function indexOfKey(
    keyAt: (index: number) => RowSelectionKey | undefined,
    target: RowSelectionKey,
): number {
    for (let i = 0; i < MAX_KEY_AT_ITERATIONS; i += 1) {
        const k = keyAt(i);
        if (k === undefined) return -1;
        if (k === target) return i;
    }
    return -1;
}
