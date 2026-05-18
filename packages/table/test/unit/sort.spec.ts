import { ref } from 'vue';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { useSortMachine } from '../../src/composables/sort';
import type { TableColumn, TableSortState } from '../../src/types';

function setup(initial: TableSortState = []) {
    const source = ref<TableSortState | undefined>(initial);
    const columns = ref<TableColumn<unknown>[]>([
        { key: 'name' },
        { key: 'createdAt', initialSortDirection: 'desc' },
        { key: 'email' },
    ]);
    const mustSort = ref(false);
    const maxSortKeys = ref(3);
    const emit = vi.fn((next: TableSortState) => { source.value = next; });
    const machine = useSortMachine({
        source,
        columns,
        mustSort,
        maxSortKeys,
        emit,
    });
    return {
        machine,
        source,
        columns,
        mustSort,
        maxSortKeys,
        emit,
    };
}

describe('useSortMachine — single-column cycle', () => {
    it('empty → asc on first activation, using initialSortDirection', () => {
        const { machine, emit } = setup();
        machine.setSort('name');
        expect(emit).toHaveBeenCalledWith([{ key: 'name', direction: 'asc' }]);
    });

    it('respects per-column initialSortDirection on first activation', () => {
        const { machine, emit } = setup();
        machine.setSort('createdAt');
        expect(emit).toHaveBeenLastCalledWith([{ key: 'createdAt', direction: 'desc' }]);
    });

    it('asc → desc → empty array when not mustSort', () => {
        const { machine, emit } = setup();
        machine.setSort('name'); // → [asc]
        machine.setSort('name'); // → [desc]
        machine.setSort('name'); // → []
        expect(emit.mock.calls.map((c) => c[0])).toEqual([
            [{ key: 'name', direction: 'asc' }],
            [{ key: 'name', direction: 'desc' }],
            [],
        ]);
    });

    it('asc → desc → asc when mustSort', () => {
        const {
            machine,
            mustSort,
            emit,
        } = setup();
        mustSort.value = true;
        machine.setSort('name'); // → [asc]
        machine.setSort('name'); // → [desc]
        machine.setSort('name'); // → [asc] (skip null)
        expect(emit.mock.calls.map((c) => c[0])).toEqual([
            [{ key: 'name', direction: 'asc' }],
            [{ key: 'name', direction: 'desc' }],
            [{ key: 'name', direction: 'asc' }],
        ]);
    });

    it('switching column REPLACES the sort with the new column initial direction', () => {
        const { machine, emit } = setup();
        machine.setSort('name'); // → [asc]
        machine.setSort('createdAt'); // → [desc] (column's initialSortDirection)
        expect(emit).toHaveBeenLastCalledWith([{ key: 'createdAt', direction: 'desc' }]);
    });

    it('directionFor returns the current direction, null otherwise', () => {
        const { machine } = setup([{ key: 'name', direction: 'desc' }]);
        expect(machine.directionFor('name')).toBe('desc');
        expect(machine.directionFor('createdAt')).toBeNull();
    });

    it('explicit direction jumps straight to it', () => {
        const { machine, emit } = setup();
        machine.setSort('name', { direction: 'desc' });
        expect(emit).toHaveBeenLastCalledWith([{ key: 'name', direction: 'desc' }]);
    });
});

describe('useSortMachine — multi-column (append) cycling', () => {
    it('append=true adds a secondary key (initialSortDirection)', () => {
        const { machine, emit } = setup();
        machine.setSort('name');
        machine.setSort('createdAt', { append: true });
        expect(emit.mock.calls[1][0]).toEqual([
            { key: 'name', direction: 'asc' },
            { key: 'createdAt', direction: 'desc' },
        ]);
    });

    it('append=true on an already-sorted key cycles its direction without reordering', () => {
        const { machine, emit } = setup();
        machine.setSort('name');
        machine.setSort('createdAt', { append: true }); // adds secondary desc
        machine.setSort('createdAt', { append: true }); // cycles secondary to asc
        expect(emit.mock.calls[2][0]).toEqual([
            { key: 'name', direction: 'asc' },
            { key: 'createdAt', direction: 'asc' },
        ]);
    });

    it('append=true cycling past the second direction removes the key', () => {
        const { machine, emit } = setup();
        machine.setSort('name');
        machine.setSort('createdAt', { append: true }); // [name asc, createdAt desc]
        machine.setSort('createdAt', { append: true }); // [name asc, createdAt asc]
        machine.setSort('createdAt', { append: true }); // [name asc]
        expect(emit.mock.calls[3][0]).toEqual([{ key: 'name', direction: 'asc' }]);
    });

    it('plain click on a different column REPLACES the multi-sort', () => {
        const { machine, emit } = setup();
        machine.setSort('name');
        machine.setSort('createdAt', { append: true });
        machine.setSort('email'); // not append → replace
        expect(emit.mock.calls[2][0]).toEqual([{ key: 'email', direction: 'asc' }]);
    });

    it('caps the sort array at maxSortKeys (oldest evicted)', () => {
        const {
            machine, 
            emit, 
            maxSortKeys, 
        } = setup();
        maxSortKeys.value = 2;
        machine.setSort('name'); // [name]
        machine.setSort('createdAt', { append: true }); // [name, createdAt]
        machine.setSort('email', { append: true }); // [createdAt, email] — name evicted
        expect(emit.mock.calls[2][0]).toEqual([
            { key: 'createdAt', direction: 'desc' },
            { key: 'email', direction: 'asc' },
        ]);
    });

    it('maxSortKeys=0 means unlimited', () => {
        const {
            machine, 
            emit, 
            maxSortKeys, 
        } = setup();
        maxSortKeys.value = 0;
        machine.setSort('name');
        machine.setSort('createdAt', { append: true });
        machine.setSort('email', { append: true });
        expect((emit.mock.calls[2][0] as TableSortState).length).toBe(3);
    });

    it('positionFor returns 1-based index of the key in the sort array', () => {
        const { machine } = setup([
            { key: 'name', direction: 'asc' },
            { key: 'createdAt', direction: 'desc' },
        ]);
        expect(machine.positionFor('name')).toBe(1);
        expect(machine.positionFor('createdAt')).toBe(2);
        expect(machine.positionFor('email')).toBeNull();
    });
});
