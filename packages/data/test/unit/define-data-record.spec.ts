import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, reactive } from 'vue';
import { describe, expect, it } from 'vitest';
import type { DataRecordDefinition } from '../../src';
import { defineDataRecord } from '../../src';

type User = {
    id: number,
    name: string,
    nickname?: string | null,
    extra?: string,
    tags?: string[],
    profile?: { email?: string, phone?: string }
};
type Meta = { fields?: string[], include?: string[] };

describe('defineDataRecord', () => {
    it('should load and expose the record', async () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: { id: 1, name: 'a' } }),
            autoLoad: false,
        });
        await source.load();
        expect(source.data.value).toEqual({ id: 1, name: 'a' });
    });

    it('should skip nothing on explicit refresh but coalesce ensure() onto resolved state', async () => {
        let loads = 0;
        const source = defineDataRecord<User, Meta>({
            load: async () => {
                loads += 1;
                return { data: { id: 1, name: 'a' } };
            },
            autoLoad: false,
        });

        await source.ensure();
        expect(loads).toEqual(1);
        await source.ensure(); // already resolved → no fetch
        expect(loads).toEqual(1);
        await source.refresh(); // explicit → fetches
        expect(loads).toEqual(2);
    });

    it('should coalesce concurrent ensure() calls onto the in-flight load', async () => {
        let loads = 0;
        let release!: () => void;
        const gate = new Promise<void>((res) => {
            release = res;
        });
        const source = defineDataRecord<User, Meta>({
            load: async () => {
                loads += 1;
                await gate;
                return { data: { id: 1, name: 'a' } };
            },
            autoLoad: false,
        });

        const a = source.ensure();
        const b = source.ensure();
        release();
        await Promise.all([a, b]);
        expect(loads).toEqual(1);
    });

    it('should still fetch on ensure() while only a mutate() is in flight', async () => {
        let loads = 0;
        const source = defineDataRecord<User, Meta>({
            load: async () => {
                loads += 1;
                return { data: undefined }; // e.g. a 404 — the record stays unresolved
            },
            autoLoad: false,
        });

        await source.load();
        expect(loads).toEqual(1);
        expect(source.data.value).toBeUndefined();

        let release!: () => void;
        const gate = new Promise<void>((res) => {
            release = res;
        });
        const write = source.mutate(async () => {
            await gate;
            return 'ok';
        });
        // a write raises `busy` too, and the settled first load is still the
        // core's "latest" run — neither is proof that a LOAD is in flight
        expect(source.busy.value).toBeTruthy();

        await source.ensure();
        expect(loads).toEqual(2); // must fetch, not coalesce onto the write

        release();
        await write;
    });

    it('should adopt initialData and apply set/merge/clear', () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: undefined }),
            initialData: {
                id: 1,
                name: 'a',
                profile: { email: 'a@b.c' },
            },
            autoLoad: false,
        });

        expect(source.data.value?.name).toEqual('a');

        source.merge({ name: 'b', profile: { phone: '123' } });
        expect(source.data.value).toEqual({
            id: 1,
            name: 'b',
            profile: { email: 'a@b.c', phone: '123' },
        });

        source.set({ id: 2, name: 'c' });
        expect(source.data.value).toEqual({ id: 2, name: 'c' });

        source.clear();
        expect(source.data.value).toBeUndefined();
    });

    it('should replace array-valued keys on merge rather than concatenating them', () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: undefined }),
            initialData: { id: 1, name: 'a' },
            autoLoad: false,
        });

        source.merge({ tags: ['a'] });
        expect(source.data.value?.tags).toEqual(['a']);

        // repeated realtime patches must not grow the array
        source.merge({ tags: ['b'] });
        expect(source.data.value?.tags).toEqual(['b']);
    });

    it('should skip explicitly-undefined patch keys and let null clear a value', () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: undefined }),
            initialData: {
                id: 1,
                name: 'a',
                nickname: 'nick',
            },
            autoLoad: false,
        });

        source.merge({ name: undefined, extra: 'x' });
        expect(source.data.value?.name).toEqual('a'); // undefined never clears
        expect(source.data.value?.extra).toEqual('x'); // the rest of the patch applies

        source.merge({ nickname: null });
        expect(source.data.value?.nickname).toBeNull(); // null deliberately clears
    });

    it('should neither mutate the caller patch nor share nested references after merge', () => {
        const record : User = {
            id: 1,
            name: 'a',
            profile: { email: 'a@b.c' },
        };
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: undefined }),
            initialData: record,
            autoLoad: false,
        });

        const patch = { profile: { phone: '123' } };
        source.merge(patch);

        expect(source.data.value?.profile).toEqual({ email: 'a@b.c', phone: '123' });
        // the patch is the caller's object (typically a realtime payload): it must
        // come back untouched and must not be aliased by the stored record …
        expect(patch).toEqual({ profile: { phone: '123' } });
        expect(source.data.value?.profile).not.toBe(patch.profile);
        // … and neither must the record it replaced
        expect(source.data.value?.profile).not.toBe(record.profile);
    });

    it('should accept a reactive patch object', () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: undefined }),
            initialData: { id: 1, name: 'a' },
            autoLoad: false,
        });

        // realistic call site: a consumer hands over a `reactive()` form object.
        // The merger deep-clones its inputs and `structuredClone` throws
        // DataCloneError on a Proxy, so the patch is unwrapped with `toRaw`.
        source.merge(reactive({ name: 'from-proxy' }));
        expect(source.data.value?.name).toEqual('from-proxy');
    });

    it('should ignore merge when unresolved', () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: undefined }),
            autoLoad: false,
        });
        source.merge({ name: 'x' });
        expect(source.data.value).toBeUndefined();
    });

    it('should buffer set/merge/clear during an in-flight load and drain after the response', async () => {
        let release!: (u: User) => void;
        const gate = new Promise<User>((res) => {
            release = res;
        });
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: await gate }),
            autoLoad: false,
        });

        const p = source.load();
        source.merge({ name: 'live-update' }); // realtime event mid-flight
        expect(source.data.value).toBeUndefined(); // buffered

        release({
            id: 1,
            name: 'server',
            profile: { email: 'a@b.c' },
        });
        await p;
        // response applied first, then the buffered merge on top
        expect(source.data.value).toEqual({
            id: 1,
            name: 'live-update',
            profile: { email: 'a@b.c' },
        });
    });

    it('should round-trip dehydrate', async () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: { id: 1, name: 'a' } }),
            initialMeta: { fields: ['name'] },
            autoLoad: false,
        });
        await source.load();
        expect(source.dehydrate()).toEqual({
            data: { id: 1, name: 'a' },
            meta: { fields: ['name'] },
        });
    });

    it('should let a hydration snapshot replace initialMeta rather than merge onto it', () => {
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: undefined }),
            initialMeta: {
                fields: ['stale'],
                include: ['profile'],
            },
            // lazy getter form — the value form is exercised by the autoLoad spec
            hydrate: () => ({
                data: { id: 7, name: 'ssr' },
                meta: { fields: ['name'] }, // carries no `include`
            }),
        });

        expect(source.data.value).toEqual({ id: 7, name: 'ssr' });
        // the snapshot is authoritative — a key it dropped must not survive
        expect('include' in source.meta).toBe(false);
        expect(source.meta.fields).toEqual(['name']);
    });

    it('should autoLoad on mount and skip when hydrated or seeded with initialData', async () => {
        let loads = 0;
        const build = (extra: Partial<DataRecordDefinition<User, Meta>>) => defineComponent({
            setup() {
                const source = defineDataRecord<User, Meta>({
                    load: async () => {
                        loads += 1;
                        return { data: { id: 1, name: 'fetched' } };
                    },
                    ...extra,
                });
                return { source };
            },
            template: '<div>{{ source.data.value?.name ?? "-" }}</div>',
        });

        const auto = mount(build({}));
        await flushPromises();
        expect(loads).toEqual(1);
        expect(auto.text()).toEqual('fetched');
        auto.unmount();

        const hydrated = mount(build({
            hydrate: {
                data: { id: 7, name: 'ssr' },
                meta: {},
            },
        }));
        await flushPromises();
        expect(loads).toEqual(1); // hydration skipped the fetch
        expect(hydrated.text()).toEqual('ssr');
        hydrated.unmount();

        const adopted = mount(build({ initialData: { id: 8, name: 'prop' } }));
        await flushPromises();
        expect(loads).toEqual(1); // adoption skipped the fetch
        expect(adopted.text()).toEqual('prop');
        adopted.unmount();
    });

    it('should dehydrate the live record by identity and detach the meta snapshot', async () => {
        const record : User = {
            id: 1,
            name: 'a',
            profile: { email: 'a@b.c' },
        };
        const source = defineDataRecord<User, Meta>({
            load: async () => ({ data: record }),
            initialMeta: { fields: ['name'] },
            autoLoad: false,
        });
        await source.load();

        const snapshot = source.dehydrate();
        // shallowRef keeps the loader-owned record raw — identity survives, no proxy
        expect(snapshot.data).toBe(record);
        // shallow clone: replacing a TOP-LEVEL meta key on the snapshot must not
        // touch the live bag (nested objects are shared — documented).
        expect(snapshot.meta).not.toBe(source.meta);
        snapshot.meta.fields = ['mutated'];
        expect(source.meta.fields).toEqual(['name']);
    });
});
