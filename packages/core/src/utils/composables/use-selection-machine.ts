import { ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/**
 * Selection state machine — shared between `@vuecs/list` (ARIA
 * listbox pattern) and `@vuecs/table` (ARIA grid pattern). The
 * underlying state machinery is data-shape-agnostic: a `keyAt`
 * mapper resolves indices to keys (string | number), and the
 * v-model boundary is owned by the consumer (`emit` + a `value`
 * computed reading the v-model prop).
 *
 * The machine is **slim by design** — it tracks selection state
 * only, never focus. Focus management is the consumer's concern:
 * `<VCTable>` keeps `focusedRow` on its own context so the row's
 * roving-tabindex is a single source of truth; `<VCListItem>` can
 * apply the same pattern. Coupling focus to selection made the
 * shared API misleading.
 */

export type SelectionMode = 'single' | 'multi';
export type SelectionKey = string | number;
export type SelectionValue<M extends SelectionMode | undefined> =    M extends 'multi' ? SelectionKey[] :
    M extends 'single' ? (SelectionKey | null) :
        null;

export type SelectionState = {
    mode: ComputedRef<SelectionMode | undefined>;
    value: ComputedRef<SelectionValue<SelectionMode> | null>;
    isSelected(key: SelectionKey | undefined): boolean;
    toggle(key: SelectionKey, opts?: { range?: boolean; toggle?: boolean }): void;
    /**
     * Replace the entire selection value directly. Bypasses cycle /
     * range / toggle semantics — for callers that know exactly what
     * they want (e.g. a select-all header that clears or fills the
     * full set in one shot, or a "deselect everything" button).
     */
    setValue(next: SelectionValue<SelectionMode> | null): void;
    /**
     * Range anchor — set on plain click, used by Shift+click /
     * Shift+arrow to compute the selection span. Reset when the
     * user clicks/toggles without Shift.
     */
    rangeAnchor: Ref<SelectionKey | null>;
};

export type UseSelectionMachineArgs = {
    mode: ComputedRef<SelectionMode | undefined>;
    /** Reactive view onto v-model:selection. Read via `.value`. */
    value: ComputedRef<SelectionValue<SelectionMode> | null>;
    /** Emit a new selection value via the v-model update channel. */
    emit: (next: SelectionValue<SelectionMode> | null) => void;
    /**
     * Resolve a selection key by index (used by range select).
     * Returns the key at the given position in the iteration order,
     * or undefined when out of range.
     */
    keyAt: (index: number) => SelectionKey | undefined;
};

export function useSelectionMachine(args: UseSelectionMachineArgs): SelectionState {
    const rangeAnchor: Ref<SelectionKey | null> = ref(null);

    const isSelected = (key: SelectionKey | undefined): boolean => {
        if (key === undefined) return false;
        const v = args.value.value;
        const m = args.mode.value;
        if (m === 'multi') return Array.isArray(v) && v.includes(key);
        if (m === 'single') return v === key;
        return false;
    };

    const toggle = (
        key: SelectionKey,
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
        const current = (Array.isArray(args.value.value) ? args.value.value : []) as SelectionKey[];

        if (opts.range && rangeAnchor.value !== null) {
            // Range select — Shift+click. Find indices of anchor + target
            // and select the inclusive span. Don't toggle within the span;
            // contiguous additions are the documented behavior.
            const anchor = rangeAnchor.value;
            const anchorIdx = indexOfKey(args.keyAt, anchor);
            const targetIdx = indexOfKey(args.keyAt, key);
            if (anchorIdx < 0 || targetIdx < 0) {
                // Anchor key no longer in data (was removed). Refresh
                // the anchor to the current target so the next Shift+click
                // works, and no-op this one — falling through to plain
                // toggle would silently downgrade Shift+click into a
                // single-row toggle, which reads as a bug to the user.
                rangeAnchor.value = key;
                return;
            }
            const [from, to] = anchorIdx <= targetIdx ?
                [anchorIdx, targetIdx] :
                [targetIdx, anchorIdx];
            const span: SelectionKey[] = [];
            for (let i = from; i <= to; i += 1) {
                const k = args.keyAt(i);
                if (k !== undefined) span.push(k);
            }
            const set = new Set<SelectionKey>(current);
            for (const k of span) set.add(k);
            args.emit(Array.from(set));
            return;
        }

        if (opts.toggle) {
            // Ctrl/Cmd+click — toggle this one without affecting others.
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

    const setValue = (next: SelectionValue<SelectionMode> | null): void => {
        args.emit(next);
        // Re-anchor on the last key — for `null` / `[]` reset, clear
        // the anchor so the next Shift+click starts a fresh range.
        if (next === null || (Array.isArray(next) && next.length === 0)) {
            rangeAnchor.value = null;
            return;
        }
        rangeAnchor.value = Array.isArray(next) ? next[next.length - 1] : next;
    };

    return {
        mode: args.mode,
        value: args.value,
        isSelected,
        toggle,
        setValue,
        rangeAnchor,
    };
}

/**
 * Defensive cap on `indexOfKey` iteration. The contract assumes
 * `keyAt(i)` eventually returns `undefined` past the end of the data
 * (in-tree callers bound by `data.length`), but a buggy custom
 * `keyAt` that always returns a value would otherwise spin forever.
 * One million rows is well past any realistic list / table size;
 * consumers hitting this limit are doing something pathological.
 */
const MAX_KEY_AT_ITERATIONS = 1_000_000;

function indexOfKey(
    keyAt: (index: number) => SelectionKey | undefined,
    target: SelectionKey,
): number {
    for (let i = 0; i < MAX_KEY_AT_ITERATIONS; i += 1) {
        const k = keyAt(i);
        if (k === undefined) return -1;
        if (k === target) return i;
    }
    return -1;
}
