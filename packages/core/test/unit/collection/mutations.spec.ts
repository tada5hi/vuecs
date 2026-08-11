import { describe, expect, it } from 'vitest';
import { createCollectionMutations, resolveItemIdentity } from '../../../src';

type Row = {
    id: number,
    name: string,
    nested?: { a?: number, b?: number }
};

describe('resolveItemIdentity', () => {
    it('should prefer itemId over itemKey over the .id heuristic', () => {
        const item : Row = { id: 1, name: 'a' };
        expect(resolveItemIdentity(item, () => 99)).toEqual(99);
        expect(resolveItemIdentity(item, undefined, 'name')).toEqual('a');
        expect(resolveItemIdentity(item)).toEqual(1);
        expect(resolveItemIdentity({ foo: 'bar' })).toBeUndefined();
    });
});

describe('createCollectionMutations', () => {
    it('should append on applyCreate and dedup when flagged', () => {
        const m = createCollectionMutations<Row>({ flags: { dedupCreated: true } });
        const current : Row[] = [{ id: 1, name: 'a' }];
        expect(m.applyCreate(current, { id: 2, name: 'b' })).toHaveLength(2);
        // gated no-op returns the SAME reference (callers key off identity)
        expect(m.applyCreate(current, { id: 1, name: 'dup' })).toBe(current);
    });

    it('should replace on applyUpdate, and deep-merge via the injected merge fn', () => {
        const merge = (target: object, source: object) => ({ ...target, ...source });
        const current : Row[] = [{
            id: 1,
            name: 'a',
            nested: { a: 1 },
        }];

        const replace = createCollectionMutations<Row>({});
        expect(replace.applyUpdate(current, { id: 1, name: 'b' })[0]).toEqual({ id: 1, name: 'b' });

        const merging = createCollectionMutations<Row>({ flags: { mergeOnUpdated: true }, merge });
        expect(merging.applyUpdate(current, { id: 1, name: 'b' } as Row)[0])
            .toEqual({
                id: 1,
                name: 'b',
                nested: { a: 1 },
            });

        expect(replace.applyUpdate(current, { id: 99, name: 'x' })).toBe(current);
    });

    it('should remove on applyDelete and no-op when flagged + missing', () => {
        const m = createCollectionMutations<Row>({ flags: { filterDeleted: true } });
        const current : Row[] = [{ id: 1, name: 'a' }];
        expect(m.applyDelete(current, { id: 1, name: 'a' })).toHaveLength(0);
        expect(m.applyDelete(current, { id: 2, name: 'x' })).toBe(current);
    });

    it('should expose resolved flags and identity helpers', () => {
        const m = createCollectionMutations<Row>({ itemKey: 'name' });
        expect(m.flags).toEqual({
            mergeOnUpdated: false,
            dedupCreated: false,
            filterDeleted: false,
        });
        expect(m.getItemKey({ id: 1, name: 'a' })).toEqual('a');
        expect(m.indexOf([{ id: 1, name: 'a' }], { id: 9, name: 'a' })).toEqual(0);
    });
});
