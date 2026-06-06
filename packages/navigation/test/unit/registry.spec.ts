/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    computed, 
    ref, 
    watchEffect,
} from 'vue';
import type { Ref } from 'vue';
import {
    describe, 
    expect, 
    it, 
    vi,
} from 'vitest';
import { NavigationRegistry } from '../../src';
import type { NavigationItemNormalized, NavigationRegistryEntry } from '../../src';

function item(name: string, active = false): NavigationItemNormalized {
    return {
        name,
        children: [],
        trace: [name],
        meta: {},
        active,
    };
}

function makeEntry(initial: NavigationItemNormalized[] = []): {
    entry: NavigationRegistryEntry;
    source: Ref<NavigationItemNormalized[]>;
} {
    const source = ref<NavigationItemNormalized[]>(initial);
    const entry: NavigationRegistryEntry = {
        items: source,
        active: computed(() => source.value.filter((i) => i.active)),
        activeTrail: computed(() => source.value.filter((i) => i.active)),
    };
    return { entry, source };
}

describe('NavigationRegistry', () => {
    it('registers and reads an entry by id', () => {
        const registry = new NavigationRegistry();
        const { entry } = makeEntry([item('Home')]);

        expect(registry.has('a')).toBe(false);

        registry.register('a', entry);

        expect(registry.has('a')).toBe(true);
        expect(registry.get('a')).toBe(entry);
        expect(registry.get('a').items.value).toHaveLength(1);
    });

    it('returns a stable empty entry for an absent id', () => {
        const registry = new NavigationRegistry();

        const first = registry.get('missing');
        const second = registry.get('missing');

        expect(first).toBe(second);
        expect(first.items.value).toEqual([]);
        expect(first.active.value).toEqual([]);
        expect(first.activeTrail.value).toEqual([]);
    });

    it('clears the occupant via the returned unregister closure', () => {
        const registry = new NavigationRegistry();
        const { entry } = makeEntry();

        const unregister = registry.register('a', entry);
        unregister();

        expect(registry.has('a')).toBe(false);
    });

    it('last-wins: a new occupant replaces the previous one (with dev warning)', () => {
        const registry = new NavigationRegistry();
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const { entry: entryA } = makeEntry([item('A')]);
        const { entry: entryB } = makeEntry([item('B')]);

        registry.register('x', entryA);
        registry.register('x', entryB);

        expect(warn).toHaveBeenCalledOnce();
        expect(registry.get('x')).toBe(entryB);

        warn.mockRestore();
    });

    it('ownership-guarded unmount: a stale closure cannot evict the new occupant', () => {
        const registry = new NavigationRegistry();
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const { entry: entryA } = makeEntry([item('A')]);
        const { entry: entryB } = makeEntry([item('B')]);

        // handoff order: new occupant registers before the old one unmounts
        const unregisterA = registry.register('x', entryA);
        const unregisterB = registry.register('x', entryB);
        unregisterA(); // departing page — stale token captured in the closure

        expect(registry.has('x')).toBe(true);
        expect(registry.get('x')).toBe(entryB);

        // the real occupant can still release it
        unregisterB();
        expect(registry.has('x')).toBe(false);

        warn.mockRestore();
    });

    it('get(id) is reactive across occupancy flips', () => {
        const registry = new NavigationRegistry();
        const { entry, source } = makeEntry([item('A'), item('B')]);

        const seen: number[] = [];
        const stop = watchEffect(() => {
            seen.push(registry.get('a').items.value.length);
        }, { flush: 'sync' });

        expect(seen).toEqual([0]); // absent → stable empty entry

        const unregister = registry.register('a', entry);
        expect(seen).toEqual([0, 2]); // occupant filled in reactively

        source.value = [item('A')]; // content change on the live entry
        expect(seen).toEqual([0, 2, 1]);

        unregister();
        expect(seen).toEqual([0, 2, 1, 0]); // back to empty entry

        stop();
    });
});
