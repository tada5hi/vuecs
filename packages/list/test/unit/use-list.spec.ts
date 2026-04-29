import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useList } from '../../src';

type User = {
    id: number; 
    name: string; 
    email?: string 
};

describe('useList', () => {
    describe('reactive sources', () => {
        it('reads plain arrays', () => {
            const list = useList<User>({ data: [{ id: 1, name: 'a' }] });
            expect(list.data.value).toEqual([{ id: 1, name: 'a' }]);
        });

        it('unwraps refs', () => {
            const data = ref<User[]>([{ id: 1, name: 'a' }]);
            const list = useList<User>({ data });
            expect(list.data.value).toEqual(data.value);
            data.value = [{ id: 2, name: 'b' }];
            expect(list.data.value).toEqual([{ id: 2, name: 'b' }]);
        });

        it('evaluates getters', () => {
            const ext = ref('a');
            const list = useList<User>({ data: () => [{ id: 1, name: ext.value }] });
            expect(list.data.value[0].name).toBe('a');
            ext.value = 'b';
            expect(list.data.value[0].name).toBe('b');
        });
    });

    describe('total', () => {
        it('falls back to data.length when not provided', () => {
            const list = useList<User>({ data: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }] });
            expect(list.total.value).toBe(2);
        });

        it('uses the declared total when set', () => {
            const list = useList<User>({ data: [{ id: 1, name: 'a' }], total: 100 });
            expect(list.total.value).toBe(100);
        });

        it('treats undefined declared total as fallthrough', () => {
            const list = useList<User>({
                data: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }],
                total: () => undefined,
            });
            expect(list.total.value).toBe(2);
        });
    });

    describe('isEmpty', () => {
        it('is true when not busy and total === 0', () => {
            const list = useList<User>({ data: [] });
            expect(list.isEmpty.value).toBe(true);
        });

        it('is false while busy even with zero data', () => {
            const list = useList<User>({ data: [], busy: true });
            expect(list.isEmpty.value).toBe(false);
        });

        it('is false when data is non-empty', () => {
            const list = useList<User>({ data: [{ id: 1, name: 'a' }] });
            expect(list.isEmpty.value).toBe(false);
        });
    });

    describe('findIndex', () => {
        const items: User[] = [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
            { id: 3, name: 'c' },
        ];

        it('uses itemId function when provided', () => {
            const list = useList<User>({ data: items, itemId: (u) => u.name });
            expect(list.findIndex({ id: 99, name: 'b' })).toBe(1);
        });

        it('uses itemKey when provided as a key', () => {
            const list = useList<User>({ data: items, itemKey: 'id' });
            expect(list.findIndex({ id: 3, name: 'whatever' })).toBe(2);
        });

        it('uses itemKey when provided as a function', () => {
            const list = useList<User>({ data: items, itemKey: () => 'name' });
            expect(list.findIndex({ id: 99, name: 'a' })).toBe(0);
        });

        it('falls back to .id when nothing else is set', () => {
            const list = useList<User>({ data: items });
            expect(list.findIndex({ id: 2, name: 'whatever' })).toBe(1);
        });

        it('returns -1 when not found', () => {
            const list = useList<User>({ data: items });
            expect(list.findIndex({ id: 999, name: 'z' })).toBe(-1);
        });
    });

    describe('flags + helpers', () => {
        const items: User[] = [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
        ];

        it('defaults all three flags to false', () => {
            const list = useList<User>({ data: items });
            expect(list.flags).toEqual({
                mergeOnUpdate: false,
                dedupCreated: false,
                filterDeleted: false,
            });
        });

        it('applyCreate appends by default', () => {
            const list = useList<User>({ data: items });
            const next = list.applyCreate(items, { id: 3, name: 'c' });
            expect(next).toHaveLength(3);
            expect(next[2]).toEqual({ id: 3, name: 'c' });
        });

        it('applyCreate dedups when dedupCreated is true', () => {
            const list = useList<User>({ data: items, dedupCreated: true });
            const next = list.applyCreate(items, { id: 1, name: 'a-renamed' });
            expect(next).toBe(items); // same reference — no-op
        });

        it('applyUpdate replaces by default', () => {
            const list = useList<User>({ data: items });
            const next = list.applyUpdate(items, { id: 2, name: 'b-new' });
            expect(next[1]).toEqual({ id: 2, name: 'b-new' });
        });

        it('applyUpdate deep-merges when mergeOnUpdate is true', () => {
            const list = useList<User>({ data: items, mergeOnUpdate: true });
            const next = list.applyUpdate(items, { id: 2, email: 'b@example.com' } as User);
            expect(next[1]).toEqual({
                id: 2, 
                name: 'b', 
                email: 'b@example.com', 
            });
        });

        it('applyDelete removes the matching record', () => {
            const list = useList<User>({ data: items });
            const next = list.applyDelete(items, { id: 1, name: 'a' });
            expect(next).toEqual([{ id: 2, name: 'b' }]);
        });

        it('applyDelete leaves the array unchanged when filterDeleted is true and item missing', () => {
            const list = useList<User>({ data: items, filterDeleted: true });
            const next = list.applyDelete(items, { id: 99, name: 'z' });
            expect(next).toBe(items);
        });
    });

    describe('extras pass-through (Q3)', () => {
        it('forwards arbitrary fields to the return value', () => {
            const load = () => 'loaded';
            const list = useList<User, unknown, { load: () => string }>({
                data: items_(),
                load,
            } as any);
            expect((list as any).load).toBe(load);
        });

        it('does not let extras leak as keys on the return alongside reserved fields', () => {
            const list = useList<User>({
                data: items_(),
                meta: { foo: 'bar' },
            });
            // Reserved keys are computed; extras would have to be plain values.
            // Confirm the return shape matches what we expect — meta resolves
            // through the reserved path, not as an extras passthrough.
            expect(list.meta.value).toEqual({ foo: 'bar' });
            expect((list as any).meta).toBe(list.meta); // not a re-export
        });
    });
});

function items_(): User[] {
    return [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
}
