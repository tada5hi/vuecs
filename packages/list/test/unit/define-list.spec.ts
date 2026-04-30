import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { defineList } from '../../src';

type User = {
    id: number; 
    name: string; 
    email?: string 
};

describe('defineList', () => {
    describe('reactive sources', () => {
        it('reads plain arrays', () => {
            const list = defineList<User>({ data: [{ id: 1, name: 'a' }] });
            expect(list.data.value).toEqual([{ id: 1, name: 'a' }]);
        });

        it('unwraps refs', () => {
            const data = ref<User[]>([{ id: 1, name: 'a' }]);
            const list = defineList<User>({ data });
            expect(list.data.value).toEqual(data.value);
            data.value = [{ id: 2, name: 'b' }];
            expect(list.data.value).toEqual([{ id: 2, name: 'b' }]);
        });

        it('evaluates getters', () => {
            const ext = ref('a');
            const list = defineList<User>({ data: () => [{ id: 1, name: ext.value }] });
            expect(list.data.value[0].name).toBe('a');
            ext.value = 'b';
            expect(list.data.value[0].name).toBe('b');
        });
    });

    describe('total', () => {
        it('falls back to data.length when not provided', () => {
            const list = defineList<User>({ data: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }] });
            expect(list.total.value).toBe(2);
        });

        it('uses the declared total when set', () => {
            const list = defineList<User>({ data: [{ id: 1, name: 'a' }], total: 100 });
            expect(list.total.value).toBe(100);
        });

        it('treats undefined declared total as fallthrough', () => {
            const list = defineList<User>({
                data: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }],
                total: () => undefined,
            });
            expect(list.total.value).toBe(2);
        });
    });

    describe('isEmpty', () => {
        it('is true when not busy and total === 0', () => {
            const list = defineList<User>({ data: [] });
            expect(list.isEmpty.value).toBe(true);
        });

        it('is false while busy even with zero data', () => {
            const list = defineList<User>({ data: [], busy: true });
            expect(list.isEmpty.value).toBe(false);
        });

        it('is false when data is non-empty', () => {
            const list = defineList<User>({ data: [{ id: 1, name: 'a' }] });
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
            const list = defineList<User>({ data: items, itemId: (u) => u.name });
            expect(list.findIndex({ id: 99, name: 'b' })).toBe(1);
        });

        it('uses itemKey when provided as a key', () => {
            const list = defineList<User>({ data: items, itemKey: 'id' });
            expect(list.findIndex({ id: 3, name: 'whatever' })).toBe(2);
        });

        it('uses itemKey when provided as a function', () => {
            const list = defineList<User>({ data: items, itemKey: () => 'name' });
            expect(list.findIndex({ id: 99, name: 'a' })).toBe(0);
        });

        it('falls back to .id when nothing else is set', () => {
            const list = defineList<User>({ data: items });
            expect(list.findIndex({ id: 2, name: 'whatever' })).toBe(1);
        });

        it('returns -1 when not found', () => {
            const list = defineList<User>({ data: items });
            expect(list.findIndex({ id: 999, name: 'z' })).toBe(-1);
        });
    });

    describe('getItemKey', () => {
        const items: User[] = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];

        it('returns the resolved id from itemId fn', () => {
            const list = defineList<User>({ data: items, itemId: (u) => u.name });
            expect(list.getItemKey(items[0])).toBe('a');
        });

        it('returns the resolved id from itemKey', () => {
            const list = defineList<User>({ data: items, itemKey: 'id' });
            expect(list.getItemKey(items[1])).toBe(2);
        });

        it('falls back to .id when no hint is configured', () => {
            const list = defineList<User>({ data: items });
            expect(list.getItemKey(items[0])).toBe(1);
        });

        it('returns undefined when no identity hint can be resolved', () => {
            type Bare = { name: string };
            const bareItems: Bare[] = [{ name: 'a' }];
            const list = defineList<Bare>({ data: bareItems });
            expect(list.getItemKey(bareItems[0])).toBeUndefined();
        });
    });

    describe('flags + helpers', () => {
        const items: User[] = [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
        ];

        it('defaults all three flags to false', () => {
            const list = defineList<User>({ data: items });
            expect(list.flags).toEqual({
                mergeOnUpdated: false,
                dedupCreated: false,
                filterDeleted: false,
            });
        });

        it('applyCreate appends by default', () => {
            const list = defineList<User>({ data: items });
            const next = list.applyCreate(items, { id: 3, name: 'c' });
            expect(next).toHaveLength(3);
            expect(next[2]).toEqual({ id: 3, name: 'c' });
        });

        it('applyCreate dedups when dedupCreated is true', () => {
            const list = defineList<User>({ data: items, dedupCreated: true });
            const next = list.applyCreate(items, { id: 1, name: 'a-renamed' });
            expect(next).toBe(items); // same reference — no-op
        });

        it('applyUpdate replaces by default', () => {
            const list = defineList<User>({ data: items });
            const next = list.applyUpdate(items, { id: 2, name: 'b-new' });
            expect(next[1]).toEqual({ id: 2, name: 'b-new' });
        });

        it('applyUpdate deep-merges when mergeOnUpdated is true', () => {
            const list = defineList<User>({ data: items, mergeOnUpdated: true });
            const next = list.applyUpdate(items, { id: 2, email: 'b@example.com' } as User);
            expect(next[1]).toEqual({
                id: 2, 
                name: 'b', 
                email: 'b@example.com', 
            });
        });

        it('applyDelete removes the matching record', () => {
            const list = defineList<User>({ data: items });
            const next = list.applyDelete(items, { id: 1, name: 'a' });
            expect(next).toEqual([{ id: 2, name: 'b' }]);
        });

        it('applyDelete leaves the array unchanged when filterDeleted is true and item missing', () => {
            const list = defineList<User>({ data: items, filterDeleted: true });
            const next = list.applyDelete(items, { id: 99, name: 'z' });
            expect(next).toBe(items);
        });
    });

    describe('writer resolution + bound mutators', () => {
        it('exposes mutators automatically when data is a Ref (no setData needed)', () => {
            const ref_ = ref<User[]>(items_());
            const list = defineList<User>({ data: ref_ });
            expect(typeof list.create).toBe('function');
            list.create({ id: 3, name: 'c' });
            expect(ref_.value).toHaveLength(3);
            expect(ref_.value[2]).toEqual({ id: 3, name: 'c' });
        });

        it('does NOT expose mutators when data is a getter and no setData is provided', () => {
            const list = defineList<User>({ data: () => items_() });
            expect((list as Record<string, unknown>).create).toBeUndefined();
            expect((list as Record<string, unknown>).update).toBeUndefined();
            expect((list as Record<string, unknown>).delete).toBeUndefined();
        });

        it('does NOT expose mutators for plain-array data without setData', () => {
            const list = defineList<User>({ data: items_() });
            expect((list as Record<string, unknown>).create).toBeUndefined();
        });

        it('explicit setData wins over the auto-derived ref setter', () => {
            const ref_ = ref<User[]>(items_());
            const calls: User[][] = [];
            const list = defineList<User>({
                data: ref_,
                setData: (next) => { calls.push(next); /* deliberately do NOT mutate ref_ */ },
            });
            list.create({ id: 3, name: 'c' });
            expect(calls).toHaveLength(1);
            expect(calls[0]).toHaveLength(3);
            // Ref untouched — explicit setData replaced the auto-derived setter:
            expect(ref_.value).toHaveLength(2);
        });

        it('exposes mutators when setData is provided alongside a non-ref source', () => {
            const captured: User[][] = [];
            const list = defineList<User>({
                data: () => items_(),
                setData: (next) => { captured.push(next); },
            });
            expect(typeof list.create).toBe('function');
            list.create({ id: 3, name: 'c' });
            expect(captured).toHaveLength(1);
            expect(captured[0]).toHaveLength(3);
        });

        it('create writes through setData', () => {
            const ref_ = ref<User[]>(items_());
            const list = defineList<User>({
                data: ref_,
                setData: (next) => { ref_.value = next; },
            });
            list.create({ id: 3, name: 'c' });
            expect(ref_.value).toHaveLength(3);
            expect(ref_.value[2]).toEqual({ id: 3, name: 'c' });
        });

        it('update writes through setData and honors mergeOnUpdated', () => {
            const ref_ = ref<User[]>(items_());
            const list = defineList<User>({
                data: ref_,
                mergeOnUpdated: true,
                setData: (next) => { ref_.value = next; },
            });
            list.update({ id: 2, email: 'b@example.com' } as User);
            expect(ref_.value[1]).toEqual({
                id: 2, 
                name: 'b', 
                email: 'b@example.com', 
            });
        });

        it('delete writes through setData', () => {
            const ref_ = ref<User[]>(items_());
            const list = defineList<User>({
                data: ref_,
                setData: (next) => { ref_.value = next; },
            });
            list.delete({ id: 1, name: 'a' });
            expect(ref_.value).toEqual([{ id: 2, name: 'b' }]);
        });

        it('create reads the latest data.value, not a stale snapshot', () => {
            const ref_ = ref<User[]>(items_());
            const list = defineList<User>({
                data: ref_,
                setData: (next) => { ref_.value = next; },
            });
            list.create({ id: 3, name: 'c' });
            list.create({ id: 4, name: 'd' });
            expect(ref_.value).toHaveLength(4);
            expect(ref_.value.map((u) => u.id)).toEqual([1, 2, 3, 4]);
        });
    });

    describe('per-op handlers (onCreated / onUpdated / onDeleted)', () => {
        it('list.create dispatches to onCreated with the raw item', () => {
            const seen: User[] = [];
            const list = defineList<User>({
                data: () => items_(),
                onCreated: (item) => { seen.push(item); },
            });
            list.create({ id: 3, name: 'c' });
            expect(seen).toEqual([{ id: 3, name: 'c' }]);
        });

        it('list.update dispatches to onUpdated with the raw item (no auto-merge)', () => {
            const seen: User[] = [];
            const list = defineList<User>({
                data: () => items_(),
                mergeOnUpdated: true,            // ignored on the per-op path
                onUpdated: (item) => { seen.push(item); },
            });
            list.update({ id: 2, email: 'b@example.com' } as User);
            // Handler receives the raw partial item, NOT a merged record.
            expect(seen[0]).toEqual({ id: 2, email: 'b@example.com' });
        });

        it('list.delete dispatches to onDeleted with the raw item', () => {
            const seen: User[] = [];
            const list = defineList<User>({
                data: () => items_(),
                onDeleted: (item) => { seen.push(item); },
            });
            list.delete({ id: 1, name: 'a' });
            expect(seen).toEqual([{ id: 1, name: 'a' }]);
        });

        it('dedupCreated gates onCreated (skips when item already exists)', () => {
            const ref_ = ref<User[]>(items_());
            const seen: User[] = [];
            const list = defineList<User>({
                data: ref_,
                dedupCreated: true,
                onCreated: (item) => { seen.push(item); },
            });
            list.create({ id: 1, name: 'a-renamed' });
            expect(seen).toEqual([]);            // gate fired
            list.create({ id: 99, name: 'new' });
            expect(seen).toEqual([{ id: 99, name: 'new' }]);
        });

        it('filterDeleted gates onDeleted (skips when item not in list)', () => {
            const ref_ = ref<User[]>(items_());
            const seen: User[] = [];
            const list = defineList<User>({
                data: ref_,
                filterDeleted: true,
                onDeleted: (item) => { seen.push(item); },
            });
            list.delete({ id: 999, name: 'gone' });
            expect(seen).toEqual([]);            // gate fired
            list.delete({ id: 1, name: 'a' });
            expect(seen).toEqual([{ id: 1, name: 'a' }]);
        });

        it('mixes per-op + setData fallback (per-op only for the ones declared)', () => {
            const ref_ = ref<User[]>(items_());
            const seenCreated: User[] = [];
            const list = defineList<User>({
                data: ref_,
                onCreated: (item) => { seenCreated.push(item); },
                setData: (next) => { ref_.value = next; },
            });
            list.create({ id: 3, name: 'c' });
            // onCreated handled it; setData NOT called → ref unchanged
            expect(seenCreated).toEqual([{ id: 3, name: 'c' }]);
            expect(ref_.value).toHaveLength(2);

            // update has no per-op handler → falls back to setData
            list.update({ id: 1, name: 'a-renamed' });
            expect(ref_.value[0]).toEqual({ id: 1, name: 'a-renamed' });
        });

        it('mixes per-op + ref auto-derived fallback', () => {
            const ref_ = ref<User[]>(items_());
            let createCount = 0;
            const list = defineList<User>({
                data: ref_,
                onCreated: () => { createCount += 1; },
            });
            list.create({ id: 3, name: 'c' });
            // onCreated fired; ref untouched (no fallback ran)
            expect(createCount).toBe(1);
            expect(ref_.value).toHaveLength(2);

            // delete has no per-op handler → ref auto-setter applies
            list.delete({ id: 1, name: 'a' });
            expect(ref_.value).toEqual([{ id: 2, name: 'b' }]);
        });

        it('exposes mutators when only one per-op handler is provided', () => {
            const list = defineList<User>({
                data: () => items_(),
                onCreated: () => { /* no-op */ },
            });
            // All three present in the type and at runtime — but update/delete
            // have no writer here, so they're silent no-ops.
            expect(typeof list.create).toBe('function');
            expect(typeof list.update).toBe('function');
            expect(typeof list.delete).toBe('function');
            expect(() => list.update({ id: 1, name: 'x' })).not.toThrow();
            expect(() => list.delete({ id: 1, name: 'x' })).not.toThrow();
        });
    });

    describe('meta bag', () => {
        it('forwards meta verbatim onto ListState.meta', () => {
            const list = defineList<User, { foo: string }>({
                data: items_(),
                meta: { foo: 'bar' },
            });
            expect(list.meta).toEqual({ foo: 'bar' });
        });

        it('preserves the same reference (no wrapping / cloning)', () => {
            const meta = { ping: 'pong' };
            const list = defineList<User, { ping: string }>({
                data: items_(),
                meta,
            });
            expect(list.meta).toBe(meta);
        });

        it('defaults meta to an empty object when omitted', () => {
            const list = defineList<User>({ data: items_() });
            expect(list.meta).toEqual({});
        });

        it('preserves nested Refs and callbacks inside meta as-is', () => {
            const refresh = () => 'reloaded';
            const cursor = ref(0);
            const list = defineList<User, { refresh: () => string; cursor: typeof cursor }>({
                data: items_(),
                meta: { refresh, cursor },
            });
            expect(list.meta.refresh).toBe(refresh);
            expect(list.meta.cursor).toBe(cursor);
            // Nested Ref stays reactive on its own:
            cursor.value = 5;
            expect(list.meta.cursor.value).toBe(5);
        });
    });
});

function items_(): User[] {
    return [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
}
