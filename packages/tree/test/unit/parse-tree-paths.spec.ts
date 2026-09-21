import { describe, expect, it } from 'vitest';
import { parseTreePaths } from '../../src';

describe('parseTreePaths', () => {
    it('builds a flat list from single-segment paths', () => {
        expect(parseTreePaths(['users', 'clients'])).toEqual([
            { id: 'users', label: 'users' },
            { id: 'clients', label: 'clients' },
        ]);
    });

    it('nests a child under its parent and keys it by the full path', () => {
        expect(parseTreePaths(['users', 'users/employees'])).toEqual([
            {
                id: 'users',
                label: 'users',
                children: [
                    { id: 'users/employees', label: 'employees' },
                ],
            },
        ]);
    });

    it('synthesises intermediate nodes that were never listed', () => {
        expect(parseTreePaths(['sources/ldap'])).toEqual([
            {
                id: 'sources',
                label: 'sources',
                children: [
                    { id: 'sources/ldap', label: 'ldap' },
                ],
            },
        ]);
    });

    it('collapses a path listed more than once into one node', () => {
        const result = parseTreePaths(['users', 'users', 'users/a', 'users/b']);

        expect(result).toHaveLength(1);
        expect(result[0].children).toHaveLength(2);
    });

    it('preserves first-seen order at every level', () => {
        const result = parseTreePaths(['b/z', 'a', 'b/y']);

        expect(result.map((n) => n.id)).toEqual(['b', 'a']);
        expect(result[0].children?.map((n) => n.id)).toEqual(['b/z', 'b/y']);
    });

    it('ignores empty segments from leading, trailing and doubled delimiters', () => {
        expect(parseTreePaths(['/users/', 'users//employees'])).toEqual([
            {
                id: 'users',
                label: 'users',
                children: [
                    { id: 'users/employees', label: 'employees' },
                ],
            },
        ]);
    });

    it('skips paths that contain no usable segment', () => {
        expect(parseTreePaths(['', '/', '//'])).toEqual([]);
    });

    it('honours a custom delimiter', () => {
        expect(parseTreePaths(['a.b'], '.')).toEqual([
            {
                id: 'a.b'.slice(0, 1),
                label: 'a',
                children: [
                    { id: 'a.b', label: 'b' },
                ],
            },
        ]);
    });

    it('omits the children key entirely on leaves', () => {
        const [leaf] = parseTreePaths(['users']);

        expect(Object.hasOwn(leaf, 'children')).toBe(false);
    });
});
