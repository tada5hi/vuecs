import { ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

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
     * Focus coordination for roving-tabindex. Stores the index of the
     * focused row within the selectable subset; consumers map index
     * back to row via the list iteration order.
     */
    focusedIndex: Ref<number>;
    moveFocus(target: number | 'next' | 'prev' | 'home' | 'end', selectableCount: number): void;
    /**
     * Range anchor — set on plain click, used by Shift+click / Shift+arrow
     * to compute the selection span. Reset when the user clicks/toggles
     * without Shift.
     */
    rangeAnchor: Ref<SelectionKey | null>;
};

/**
 * Build the selection state machine for `<VCList>`. The composable owns
 * the toggle / range-select / focus-roving logic; `<VCListItem>` reads
 * `isSelected(key)` to render `aria-selected` + theme variants, and calls
 * `toggle(key, opts)` on activation.
 *
 * `<VCList>` is the v-model boundary — it reads `props.selection` /
 * emits `update:selection`. This composable is given the reactive view
 * via the `value` ref + `emit` callback so it can stay decoupled from
 * `defineComponent`'s emit machinery.
 */
export function useSelectionMachine(args: {
    mode: ComputedRef<SelectionMode | undefined>;
    /** Reactive view onto v-model:selection. Read via `.value`. */
    value: ComputedRef<SelectionValue<SelectionMode> | null>;
    /** Emit a new selection value via `update:selection`. */
    emit: (next: SelectionValue<SelectionMode> | null) => void;
    /**
     * Resolve a selection key by index (used by range select).
     * Returns the key at the given position in the iteration order,
     * or undefined when out of range.
     */
    keyAt: (index: number) => SelectionKey | undefined;
}): SelectionState {
    const focusedIndex = ref(0);
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
            if (anchorIdx >= 0 && targetIdx >= 0) {
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

    const moveFocus = (
        target: number | 'next' | 'prev' | 'home' | 'end',
        selectableCount: number,
    ): void => {
        if (selectableCount <= 0) return;
        const cur = focusedIndex.value;
        let next: number;
        if (typeof target === 'number') next = target;
        else if (target === 'home') next = 0;
        else if (target === 'end') next = selectableCount - 1;
        else if (target === 'next') next = Math.min(cur + 1, selectableCount - 1);
        else next = Math.max(cur - 1, 0);
        focusedIndex.value = Math.max(0, Math.min(next, selectableCount - 1));
    };

    return {
        mode: args.mode,
        value: args.value,
        isSelected,
        toggle,
        focusedIndex,
        moveFocus,
        rangeAnchor,
    };
}

function indexOfKey(
    keyAt: (index: number) => SelectionKey | undefined,
    target: SelectionKey,
): number {
    for (let i = 0; i < 10_000; i += 1) {
        const k = keyAt(i);
        if (k === undefined) return -1;
        if (k === target) return i;
    }
    return -1;
}

