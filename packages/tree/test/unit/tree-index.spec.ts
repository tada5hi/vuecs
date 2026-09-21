import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { buildTreeIndex } from '../../src';

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
