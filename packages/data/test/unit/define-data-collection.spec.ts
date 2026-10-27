import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, isProxy, reactive } from 'vue';
import { describe, expect, it } from 'vitest';
import { DataLoadStatus, defineDataCollection } from '../../src';

type Row = { id: number, name: string };
type Meta = { pagination: { limit: number, offset: number }, filters?: Record<string, unknown> };

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
        const first = Promise.withResolvers<Row[]>();
        const second = Promise.withResolvers<Row[]>();
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

        const outcome = await source.load();
        expect(outcome.status).toEqual(DataLoadStatus.FAILED);
        expect(source.error.value).toBeInstanceOf(Error);
        expect(outcome).toEqual({ status: 'failed', error: source.error.value });
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

        const gate = Promise.withResolvers<void>();
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
        const gate = Promise.withResolvers<Row[]>();
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
        const first = Promise.withResolvers<Row[]>();
        const second = Promise.withResolvers<Row[]>();
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

    describe('per-call input (#1744)', () => {
        it('should forward load/refresh input to the loader as its second argument', async () => {
            const seen : unknown[] = [];
            const source = defineDataCollection<Row, Meta, { search: string }>({
                load: async (_meta, input) => {
                    seen.push(input);
                    return { data: [] };
                },
                initialMeta: baseMeta(),
                autoLoad: false,
            });

            await source.load(undefined, { search: 'a' });
            await source.refresh({ search: 'b' });
            await source.load();
            expect(seen).toEqual([{ search: 'a' }, { search: 'b' }, undefined]);
        });
    });

    describe('load outcome (#1745)', () => {
        it('should resolve applied / superseded, never reject', async () => {
            const first = Promise.withResolvers<Row[]>();
            const second = Promise.withResolvers<Row[]>();
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
            first.reject(new Error('stale failure'));
            second.resolve([]);

            expect(await p1).toEqual({ status: 'superseded' });
            expect(await p2).toEqual({ status: 'applied' });
            // a superseded failure never reaches the shared error ref
            expect(source.error.value).toBeUndefined();
        });
    });

    describe('mutation outcome (#1746)', () => {
        it('should report applied / noop synchronously', async () => {
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: [{ id: 1, name: 'a' }], total: 1 }),
                initialMeta: baseMeta(),
                autoLoad: false,
                dedupCreated: true,
            });
            await source.load();

            expect(source.create({ id: 1, name: 'dup' })).toEqual('noop');
            expect(source.create({ id: 2, name: 'b' })).toEqual('applied');
            expect(source.update({ id: 9, name: 'absent' })).toEqual('noop');
            expect(source.update({ id: 2, name: 'b2' })).toEqual('applied');
            expect(source.delete({ id: 9, name: 'absent' })).toEqual('noop');
            expect(source.total.value).toEqual(2);
            expect(source.delete({ id: 2, name: 'b2' })).toEqual('applied');
            expect(source.total.value).toEqual(1);
        });

        it('should report buffered and fire onSettled once the load settles', async () => {
            const gate = Promise.withResolvers<Row[]>();
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: await gate.promise }),
                initialMeta: baseMeta(),
                autoLoad: false,
                dedupCreated: true,
            });

            const settled : string[] = [];
            const p = source.load();
            expect(source.create({ id: 1, name: 'a' }, { onSettled: (s) => { settled.push(`a:${s}`); } })).toEqual('buffered');
            expect(source.create({ id: 2, name: 'b' }, { onSettled: (s) => { settled.push(`b:${s}`); } })).toEqual('buffered');
            expect(settled).toEqual([]);

            gate.resolve([{ id: 1, name: 'from-server' }]);
            await p;
            expect(settled).toEqual(['a:noop', 'b:applied']);
            expect(source.data.value.map((r) => r.id)).toEqual([1, 2]);
        });

        it('should fire onSettled synchronously for an unbuffered mutation', () => {
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: [] }),
                autoLoad: false,
            });
            const settled : string[] = [];
            source.create({ id: 1, name: 'a' }, { onSettled: (s) => { settled.push(s); } });
            expect(settled).toEqual(['applied']);
        });
    });

    describe('meta commit on success (#1747)', () => {
        it('should hand the loader a draft and only commit it when the load applies', async () => {
            let fail = false;
            const seen : Meta[] = [];
            const source = defineDataCollection<Row, Meta>({
                load: async (meta) => {
                    seen.push(meta);
                    if (fail) throw new Error('boom');
                    return { data: [] };
                },
                initialMeta: baseMeta(),
                autoLoad: false,
            });

            fail = true;
            const failed = source.load({ filters: { name: 'x' } });
            // not committed while in flight either
            expect(source.meta.filters).toBeUndefined();
            await failed;
            expect(seen[0].filters).toEqual({ name: 'x' });
            expect(source.meta.filters).toBeUndefined();

            // the failed filter must not scope the next load
            fail = false;
            await source.load({ pagination: { limit: 10, offset: 10 } });
            expect(seen[1].filters).toBeUndefined();
            expect(source.meta.pagination.offset).toEqual(10);
        });

        it('should compose back-to-back drafts and commit only the winner', async () => {
            const first = Promise.withResolvers<Row[]>();
            const second = Promise.withResolvers<Row[]>();
            let call = 0;
            const seen : Meta[] = [];
            const source = defineDataCollection<Row, Meta>({
                load: async (meta) => {
                    call += 1;
                    seen.push(meta);
                    return { data: await (call === 1 ? first.promise : second.promise) };
                },
                initialMeta: baseMeta(),
                autoLoad: false,
            });

            const p1 = source.load({ filters: { name: 'x' } });
            const p2 = source.load({ pagination: { limit: 10, offset: 20 } });
            // the second draft builds on the first, as eager commits did
            expect(seen[1]).toEqual({ filters: { name: 'x' }, pagination: { limit: 10, offset: 20 } });

            second.resolve([]);
            first.resolve([]);
            await Promise.all([p1, p2]);
            expect(source.meta).toEqual({ filters: { name: 'x' }, pagination: { limit: 10, offset: 20 } });
        });

        it('should apply the loader meta patch-back over the committed draft', async () => {
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: [], meta: { pagination: { limit: 10, offset: 0 } } }),
                initialMeta: baseMeta(),
                autoLoad: false,
            });
            await source.load({ pagination: { limit: 10, offset: 999 } });
            expect(source.meta.pagination.offset).toEqual(0);
        });
    });

    describe('deep reactivity (#1748)', () => {
        it('should re-render on an in-place row write when deep', async () => {
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: [{ id: 1, name: 'a' }] }),
                autoLoad: false,
                deep: true,
            });
            await source.load();

            const Comp = defineComponent({ setup: () => () => source.data.value.map((r) => r.name).join(',') });
            const wrapper = mount(Comp);
            source.data.value[0].name = 'mutated';
            await flushPromises();
            expect(wrapper.text()).toEqual('mutated');
        });

        it('should update the held row in place and keep raw rows in dehydrate', async () => {
            const source = defineDataCollection<Row & { extra?: string }, Meta>({
                load: async () => ({
                    data: [{
                        id: 1, 
                        name: 'a', 
                        extra: 'gone', 
                    }], 
                }),
                autoLoad: false,
                deep: true,
            });
            await source.load();
            const held = source.data.value[0];

            expect(source.update({ id: 1, name: 'b' })).toEqual('applied');
            expect(source.data.value[0]).toBe(held);
            expect(held.name).toEqual('b');
            // replace semantic without mergeOnUpdated — dropped key removed
            expect('extra' in held).toBe(false);

            const snapshot = source.dehydrate();
            expect(isProxy(snapshot.data[0])).toBe(false);
            expect(() => structuredClone(snapshot)).not.toThrow();
        });

        it('should keep the shallow contract by default', async () => {
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: [{ id: 1, name: 'a' }] }),
                autoLoad: false,
            });
            await source.load();
            const held = source.data.value[0];
            source.update({ id: 1, name: 'b' });
            expect(source.data.value[0]).not.toBe(held);
            expect(isProxy(source.data.value[0])).toBe(false);
        });
    });
    describe('review follow-ups', () => {
        it('should keep a reactive row as handed in when shallow', async () => {
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: [] }),
                autoLoad: false,
            });
            const row = reactive({ id: 1, name: 'a' });
            source.create(row);
            expect(source.data.value[0]).toBe(row);
            expect(source.findIndex(row)).toEqual(0);
        });

        it('should replace primitive rows on update when deep', async () => {
            const source = defineDataCollection<string, Meta>({
                load: async () => ({ data: ['a', 'b'] }),
                autoLoad: false,
                deep: true,
                itemId: (item) => item,
            });
            await source.load();
            expect(() => source.update('a')).not.toThrow();
            expect(source.data.value).toEqual(['a', 'b']);
        });

        it('should unwrap proxies on the deep raw/proxy paths', async () => {
            const source = defineDataCollection<Row, Meta>({
                load: async () => ({ data: [{ id: 1, name: 'a' }] }),
                autoLoad: false,
                deep: true,
                dedupCreated: true,
            });
            await source.load();

            // a held row read back through data.value is a proxy …
            const held = source.data.value[0];
            expect(isProxy(held)).toBe(true);
            // … and still resolves against the raw rows by identity
            expect(source.findIndex(held)).toEqual(0);
            expect(source.create(held)).toEqual('noop');

            // a reactive row handed in is stored raw
            expect(source.create(reactive({ id: 2, name: 'b' }))).toEqual('applied');
            expect(source.delete(source.data.value[1])).toEqual('applied');

            const snapshot = source.dehydrate();
            expect(snapshot.data.some((r) => isProxy(r))).toBe(false);
            expect(() => structuredClone(snapshot)).not.toThrow();
        });
    });
});
