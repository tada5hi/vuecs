import { describe, expect, it } from 'vitest';
import { defineTable } from '../../src/composables/define-table';

describe('defineTable factory', () => {
    it('exposes refs for data + columns + busy + sort', () => {
        const t = defineTable<{ id: number; name: string }>({
            columns: ['id', 'name'],
            data: [{ id: 1, name: 'Alice' }],
            busy: false,
        });
        expect(t.data.value).toHaveLength(1);
        expect(t.columns.value.map((c) => c.key)).toEqual(['id', 'name']);
        expect(t.busy.value).toBe(false);
        expect(t.sort.value).toBeNull();
    });

    it('setSort cycles null → asc → desc → null', () => {
        const t = defineTable({ columns: ['id'] });
        t.setSort('id');
        expect(t.sort.value).toEqual({ key: 'id', direction: 'asc' });
        t.setSort('id');
        expect(t.sort.value).toEqual({ key: 'id', direction: 'desc' });
        t.setSort('id');
        expect(t.sort.value).toBeNull();
    });

    it('setSort with explicit direction jumps straight', () => {
        const t = defineTable({ columns: ['id'] });
        t.setSort('id', 'desc');
        expect(t.sort.value).toEqual({ key: 'id', direction: 'desc' });
    });

    it('columns is reactive to rawColumns updates', () => {
        const t = defineTable<{ id: number }>({});
        expect(t.columns.value).toEqual([]);
        t.rawColumns.value = ['id'];
        expect(t.columns.value).toEqual([{ key: 'id', label: 'Id' }]);
    });
});
