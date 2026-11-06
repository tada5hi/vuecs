import type {
    SelectionKey,
    SelectionMode,
    SelectionState,
    SelectionValue,
    UseSelectionMachineArgs,
} from './types';
import { ref } from 'vue';
import type { Ref } from 'vue';

export function useSelectionMachine(args: UseSelectionMachineArgs): SelectionState {
    const rangeAnchor: Ref<SelectionKey | null> = ref(null);

    const isSelected = (key: SelectionKey | undefined): boolean => {
        if (key === undefined) {
            return false;
        }

        const v = args.value.value;
        const m = args.mode.value;

        if (m === 'multi') {
            return Array.isArray(v) && v.includes(key);
        }

        if (m === 'single') {
            return v === key;
        }

        return false;
    };

    const toggle = (
        key: SelectionKey,
        opts: { range?: boolean; toggle?: boolean } = {},
    ): void => {
        const m = args.mode.value;

        if (m === undefined) {
            return;
        }

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

                if (k !== undefined) {
                    span.push(k);
                }
            }

            const set = new Set<SelectionKey>(current);

            for (const k of span) {
                set.add(k);
            }

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
        const m = args.mode.value;

        // Selection disabled (mode === undefined) means "cannot be
        // mutated" — match `toggle()`'s no-op behavior.
        if (m === undefined) {
            return;
        }

        // Normalize cross-mode misuse at the boundary. The
        // `SelectionValue` type union accepts both array and bare-key
        // shapes regardless of mode, so a `single`-mode caller can
        // technically pass `['a','b']` (and a `multi` caller can pass
        // `'a'`). Coerce so the v-model writeback always matches the
        // mode's expected shape:
        //   single + array → take last element (or null if empty)
        //   multi  + key   → wrap as one-element array
        let normalized: SelectionValue<SelectionMode> | null = next;

        if (m === 'single' && Array.isArray(next)) {
            normalized = next.length > 0 ? next[next.length - 1] : null;
        } else if (m === 'multi' && next !== null && !Array.isArray(next)) {
            normalized = [next];
        }

        args.emit(normalized);

        // Re-anchor on the last key — for `null` / `[]` reset, clear
        // the anchor so the next Shift+click starts a fresh range.
        if (normalized === null || (Array.isArray(normalized) && normalized.length === 0)) {
            rangeAnchor.value = null;

            return;
        }

        rangeAnchor.value = Array.isArray(normalized) ? normalized[normalized.length - 1] : normalized;
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

        if (k === undefined) {
            return -1;
        }

        if (k === target) {
            return i;
        }
    }

    return -1;
}
