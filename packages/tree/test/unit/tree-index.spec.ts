import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { buildTreeIndex, resolveGuideRails } from '../../src';

type Node = { id: string, kids?: Node[] };

const key = (item: Node) => item.id;
const kids = (item: Node) => item.kids;

describe('buildTreeIndex', () => {
    it('walks the whole tree in pre-order regardless of expansion', () => {
        const items: Node[] = [
            { id: 'a', kids: [{ id: 'a1' }, { id: 'a2', kids: [{ id: 'a2x' }] }] },
            { id: 'b' },
        ];

        expect(buildTreeIndex(items, key, kids).order).toEqual(['a', 'a1', 'a2', 'a2x', 'b']);
    });

    it('records parent edges for every descendant', () => {
        const items: Node[] = [{ id: 'a', kids: [{ id: 'a1', kids: [{ id: 'a1x' }] }] }];
        const index = buildTreeIndex(items, key, kids);

        expect(index.nodes.get('a')?.parentKey).toBeUndefined();
        expect(index.nodes.get('a1')?.parentKey).toBe('a');
        expect(index.nodes.get('a1x')?.parentKey).toBe('a1');
    });

    it('numbers levels from 1 at the root', () => {
        const items: Node[] = [{ id: 'a', kids: [{ id: 'a1', kids: [{ id: 'a1x' }] }] }];
        const index = buildTreeIndex(items, key, kids);

        expect(index.nodes.get('a')?.level).toBe(1);
        expect(index.nodes.get('a1')?.level).toBe(2);
        expect(index.nodes.get('a1x')?.level).toBe(3);
    });

    it('exposes the root keys separately from the full order', () => {
        const items: Node[] = [{ id: 'a', kids: [{ id: 'a1' }] }, { id: 'b' }];

        expect(buildTreeIndex(items, key, kids).rootKeys).toEqual(['a', 'b']);
    });

    it('maps every item reference to its key in refKeys', () => {
        const child: Node = { id: 'a1' };
        const root: Node = { id: 'a', kids: [child] };
        const index = buildTreeIndex([root], key, kids);

        expect(index.refKeys.get(root)).toBe('a');
        expect(index.refKeys.get(child)).toBe('a1');
    });

    it('marks a node resolved only when getChildren returned an array', () => {
        const items: Node[] = [{ id: 'leaf' }, { id: 'empty', kids: [] }, { id: 'full', kids: [{ id: 'c' }] }];
        const index = buildTreeIndex(items, key, kids);

        expect(index.nodes.get('leaf')?.resolved).toBe(false);
        expect(index.nodes.get('empty')?.resolved).toBe(true);
        expect(index.nodes.get('full')?.resolved).toBe(true);
    });

    it('skips a duplicate key and warns once', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const items: Node[] = [{ id: 'a' }, { id: 'a' }];

        const index = buildTreeIndex(items, key, kids);

        expect(index.order).toEqual(['a']);
        expect(warn).toHaveBeenCalledTimes(1);
        warn.mockRestore();
    });

    it('stops at the depth cap instead of recursing forever on a cyclic getChildren', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        let n = 0;
        const index = buildTreeIndex<Node>(
            [{ id: 'root' }],
            () => `k${n++}`,
            () => [{ id: 'deeper' }],
            { maxDepth: 10 },
        );

        expect(index.order.length).toBe(10);
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it('treats a non-object item as unresolvable rather than throwing', () => {
        const index = buildTreeIndex<unknown>([null, 1, 'x'], (i) => String(i), () => undefined);

        expect(index.order).toEqual(['null', '1', 'x']);
    });
});

// Guide rails: a row at level N has N-1 gutter columns. Column k tracks the
// ancestor at level k+1, and the LAST column is the row's own elbow. Each
// entry answers "does that node have a later sibling" — exactly the `├`
// (true) vs `└` (false) distinction CSS cannot derive on its own.
describe('resolveGuideRails', () => {
    // a            (has later sibling: d)
    // ├ b          (has later sibling: c)
    // │ └ b1       (last)
    // └ c          (last)
    // d            (last)
    const GUIDE_TREE: Node[] = [
        {
            id: 'a',
            kids: [
                { id: 'b', kids: [{ id: 'b1' }] },
                { id: 'c' },
            ],
        },
        { id: 'd' },
    ];

    const idx = () => buildTreeIndex(GUIDE_TREE, key, kids);

    it('gives a root-level row no gutters', () => {
        expect(resolveGuideRails(idx(), 'a')).toEqual([]);
        expect(resolveGuideRails(idx(), 'd')).toEqual([]);
    });

    it('gives a level-2 row one gutter holding its own elbow state', () => {
        expect(resolveGuideRails(idx(), 'b')).toEqual([true]);
        expect(resolveGuideRails(idx(), 'c')).toEqual([false]);
    });

    it('tracks the ancestor line in the outer gutter of a level-3 row', () => {
        // b1's outer gutter follows `b`, which still has `c` after it, so the
        // line must continue past b1 to reach `c`. b1 itself is last, so its
        // own elbow stops.
        expect(resolveGuideRails(idx(), 'b1')).toEqual([true, false]);
    });

    it('returns an empty list for a key it does not know', () => {
        expect(resolveGuideRails(idx(), 'nope')).toEqual([]);
    });
});
