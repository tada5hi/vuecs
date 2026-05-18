import { describe, expect, it } from 'vitest';
import { sortRows } from '../../src/utils/sort-rows';
import type { TableColumn } from '../../src/types';

type Row = {
    id: number;
    name: string;
    score: number | null;
    createdAt: string;
};

const cols: TableColumn<Row>[] = [
    { key: 'id' },
    { key: 'name' },
    { key: 'score' },
    { key: 'createdAt' },
];

const data: Row[] = [
    {
        id: 3,
        name: 'Carol',
        score: 50,
        createdAt: '2026-02-01',
    },
    {
        id: 1,
        name: 'Alice',
        score: null,
        createdAt: '2026-01-15',
    },
    {
        id: 2,
        name: 'Bob',
        score: 80,
        createdAt: '2026-03-01',
    },
    {
        id: 4,
        name: 'Dave',
        score: 80,
        createdAt: '2026-01-15',
    },
];

describe('sortRows', () => {
    it('empty sorts → returns a shallow copy of the input', () => {
        const out = sortRows(data, { columns: cols, sorts: [] });
        expect(out).not.toBe(data);
        expect(out).toEqual(data);
    });

    it('asc / desc by numeric key', () => {
        const asc = sortRows(data, {
            columns: cols,
            sorts: [{ key: 'id', direction: 'asc' }],
        });
        expect(asc.map((r) => r.id)).toEqual([1, 2, 3, 4]);

        const desc = sortRows(data, {
            columns: cols,
            sorts: [{ key: 'id', direction: 'desc' }],
        });
        expect(desc.map((r) => r.id)).toEqual([4, 3, 2, 1]);
    });

    it('nulls sort LAST regardless of direction by default', () => {
        const asc = sortRows(data, {
            columns: cols,
            sorts: [{ key: 'score', direction: 'asc' }],
        });
        expect(asc.map((r) => r.score)).toEqual([50, 80, 80, null]);

        const desc = sortRows(data, {
            columns: cols,
            sorts: [{ key: 'score', direction: 'desc' }],
        });
        expect(desc.map((r) => r.score)).toEqual([80, 80, 50, null]);
    });

    it('column.nullsFirst floats nulls to the top regardless of direction', () => {
        const colsWithNullsFirst: TableColumn<Row>[] = cols.map((c) => (
            c.key === 'score' ? { ...c, nullsFirst: true } : c
        ));
        const asc = sortRows(data, {
            columns: colsWithNullsFirst,
            sorts: [{ key: 'score', direction: 'asc' }],
        });
        expect(asc.map((r) => r.score)).toEqual([null, 50, 80, 80]);
    });

    it('multi-key tie-break — secondary sort resolves equal primaries', () => {
        // score 80 has a tie between Bob and Dave; tie-break by name asc.
        const out = sortRows(data, {
            columns: cols,
            sorts: [
                { key: 'score', direction: 'desc' },
                { key: 'name', direction: 'asc' },
            ],
        });
        expect(out.map((r) => r.name)).toEqual(['Bob', 'Dave', 'Carol', 'Alice']);
    });

    it('column.sortFn overrides the default comparator', () => {
        // Sort by id but invert: pretend `sortFn` is a semver-style compare.
        const colsWithFn: TableColumn<Row>[] = cols.map((c) => (
            c.key === 'id' ? { ...c, sortFn: (a, b) => (b as number) - (a as number) } : c
        ));
        const asc = sortRows(data, {
            columns: colsWithFn,
            sorts: [{ key: 'id', direction: 'asc' }],
        });
        // Reversed because sortFn flips the sign — asc now reads as desc.
        expect(asc.map((r) => r.id)).toEqual([4, 3, 2, 1]);
    });

    it('column.sortByFormatted uses formatter output as the sort key', () => {
        // Bucket ids into 'A' / 'B' via formatter; alphabetical sort.
        const colsWithFmt: TableColumn<Row>[] = cols.map((c) => (
            c.key === 'id' ? {
                ...c,
                sortByFormatted: true,
                formatter: ({ value }) => (Number(value) > 2 ? 'B' : 'A'),
            } : c
        ));
        const asc = sortRows(data, {
            columns: colsWithFmt,
            sorts: [{ key: 'id', direction: 'asc' }],
        });
        // ids 1 + 2 → 'A'; ids 3 + 4 → 'B'. Among ties, stable-sort
        // preserves input order: 1, 2 (the input order of A's) then 3, 4.
        expect(asc.map((r) => r.id)).toEqual([1, 2, 3, 4]);
    });

    it('non-existent column key is silently skipped (no throw)', () => {
        const out = sortRows(data, {
            columns: cols,
            sorts: [
                { key: 'missing', direction: 'asc' },
                { key: 'name', direction: 'asc' },
            ],
        });
        // Falls through to the second descriptor.
        expect(out.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Carol', 'Dave']);
    });

    it('input array is not mutated', () => {
        const before = data.map((r) => r.id);
        sortRows(data, { columns: cols, sorts: [{ key: 'id', direction: 'desc' }] });
        expect(data.map((r) => r.id)).toEqual(before);
    });

    it('locale-aware string compare handles mixed alphanumeric naturally', () => {
        const items = [
            { name: 'item 10' },
            { name: 'item 2' },
            { name: 'item 1' },
        ];
        const out = sortRows(items, {
            columns: [{ key: 'name' }],
            sorts: [{ key: 'name', direction: 'asc' }],
        });
        // localeCompare with `numeric: true` puts '2' before '10'.
        expect(out.map((r) => r.name)).toEqual(['item 1', 'item 2', 'item 10']);
    });
});
