/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { describe, expect, it } from 'vitest';
import type { NavigationItem } from '../../src';
import {
    collectTrail,
    findBestItemMatches,
    flattenWhere,
    normalizeItems,
    resetItemsByTrace,
} from '../../src/helpers';

const items: NavigationItem[] = [
    {
        name: 'Resources',
        url: '/resources',
        children: [
            { name: 'Robots', url: '/resources/robots' },
            { name: 'Robot-Add', url: '/resources/robots/add' },
        ],
    },
    {
        name: 'Settings',
        url: '/settings',
    },
];

function resolveFor(path: string) {
    const normalized = normalizeItems(items, { level: 0 });
    const [match] = findBestItemMatches(normalized, { path });
    const trace = match ? match.trace : [];
    resetItemsByTrace(normalized, trace);
    return { normalized, trace };
}

describe('active trail derivation', () => {
    it('marks exactly one leaf .active for a deep path', () => {
        const { normalized } = resolveFor('/resources/robots/add');
        const active = flattenWhere(normalized, (i) => !!i.active);

        expect(active).toHaveLength(1);
        expect(active[0].name).toBe('Robot-Add');
    });

    it('sets .activeWithin on ancestors of the active leaf (not the leaf)', () => {
        const { normalized } = resolveFor('/resources/robots/add');

        const resources = normalized[0];
        const leaf = resources.children[1];

        expect(resources.activeWithin).toBe(true);
        expect(resources.active).toBe(false);

        expect(leaf.active).toBe(true);
        expect(leaf.activeWithin).toBe(false);
    });

    it('drives displayChildren open along the active branch only', () => {
        const { normalized } = resolveFor('/resources/robots/add');

        expect(normalized[0].displayChildren).toBe(true); // Resources — on the branch
        expect(normalized[1].displayChildren).toBe(false); // Settings — off the branch
    });

    it('collectTrail returns the ordered root→leaf chain', () => {
        const { normalized, trace } = resolveFor('/resources/robots/add');
        const trail = collectTrail(normalized, trace);

        expect(trail.map((i) => i.name)).toEqual(['Resources', 'Robot-Add']);
    });

    it('produces a single-item trail for a top-level leaf', () => {
        const { normalized, trace } = resolveFor('/settings');
        const trail = collectTrail(normalized, trace);
        const active = flattenWhere(normalized, (i) => !!i.active);

        expect(active.map((i) => i.name)).toEqual(['Settings']);
        expect(trail.map((i) => i.name)).toEqual(['Settings']);
        expect(normalized[0].displayChildren).toBe(false); // Resources stays closed
    });
});
