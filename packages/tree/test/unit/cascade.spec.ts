import { describe, expect, it } from 'vitest';
import { buildTreeIndex, cascadeSelect, normalize } from '../../src';

type Node = {
    id: string,
    disabled?: boolean,
    kids?: Node[]
};

const key = (item: Node) => item.id;
const kids = (item: Node) => item.kids;

// a
// ├ a1
// └ a2
//   ├ a2x
//   └ a2y
// b
const TREE: Node[] = [
    { id: 'a', kids: [{ id: 'a1' }, { id: 'a2', kids: [{ id: 'a2x' }, { id: 'a2y' }] }] },
    { id: 'b' },
];

const index = () => buildTreeIndex(TREE, key, kids);
const sorted = (s: Set<string>) => [...s].sort();

describe('cascadeSelect', () => {
    it('selects every descendant when a branch is selected', () => {
        const { selected } = cascadeSelect(index(), new Set(), 'a', true);

        expect(sorted(selected)).toEqual(['a', 'a1', 'a2', 'a2x', 'a2y']);
    });

    it('deselects every descendant when a branch is deselected', () => {
        const { selected } = cascadeSelect(index(), new Set(['a', 'a1', 'a2', 'a2x', 'a2y']), 'a', false);

        expect(sorted(selected)).toEqual([]);
    });

    it('promotes a parent once its last child is selected', () => {
        const step1 = cascadeSelect(index(), new Set(), 'a2x', true);
        expect(step1.selected.has('a2')).toBe(false);

        const step2 = cascadeSelect(index(), step1.selected, 'a2y', true);
        expect(step2.selected.has('a2')).toBe(true);
    });

    it('demotes an ancestor when a single leaf is deselected', () => {
        const all = cascadeSelect(index(), new Set(), 'a', true).selected;

        const { selected } = cascadeSelect(index(), all, 'a2x', false);

        expect(selected.has('a')).toBe(false);
        expect(selected.has('a2')).toBe(false);
        expect(selected.has('a1')).toBe(true);
    });

    // Upstream defect (b): reka's bubbleSelect resolves parents out of the VISIBLE
    // flattened list, so a collapsed parent never updates. Our index has no notion
    // of expansion at all, which is what makes this pass.
    it('updates a parent whose branch is collapsed', () => {
        // `expanded` is never an input to the kernel — selecting both deep leaves
        // promotes `a2` and then `a` with nothing expanded.
        let state = cascadeSelect(index(), new Set(), 'a2x', true).selected;
        state = cascadeSelect(index(), state, 'a2y', true).selected;
        state = cascadeSelect(index(), state, 'a1', true).selected;

        expect(state.has('a')).toBe(true);
    });

    // Upstream defect (a): reka's internal flatten() recurses on a hard-coded
    // `.children`, so a custom children key silently breaks the cascade.
    it('cascades through a non-standard children key', () => {
        const weird: Node[] = [{ id: 'p', kids: [{ id: 'c1' }, { id: 'c2' }] }];
        const idx = buildTreeIndex(weird, key, (i) => i.kids);

        const { selected } = cascadeSelect(idx, new Set(), 'p', true);

        expect(sorted(selected)).toEqual(['c1', 'c2', 'p']);
    });

    it('preserves keys that are not present in the index', () => {
        const { selected } = cascadeSelect(index(), new Set(['ghost']), 'b', true);

        expect(selected.has('ghost')).toBe(true);
    });

    it('leaves an unresolved branch as a leaf', () => {
        const lazy: Node[] = [{ id: 'p' }];
        const idx = buildTreeIndex(lazy, key, () => undefined);

        const { selected, indeterminate } = cascadeSelect(idx, new Set(), 'p', true);

        expect(sorted(selected)).toEqual(['p']);
        expect(indeterminate.size).toBe(0);
    });

    it('does not write a disabled descendant', () => {
        const withDisabled: Node[] = [{ id: 'a', kids: [{ id: 'a1' }, { id: 'a2', disabled: true }] }];
        const idx = buildTreeIndex(withDisabled, key, kids, { isDisabled: (i: Node) => !!i.disabled });

        const { selected } = cascadeSelect(idx, new Set(), 'a', true);

        expect(selected.has('a2')).toBe(false);
        expect(selected.has('a1')).toBe(true);
    });

    it('does not let a disabled child block its parent', () => {
        const withDisabled: Node[] = [{ id: 'a', kids: [{ id: 'a1' }, { id: 'a2', disabled: true }] }];
        const idx = buildTreeIndex(withDisabled, key, kids, { isDisabled: (i: Node) => !!i.disabled });

        const { selected } = cascadeSelect(idx, new Set(), 'a1', true);

        expect(selected.has('a')).toBe(true);
    });
});

describe('normalize', () => {
    it('marks a partially-selected branch indeterminate', () => {
        const { indeterminate } = normalize(index(), new Set(['a2x']));

        expect(sorted(indeterminate)).toEqual(['a', 'a2']);
    });

    it('does not mark a fully-selected branch indeterminate', () => {
        const { selected, indeterminate } = normalize(index(), new Set(['a1', 'a2x', 'a2y']));

        expect(selected.has('a')).toBe(true);
        expect(indeterminate.size).toBe(0);
    });

    it('is idempotent', () => {
        const once = normalize(index(), new Set(['a2x']));
        const twice = normalize(index(), once.selected);

        expect(sorted(twice.selected)).toEqual(sorted(once.selected));
        expect(sorted(twice.indeterminate)).toEqual(sorted(once.indeterminate));
    });

    it('propagates indeterminate up through more than one level', () => {
        const deep: Node[] = [{ id: 'r', kids: [{ id: 'm', kids: [{ id: 'l1' }, { id: 'l2' }] }] }];
        const idx = buildTreeIndex(deep, key, kids);

        const { indeterminate } = normalize(idx, new Set(['l1']));

        expect(sorted(indeterminate)).toEqual(['m', 'r']);
    });
});
