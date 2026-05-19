import { describe, expect, it } from 'vitest';
import { computed, ref } from 'vue';
import { useSelectionMachine } from '../../../src';
import type { SelectionKey, SelectionMode, SelectionValue } from '../../../src';

type Mode = SelectionMode;

function makeArgs(initial: SelectionValue<Mode> | null, mode: Mode | undefined, keys: SelectionKey[]) {
    const v = ref<SelectionValue<Mode> | null>(initial);
    const args = {
        mode: computed<Mode | undefined>(() => mode),
        value: computed(() => v.value),
        emit: (next: SelectionValue<Mode> | null) => { v.value = next; },
        keyAt: (i: number): SelectionKey | undefined => keys[i],
    };
    return { args, v };
}

describe('useSelectionMachine', () => {
    it('single mode — toggle replaces value; second toggle clears', () => {
        const { args, v } = makeArgs(null, 'single', ['a', 'b']);
        const m = useSelectionMachine(args);
        m.toggle('a');
        expect(v.value).toBe('a');
        m.toggle('a');
        expect(v.value).toBeNull();
        m.toggle('b');
        expect(v.value).toBe('b');
    });

    it('multi mode — plain toggle adds/removes membership; range select fills inclusive span', () => {
        const { args, v } = makeArgs([], 'multi', ['a', 'b', 'c', 'd']);
        const m = useSelectionMachine(args);
        m.toggle('a');                       // [a]
        expect(v.value).toEqual(['a']);
        m.toggle('c', { range: true });      // Shift from anchor a -> c
        expect(v.value).toEqual(['a', 'b', 'c']);
        m.toggle('b');                       // plain → remove
        expect(v.value).toEqual(['a', 'c']);
    });

    it('multi mode — Shift+click with no anchor degrades to plain toggle', () => {
        const { args, v } = makeArgs([], 'multi', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        // No prior plain click — rangeAnchor is null. Shift+click
        // falls through to plain toggle semantics.
        m.toggle('b', { range: true });
        expect(v.value).toEqual(['b']);
        // After the fall-through, anchor is set so the next Shift+click works.
        m.toggle('a');
        m.toggle('c', { range: true });
        expect(v.value).toEqual(['b', 'a', 'c']);
    });

    it('multi mode — Ctrl/Cmd+click toggles single membership without affecting others', () => {
        const { args, v } = makeArgs(['a', 'b'], 'multi', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        m.toggle('c', { toggle: true });
        expect(v.value).toEqual(['a', 'b', 'c']);
        m.toggle('a', { toggle: true });
        expect(v.value).toEqual(['b', 'c']);
    });

    it('isSelected reflects mode-aware membership', () => {
        const { args } = makeArgs(['a', 'b'], 'multi', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        expect(m.isSelected('a')).toBe(true);
        expect(m.isSelected('c')).toBe(false);
        expect(m.isSelected(undefined)).toBe(false);
    });

    it('setValue replaces the whole selection directly (bypasses cycle/toggle/range)', () => {
        const { args, v } = makeArgs([], 'multi', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        m.setValue(['a', 'c']);
        expect(v.value).toEqual(['a', 'c']);
        m.setValue([]);
        expect(v.value).toEqual([]);
        // rangeAnchor is cleared on empty reset so the next Shift+click
        // starts a fresh range rather than picking up the stale anchor.
        expect(m.rangeAnchor.value).toBeNull();
    });

    it('setValue updates the range anchor to the last selected key', () => {
        const { args } = makeArgs([], 'multi', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        m.setValue(['a', 'b']);
        expect(m.rangeAnchor.value).toBe('b');
    });

    it('mode === undefined makes toggle a no-op', () => {
        const { args, v } = makeArgs(null, undefined, ['a']);
        const m = useSelectionMachine(args);
        m.toggle('a');
        expect(v.value).toBeNull();
    });

    it('setValue normalizes cross-mode misuse — single + array writes the last element', () => {
        const { args, v } = makeArgs(null, 'single', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        m.setValue(['a', 'b', 'c'] as never);
        expect(v.value).toBe('c');
        m.setValue([] as never);
        expect(v.value).toBeNull();
    });

    it('setValue normalizes cross-mode misuse — multi + bare key wraps as a one-element array', () => {
        const { args, v } = makeArgs([], 'multi', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        m.setValue('a' as never);
        expect(v.value).toEqual(['a']);
    });

    it('setValue is a no-op when selection is disabled (mode === undefined)', () => {
        const { args, v } = makeArgs(null, undefined, ['a']);
        const m = useSelectionMachine(args);
        m.setValue(['a'] as never);
        expect(v.value).toBeNull();
    });

    it('range select with a stale anchor (key no longer in data) refreshes the anchor + no-ops', () => {
        const { args, v } = makeArgs([], 'multi', ['a', 'b', 'c']);
        const m = useSelectionMachine(args);
        m.toggle('a');                   // anchor = 'a'
        // Simulate row 'a' being removed from data
        args.keyAt = (i: number) => (['b', 'c'][i]);
        m.toggle('c', { range: true });
        // No-op — Shift+click can't compute a span without a valid anchor.
        expect(v.value).toEqual(['a']);
        expect(m.rangeAnchor.value).toBe('c');
    });
});
