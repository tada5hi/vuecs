import { ref } from 'vue';
import { 
    describe, 
    expect, 
    it, 
    vi, 
} from 'vitest';
import { useSortMachine } from '../../src/composables/sort';
import type { TableColumn, TableSortState } from '../../src/types';

function setup(initial: TableSortState = null) {
    const source = ref<TableSortState | undefined>(initial);
    const columns = ref<TableColumn<unknown>[]>([
        { key: 'name' },
        { key: 'createdAt', initialSortDirection: 'desc' },
    ]);
    const mustSort = ref(false);
    const emit = vi.fn((next: TableSortState) => { source.value = next; });
    const machine = useSortMachine({
        source, 
        columns, 
        mustSort, 
        emit, 
    });
    return {
        machine, 
        source, 
        columns, 
        mustSort, 
        emit, 
    };
}

describe('useSortMachine — single-column cycle', () => {
    it('null → asc on first activation, using initialSortDirection', () => {
        const { machine, emit } = setup();
        machine.setSort('name');
        expect(emit).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    });

    it('respects per-column initialSortDirection on first activation', () => {
        const { machine, emit } = setup();
        machine.setSort('createdAt');
        expect(emit).toHaveBeenLastCalledWith({ key: 'createdAt', direction: 'desc' });
    });

    it('asc → desc → null when not mustSort', () => {
        const { machine, emit } = setup();
        machine.setSort('name'); // → asc
        machine.setSort('name'); // → desc
        machine.setSort('name'); // → null
        expect(emit.mock.calls.map((c) => c[0])).toEqual([
            { key: 'name', direction: 'asc' },
            { key: 'name', direction: 'desc' },
            null,
        ]);
    });

    it('asc → desc → asc when mustSort', () => {
        const {
            machine, 
            mustSort, 
            emit, 
        } = setup();
        mustSort.value = true;
        machine.setSort('name'); // → asc
        machine.setSort('name'); // → desc
        machine.setSort('name'); // → asc (skip null)
        expect(emit.mock.calls.map((c) => c[0])).toEqual([
            { key: 'name', direction: 'asc' },
            { key: 'name', direction: 'desc' },
            { key: 'name', direction: 'asc' },
        ]);
    });

    it('switching column starts at the new column initial direction', () => {
        const { machine, emit } = setup();
        machine.setSort('name'); // → asc
        machine.setSort('createdAt'); // → desc (column's initialSortDirection)
        expect(emit).toHaveBeenLastCalledWith({ key: 'createdAt', direction: 'desc' });
    });

    it('directionFor returns the current direction, null otherwise', () => {
        const { machine } = setup({ key: 'name', direction: 'desc' });
        expect(machine.directionFor('name')).toBe('desc');
        expect(machine.directionFor('createdAt')).toBeNull();
    });

    it('explicit direction jumps straight to it', () => {
        const { machine, emit } = setup();
        machine.setSort('name', 'desc');
        expect(emit).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    });
});
