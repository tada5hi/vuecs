import { 
    describe, 
    expect, 
    it, 
    vi, 
} from 'vitest';
import type { Slot, Slots } from 'vue';
import { hasNormalizedSlot, normalizeSlot } from '../../../src';

describe('hasNormalizedSlot', () => {
    it('returns true when the named slot exists', () => {
        const slots: Slots = { default: (() => []) as Slot };
        expect(hasNormalizedSlot('default', slots)).toBe(true);
    });

    it('returns false when the slot is missing', () => {
        expect(hasNormalizedSlot('default', {} as Slots)).toBe(false);
    });

    it('treats omitted $slots as no slots', () => {
        expect(hasNormalizedSlot('default')).toBe(false);
    });
});

describe('normalizeSlot', () => {
    it('invokes the slot with the given scope', () => {
        const fn = vi.fn(() => [{ type: 'div' } as any]);
        const slots: Slots = { item: fn as Slot };

        const result = normalizeSlot('item', { foo: 'bar' }, slots);

        expect(fn).toHaveBeenCalledWith({ foo: 'bar' });
        expect(result).toEqual([{ type: 'div' }]);
    });

    it('returns an empty array when the slot is missing', () => {
        expect(normalizeSlot('missing', {}, {} as Slots)).toEqual([]);
    });

    it('defaults scope and $slots to empty', () => {
        expect(normalizeSlot('any')).toEqual([]);
    });
});
