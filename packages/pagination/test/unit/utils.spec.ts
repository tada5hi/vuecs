import { describe, expect, it } from 'vitest';
import { calculateOffset, calculatePage, calculatePagesTotal } from '../../src/utils';

describe('calculatePage', () => {
    it('should return 1 for offset 0', () => {
        expect(calculatePage({ offset: 0, limit: 10 })).toBe(1);
    });

    it('should return 2 for offset equal to limit', () => {
        expect(calculatePage({ offset: 10, limit: 10 })).toBe(2);
    });

    it('should return correct page for arbitrary offset', () => {
        expect(calculatePage({ offset: 25, limit: 10 })).toBe(3);
    });

    it('should return 1 for offset 0 with limit 1', () => {
        expect(calculatePage({ offset: 0, limit: 1 })).toBe(1);
    });
});

describe('calculatePagesTotal', () => {
    it('should return 1 for single page', () => {
        expect(calculatePagesTotal({ total: 5, limit: 10 })).toBe(1);
    });

    it('should return exact pages when total is multiple of limit', () => {
        expect(calculatePagesTotal({ total: 30, limit: 10 })).toBe(3);
    });

    it('should round up for partial pages', () => {
        expect(calculatePagesTotal({ total: 31, limit: 10 })).toBe(4);
    });

    it('should return 1 for zero total', () => {
        expect(calculatePagesTotal({ total: 0, limit: 10 })).toBe(1);
    });

    it('should return 1 minimum', () => {
        expect(calculatePagesTotal({ total: 0, limit: 100 })).toBe(1);
    });
});

describe('calculateOffset', () => {
    it('should return 0 for page 1', () => {
        expect(calculateOffset({ page: 1, limit: 10 })).toBe(0);
    });

    it('should return limit for page 2', () => {
        expect(calculateOffset({ page: 2, limit: 10 })).toBe(10);
    });

    it('should return correct offset for arbitrary page', () => {
        expect(calculateOffset({ page: 5, limit: 25 })).toBe(100);
    });
});
