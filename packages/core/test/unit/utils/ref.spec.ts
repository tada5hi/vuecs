import { describe, expect, it } from 'vitest';
import { readonly, ref } from 'vue';
import {
    extendMaybeRefArrayValue,
    findIndexOfMaybeRefArray,
    getMaybeRefArrayValue,
    pushMaybeRefArrayValue,
    setMaybeRefValue,
    spliceMaybeRefArray,
    unrefWithDefault,
} from '../../../src';

describe('unrefWithDefault', () => {
    it('returns the unwrapped ref value', () => {
        expect(unrefWithDefault(ref('value'), 'fallback')).toBe('value');
    });

    it('returns the plain value as-is', () => {
        expect(unrefWithDefault('value', 'fallback')).toBe('value');
    });

    it('returns the fallback when the value unwraps to undefined', () => {
        expect(unrefWithDefault(ref(undefined as unknown as string), 'fallback')).toBe('fallback');
        expect(unrefWithDefault(undefined as unknown as string, 'fallback')).toBe('fallback');
    });
});

describe('setMaybeRefValue', () => {
    it('writes to a writable ref', () => {
        const r = ref('a');
        setMaybeRefValue(r, 'b');
        expect(r.value).toBe('b');
    });

    it('is a no-op for a readonly ref', () => {
        const r = ref('a');
        const ro = readonly(r);
        setMaybeRefValue(ro as any, 'b');
        expect(r.value).toBe('a');
    });

    it('is a no-op for a plain value', () => {
        // plain string is immutable; calling shouldn't throw or mutate anything observable
        expect(() => setMaybeRefValue('a', 'b')).not.toThrow();
    });
});

describe('pushMaybeRefArrayValue', () => {
    it('pushes onto a ref array', () => {
        const r = ref([1, 2]);
        pushMaybeRefArrayValue(r, 3);
        expect(r.value).toEqual([1, 2, 3]);
    });

    it('pushes onto a plain array', () => {
        const arr = [1, 2];
        pushMaybeRefArrayValue(arr, 3);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('returns the pushed value', () => {
        expect(pushMaybeRefArrayValue([1], 99)).toBe(99);
    });
});

describe('spliceMaybeRefArray', () => {
    it('splices a ref array', () => {
        const r = ref([1, 2, 3, 4]);
        spliceMaybeRefArray(r, 1, 2);
        expect(r.value).toEqual([1, 4]);
    });

    it('splices a plain array', () => {
        const arr = [1, 2, 3, 4];
        spliceMaybeRefArray(arr, 1, 2);
        expect(arr).toEqual([1, 4]);
    });
});

describe('getMaybeRefArrayValue', () => {
    it('reads from a ref array', () => {
        const r = ref(['a', 'b']);
        expect(getMaybeRefArrayValue(r, 1)).toBe('b');
    });

    it('reads from a plain array', () => {
        expect(getMaybeRefArrayValue(['a', 'b'], 0)).toBe('a');
    });
});

describe('extendMaybeRefArrayValue', () => {
    it('merges into an object element of a ref array', () => {
        const r = ref<Record<string, any>[]>([{ a: 1 }, { b: 2 }]);
        extendMaybeRefArrayValue(r, 0, { c: 3 });
        expect(r.value[0]).toEqual({ a: 1, c: 3 });
    });

    it('merges into an object element of a plain array', () => {
        const arr: Record<string, any>[] = [{ a: 1 }];
        extendMaybeRefArrayValue(arr, 0, { b: 2 });
        expect(arr[0]).toEqual({ a: 1, b: 2 });
    });

    it('returns the input unchanged when the new value is not object-like', () => {
        const arr = [{ a: 1 }];
        const result = extendMaybeRefArrayValue(arr as any, 0, 42 as any);
        expect(result).toBe(arr);
        expect(arr[0]).toEqual({ a: 1 });
    });

    it('returns the input unchanged when the existing element is not object-like', () => {
        const arr: any[] = ['scalar'];
        const result = extendMaybeRefArrayValue(arr, 0, { a: 1 });
        expect(result).toBe(arr);
        expect(arr[0]).toBe('scalar');
    });

    it('merges into array-typed elements', () => {
        const arr: number[][] = [[1, 2]];
        extendMaybeRefArrayValue(arr as any, 0, [3, 4] as any);
        expect(arr[0]).toEqual(expect.arrayContaining([1, 2, 3, 4]));
    });
});

describe('findIndexOfMaybeRefArray', () => {
    it('finds an index in a ref array', () => {
        const r = ref([10, 20, 30]);
        expect(findIndexOfMaybeRefArray(r, (x) => x === 20)).toBe(1);
    });

    it('finds an index in a plain array', () => {
        expect(findIndexOfMaybeRefArray([10, 20, 30], (x) => x === 30)).toBe(2);
    });

    it('returns -1 when not found', () => {
        expect(findIndexOfMaybeRefArray([1, 2, 3], (x) => x === 99)).toBe(-1);
    });
});
