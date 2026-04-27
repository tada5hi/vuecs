import { describe, expect, it } from 'vitest';
import { hasOwnProperty } from '../../../src';

describe('hasOwnProperty', () => {
    it('returns true for own properties', () => {
        expect(hasOwnProperty({ foo: 1 }, 'foo')).toBe(true);
    });

    it('returns false for missing properties', () => {
        expect(hasOwnProperty({ foo: 1 }, 'bar')).toBe(false);
    });

    it('returns false for inherited properties', () => {
        expect(hasOwnProperty({}, 'toString')).toBe(false);
    });

    it('handles symbol keys', () => {
        const sym = Symbol('x');
        expect(hasOwnProperty({ [sym]: 1 }, sym)).toBe(true);
        expect(hasOwnProperty({}, sym)).toBe(false);
    });
});
