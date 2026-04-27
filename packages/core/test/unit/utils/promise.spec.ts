import { describe, expect, it } from 'vitest';
import { isPromise } from '../../../src';

describe('isPromise', () => {
    it('detects native Promise instances', () => {
        expect(isPromise(Promise.resolve(1))).toBe(true);
    });

    it('detects thenable objects', () => {
        expect(isPromise({ then: () => undefined })).toBe(true);
    });

    it('returns false for non-objects', () => {
        expect(isPromise(undefined)).toBe(false);
        expect(isPromise(null)).toBe(false);
        expect(isPromise(42)).toBe(false);
        expect(isPromise('promise')).toBe(false);
    });

    it('returns false for plain objects without `then`', () => {
        expect(isPromise({})).toBe(false);
        expect(isPromise({ value: 1 })).toBe(false);
    });

    it('returns false for arrays', () => {
        expect(isPromise([])).toBe(false);
    });
});
