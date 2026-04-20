import { describe, expect, it } from 'vitest';
import { extend, isExtendValue } from '../../../src/theme/extend';
import { EXTEND_SYMBOL } from '../../../src/theme/constants';

describe('extend', () => {
    it('should create an ExtendValue', () => {
        const result = extend('my-class');
        expect(result.__extend).toBe(EXTEND_SYMBOL);
        expect(result.value).toBe('my-class');
    });
});

describe('isExtendValue', () => {
    it('should return true for extend() result', () => {
        expect(isExtendValue(extend('test'))).toBe(true);
    });

    it('should return false for plain string', () => {
        expect(isExtendValue('test')).toBe(false);
    });

    it('should return false for null', () => {
        expect(isExtendValue(null)).toBe(false);
    });

    it('should return false for object with wrong symbol', () => {
        expect(isExtendValue({ __extend: Symbol('other'), value: 'test' })).toBe(false);
    });
});
