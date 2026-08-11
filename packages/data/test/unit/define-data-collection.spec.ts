import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, reactive } from 'vue';
import { describe, expect, it } from 'vitest';
import { defineDataCollection } from '../../src';

type Row = { id: number, name: string };
type Meta = { pagination: { limit: number, offset: number }, filters?: Record<string, unknown> };

const deferred = <V>() => {
    let resolve!: (v: V) => void;
    let reject!: (e: unknown) => void;
    const promise = new Promise<V>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve,
        reject,
    };
};

const baseMeta = () : Meta => ({ pagination: { limit: 10, offset: 0 } });

describe('defineDataCollection', () => {
    it('should load data, total and meta patch-back', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async (meta) => ({
                data: [{ id: 1, name: 'a' }],
                total: 42,
                meta: { filters: { seen: meta.pagination.limit } },
            }),
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        expect(source.busy.value).toBeFalsy();
        await source.load();
        expect(source.data.value).toHaveLength(1);
        expect(source.total.value).toEqual(42);
        expect(source.meta.filters).toEqual({ seen: 10 });
        expect(source.isEmpty.value).toBeFalsy();
    });

    it('should merge object meta shallowly and accept an updater fn', async () => {
        const seen : Meta[] = [];
        const source = defineDataCollection<Row, Meta>({
            load: async (meta) => {
                seen.push(meta);
                return { data: [] };
            },
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        await source.load({ pagination: { limit: 10, offset: 20 } });
        expect(seen[0].pagination).toEqual({ limit: 10, offset: 20 });

        await source.load((current) => ({
            ...current,
            pagination: { ...current.pagination, offset: 30 },
        }));
        expect(seen[1].pagination).toEqual({ limit: 10, offset: 30 });
    });

    it('should let the latest load win over a stale in-flight response', async () => {
        const first = deferred<Row[]>();
        const second = deferred<Row[]>();
        let call = 0;
        const source = defineDataCollection<Row, Meta>({
            load: async () => {
                call += 1;
                const rows = await (call === 1 ? first.promise : second.promise);
                return { data: rows, total: rows.length };
            },
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        const p1 = source.load();
        const p2 = source.load();
        expect(source.busy.value).toBeTruthy();

        second.resolve([{ id: 2, name: 'newer' }]);
        await p2;
        expect(source.data.value[0].name).toEqual('newer');

        first.resolve([{ id: 1, name: 'stale' }]);
        await p1;
        // stale response discarded
        expect(source.data.value[0].name).toEqual('newer');
        expect(source.busy.value).toBeFalsy();
    });

    it('should capture load errors instead of rejecting, and clear on next load', async () => {
        let fail = true;
        const source = defineDataCollection<Row, Meta>({
            load: async () => {
                if (fail) throw new Error('boom');
                return { data: [] };
            },
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        await expect(source.load()).resolves.toBeUndefined();
        expect(source.error.value).toBeInstanceOf(Error);
        expect(source.busy.value).toBeFalsy();

        fail = false;
        await source.load();
        expect(source.error.value).toBeUndefined();
    });

    it('should run mutate under busy accounting and rethrow', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [] }),
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        const gate = deferred<void>();
        const op = source.mutate(async () => {
            await gate.promise;
            return 'ok';
        });
        expect(source.busy.value).toBeTruthy();
        gate.resolve();
        await expect(op).resolves.toEqual('ok');
        expect(source.busy.value).toBeFalsy();

        await expect(source.mutate(async () => {
            throw new Error('write failed');
        }))
            .rejects.toThrow('write failed');
        expect(source.error.value).toBeInstanceOf(Error);
    });

    it('should apply mutators with gate flags and keep total truthful', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [{ id: 1, name: 'a' }], total: 1 }),
            initialMeta: baseMeta(),
            autoLoad: false,
            dedupCreated: true,
            filterDeleted: true,
        });
        await source.load();

        source.create({ id: 2, name: 'b' });
        expect(source.data.value).toHaveLength(2);
        expect(source.total.value).toEqual(2);

        source.create({ id: 2, name: 'dup' }); // deduped no-op
        expect(source.total.value).toEqual(2);

        source.update({ id: 2, name: 'b2' });
        expect(source.data.value[1].name).toEqual('b2');

        source.delete({ id: 2, name: 'b2' });
        expect(source.data.value).toHaveLength(1);
        expect(source.total.value).toEqual(1);

        source.delete({ id: 99, name: 'missing' }); // filtered no-op
        expect(source.total.value).toEqual(1);
    });

    it('should autoLoad on mount and skip when hydrated', async () => {
        let loads = 0;
        const build = (hydrate?: () => {
            data: Row[],
            total?: number,
            meta: Meta
        } | undefined) => defineComponent({
            setup() {
                const source = defineDataCollection<Row, Meta>({
                    load: async () => {
                        loads += 1;
                        return { data: [{ id: 1, name: 'a' }] };
                    },
                    initialMeta: baseMeta(),
                    hydrate,
                });
                return { source };
            },
            template: '<div>{{ source.data.value.length }}</div>',
        });

        const auto = mount(build());
        await flushPromises();
        expect(loads).toEqual(1);
        auto.unmount();

        const hydrated = mount(build(() => ({
            data: [{ id: 7, name: 'ssr' }],
            total: 7,
            meta: baseMeta(),
        })));
        await flushPromises();
        expect(loads).toEqual(1); // hydration skipped the fetch
        expect(hydrated.text()).toEqual('1');
        hydrated.unmount();
    });

    it('should round-trip dehydrate', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [{ id: 1, name: 'a' }], total: 9 }),
            initialMeta: baseMeta(),
            autoLoad: false,
        });
        await source.load();
        const snapshot = source.dehydrate();
        expect(snapshot).toEqual({
            data: [{ id: 1, name: 'a' }],
            total: 9,
            meta: baseMeta(),
        });
        // shallow clone: replacing a TOP-LEVEL key on the snapshot must not
        // touch the live bag (nested objects are shared — documented).
        snapshot.meta = { pagination: { limit: 99, offset: 0 } };
        expect(source.meta.pagination.limit).toEqual(10);
    });

    it('should let the incoming item win on conflicting keys when mergeOnUpdated is set', async () => {
        const source = defineDataCollection<Row & { extra?: string }, Meta>({
            load: async () => ({
                data: [{
                    id: 1,
                    name: 'old',
                    extra: 'keep',
                }],
            }),
            initialMeta: baseMeta(),
            autoLoad: false,
            mergeOnUpdated: true,
        });
        await source.load();
        source.update({ id: 1, name: 'new' });
        // incoming wins on conflict; untouched keys survive the deep merge
        expect(source.data.value[0]).toEqual({
            id: 1,
            name: 'new',
            extra: 'keep',
        });
    });

    it('should replace array-valued keys on a merged update rather than concatenating them', async () => {
        const source = defineDataCollection<Row & { tags?: string[] }, Meta>({
            load: async () => ({
                data: [{
                    id: 1,
                    name: 'a',
                    tags: ['old'],
                }],
            }),
            initialMeta: baseMeta(),
            autoLoad: false,
            mergeOnUpdated: true,
        });
        await source.load();

        source.update({
            id: 1,
            name: 'a',
            tags: ['new'],
        });
        // the incoming array replaces wholesale — no concat growth across updates
        expect(source.data.value[0].tags).toEqual(['new']);
    });

    it('should accept a reactive item on a merged update', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [{ id: 1, name: 'a' }] }),
            initialMeta: baseMeta(),
            autoLoad: false,
            mergeOnUpdated: true,
        });
        await source.load();

        // realistic call site: `source.update(rows.value[0])` off a deep ref.
        // Same `toRaw` unwrap as the record variant — see mergePatch.
        source.update(reactive({ id: 1, name: 'b' }));
        expect(source.data.value[0].name).toEqual('b');
    });

    it('should buffer mutators during an in-flight load and drain them in order after the response', async () => {
        const gate = deferred<Row[]>();
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: await gate.promise, total: 1 }),
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        const p = source.load();
        source.create({ id: 2, name: 'live-created' }); // realtime event mid-flight
        source.delete({ id: 1, name: 'a' }); // realtime event mid-flight
        expect(source.data.value).toHaveLength(0); // buffered, not applied

        gate.resolve([{ id: 1, name: 'a' }]);
        await p;
        // response applied FIRST, then buffered ops in arrival order
        expect(source.data.value).toEqual([{ id: 2, name: 'live-created' }]);
        expect(source.total.value).toEqual(1); // 1 (server) + 1 create − 1 delete
    });

    it('should drain buffered mutators even when the load fails', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => {
                throw new Error('boom');
            },
            initialMeta: baseMeta(),
            initialData: [{ id: 1, name: 'a' }],
            autoLoad: false,
        });

        const p = source.load();
        source.create({ id: 2, name: 'survivor' });
        await p;
        expect(source.error.value).toBeInstanceOf(Error);
        expect(source.data.value).toHaveLength(2); // event was not lost
    });

    it('should discard a stale in-flight rejection', async () => {
        const first = deferred<Row[]>();
        const second = deferred<Row[]>();
        let call = 0;
        const source = defineDataCollection<Row, Meta>({
            load: async () => {
                call += 1;
                return { data: await (call === 1 ? first.promise : second.promise) };
            },
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        const p1 = source.load();
        const p2 = source.load();

        second.resolve([{ id: 2, name: 'newer' }]);
        await p2;

        first.reject(new Error('stale failure'));
        await p1;

        // the loser's rejection must not surface as the source's error
        expect(source.error.value).toBeUndefined();
    });

    it('should not adjust total when the server never reported one', () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [] }),
            initialMeta: baseMeta(),
            initialData: [{ id: 1, name: 'a' }],
            autoLoad: false,
        });

        source.create({ id: 2, name: 'b' });
        // total stays derived from data.length — no phantom counter seeded at 0
        expect(source.total.value).toEqual(2);
    });

    it('should not decrement total when deleting a row that is not present', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [{ id: 1, name: 'a' }], total: 50 }),
            initialMeta: baseMeta(),
            autoLoad: false,
        });
        await source.load();

        // realtime "deleted" for an off-page row: default flags make
        // applyDelete return a fresh SAME-LENGTH array, so a hardcoded
        // -1 would corrupt the count.
        source.delete({ id: 99, name: 'off-page' });
        expect(source.total.value).toEqual(50);
    });

    it('should drop meta keys the updater form omits', async () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [] }),
            initialMeta: {
                pagination: { limit: 10, offset: 0 },
                filters: { q: 'x' },
            },
            autoLoad: false,
        });

        await source.load((current) => ({ pagination: current.pagination }));
        expect('filters' in source.meta).toBe(false);
    });

    it('should hand the load adapter a detached meta snapshot', async () => {
        let received : Meta | undefined;
        const source = defineDataCollection<Row, Meta>({
            load: async (meta) => {
                received = meta;
                return { data: [] };
            },
            initialMeta: baseMeta(),
            autoLoad: false,
        });

        await source.load();
        source.meta.pagination = { limit: 99, offset: 99 };
        // the adapter got `{ ...meta }`, so a later top-level write can't reach it
        expect(received).toEqual(baseMeta());
    });

    it('should detach the dehydrated array while preserving row identity', async () => {
        const row = { id: 1, name: 'a' };
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [row], total: 1 }),
            initialMeta: baseMeta(),
            autoLoad: false,
        });
        await source.load();

        const snap = source.dehydrate();
        expect(snap.data).not.toBe(source.data.value);
        snap.data.push({ id: 2, name: 'pushed' });
        expect(source.data.value).toHaveLength(1);
        // shallowRef keeps loader-owned rows raw — identity survives, no proxy
        expect(snap.data[0]).toBe(row);
    });

    it('should let a hydration snapshot replace initialMeta rather than merge onto it', () => {
        const source = defineDataCollection<Row, Meta>({
            load: async () => ({ data: [] }),
            initialMeta: {
                pagination: { limit: 10, offset: 0 },
                filters: { q: 'stale' },
            },
            hydrate: {
                data: [{ id: 1, name: 'a' }],
                meta: baseMeta(), // carries no `filters`
            },
        });

        // the snapshot is authoritative — a key it dropped must not survive
        expect('filters' in source.meta).toBe(false);
    });
});
