import {
    describe,
    expect,
    it,
} from 'vitest';
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useRowSelectionMachine } from '../../src/composables/selection';
import type {
    RowSelectionKey,
    RowSelectionMode,
    RowSelectionValue,
} from '../../src/composables/selection';

function makeMachine(opts: {
    mode?: RowSelectionMode;
    initialValue?: RowSelectionValue<RowSelectionMode> | null;
    keys?: RowSelectionKey[];
}) {
    const modeRef = ref<RowSelectionMode | undefined>(opts.mode);
    const valueRef = ref<RowSelectionValue<RowSelectionMode> | null>(opts.initialValue ?? null);
    const emitted: Array<RowSelectionValue<RowSelectionMode> | null> = [];
    const keys = opts.keys ?? [1, 2, 3, 4, 5];
    const machine = useRowSelectionMachine({
        mode: computed(() => modeRef.value) as ComputedRef<RowSelectionMode | undefined>,
        value: computed(() => valueRef.value) as ComputedRef<RowSelectionValue<RowSelectionMode> | null>,
        emit: (next) => {
            emitted.push(next);
            valueRef.value = next;
        },
        keyAt: (index) => keys[index],
    });
    return {
        machine,
        valueRef,
        emitted,
    };
}

describe('useRowSelectionMachine', () => {
    it('isSelected returns false when mode is undefined', () => {
        const { machine } = makeMachine({});
        expect(machine.isSelected(1)).toBe(false);
        expect(machine.isSelected(undefined)).toBe(false);
    });

    it('single mode: selecting one row, then another, replaces the value', () => {
        const { machine, emitted } = makeMachine({ mode: 'single' });
        machine.toggle(1);
        expect(emitted).toEqual([1]);
        expect(machine.isSelected(1)).toBe(true);
        machine.toggle(2);
        expect(emitted[emitted.length - 1]).toBe(2);
        expect(machine.isSelected(1)).toBe(false);
        expect(machine.isSelected(2)).toBe(true);
    });

    it('single mode: re-toggling the selected row clears it', () => {
        const { machine, emitted } = makeMachine({ mode: 'single' });
        machine.toggle(1);
        machine.toggle(1);
        expect(emitted[emitted.length - 1]).toBe(null);
        expect(machine.isSelected(1)).toBe(false);
    });

    it('multi mode: toggling adds and removes keys', () => {
        const { machine, valueRef } = makeMachine({ mode: 'multi', initialValue: [] });
        machine.toggle(1);
        expect(valueRef.value).toEqual([1]);
        machine.toggle(3);
        expect(valueRef.value).toEqual([1, 3]);
        machine.toggle(1);
        expect(valueRef.value).toEqual([3]);
    });

    it('multi mode: shift+click extends from rangeAnchor', () => {
        const { machine, valueRef } = makeMachine({ mode: 'multi', initialValue: [] });
        machine.toggle(2); // anchor = 2, value = [2]
        machine.toggle(4, { range: true }); // span 2..4 → [2,3,4]
        expect(valueRef.value).toEqual([2, 3, 4]);
    });

    it('multi mode: shift+click without an anchor stays a no-op range', () => {
        const { machine, valueRef } = makeMachine({ mode: 'multi', initialValue: [] });
        machine.toggle(3, { range: true });
        expect(valueRef.value).toEqual([3]);
    });

    it('multi mode: ctrl/cmd+click toggles a single key without affecting others', () => {
        const { machine, valueRef } = makeMachine({ mode: 'multi', initialValue: [1, 2, 3] });
        machine.toggle(2, { toggle: true });
        expect(valueRef.value).toEqual([1, 3]);
        machine.toggle(5, { toggle: true });
        expect(valueRef.value).toEqual([1, 3, 5]);
    });

    it('multi mode: range select with stale anchor resets the anchor and no-ops', () => {
        const {
            machine, 
            valueRef, 
            emitted, 
        } = makeMachine({
            mode: 'multi',
            keys: [10, 20, 30],
            initialValue: [],
        });
        // Set rangeAnchor to a key that's no longer in keys (stale).
        machine.rangeAnchor.value = 999;
        const before = emitted.length;
        machine.toggle(30, { range: true });
        // No new emit; anchor was refreshed.
        expect(emitted.length).toBe(before);
        expect(machine.rangeAnchor.value).toBe(30);
        expect(valueRef.value).toEqual([]);
    });

    it('moveFocus clamps to selectableCount bounds', () => {
        const { machine } = makeMachine({ mode: 'multi' });
        machine.moveFocus('next', 5);
        expect(machine.focusedIndex.value).toBe(1);
        machine.moveFocus('end', 5);
        expect(machine.focusedIndex.value).toBe(4);
        machine.moveFocus('next', 5);
        expect(machine.focusedIndex.value).toBe(4); // already at end, clamps
        machine.moveFocus('home', 5);
        expect(machine.focusedIndex.value).toBe(0);
    });
});
