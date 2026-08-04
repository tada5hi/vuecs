import { describe, expect, it } from 'vitest';
import { COLOR_MODES, isColorMode } from '../../../../src/core/color-mode/catalog';

describe('COLOR_MODES', () => {
    it('holds the canonical vocabulary', () => {
        expect(COLOR_MODES).toEqual(['light', 'dark', 'system']);
    });
});

describe('isColorMode', () => {
    it('accepts every catalog entry', () => {
        for (const mode of COLOR_MODES) {
            expect(isColorMode(mode)).toBe(true);
        }
    });

    it('rejects foreign strings', () => {
        expect(isColorMode('')).toBe(false);
        expect(isColorMode('auto')).toBe(false);
        expect(isColorMode('Dark')).toBe(false);
        expect(isColorMode('système')).toBe(false);
    });

    it('rejects non-string values', () => {
        expect(isColorMode(undefined)).toBe(false);
        expect(isColorMode(null)).toBe(false);
        expect(isColorMode(0)).toBe(false);
        expect(isColorMode({})).toBe(false);
        expect(isColorMode(['dark'])).toBe(false);
    });

    it('does not report inherited Object.prototype keys as modes', () => {
        // Guards against a plain-object lookup implementation, where
        // `'toString'` / `'constructor'` would resolve truthy.
        expect(isColorMode('toString')).toBe(false);
        expect(isColorMode('constructor')).toBe(false);
    });

    it('narrows the value for downstream consumers', () => {
        const raw: unknown = 'dark';
        if (isColorMode(raw)) {
            // Type-level assertion — `raw` is `ColorMode` inside this branch,
            // so assigning it to the union compiles without a cast.
            const mode: 'light' | 'dark' | 'system' = raw;
            expect(mode).toBe('dark');
        } else {
            expect.unreachable('isColorMode should accept "dark"');
        }
    });
});
