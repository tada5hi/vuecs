// @vitest-environment jsdom
import { 
    afterEach, 
    describe, 
    expect, 
    it, 
} from 'vitest';
import { applyPalette, renderPaletteStyles } from '../../src/palette';
import { PALETTE_STYLE_ELEMENT_ID } from '../../src/constants';

describe('renderPaletteStyles', () => {
    it('should return an empty string for an empty palette', () => {
        expect(renderPaletteStyles({})).toBe('');
    });

    it('should emit all 11 shades for each scale assignment', () => {
        const css = renderPaletteStyles({ primary: 'green' });
        expect(css).toContain(':root {');
        for (const shade of ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']) {
            expect(css).toContain(`--vc-color-primary-${shade}: var(--color-green-${shade});`);
        }
    });

    it('should emit declarations for every provided scale', () => {
        const css = renderPaletteStyles({
            primary: 'blue',
            success: 'emerald',
            error: 'rose',
        });
        expect(css).toContain('--vc-color-primary-500: var(--color-blue-500);');
        expect(css).toContain('--vc-color-success-500: var(--color-emerald-500);');
        expect(css).toContain('--vc-color-error-500: var(--color-rose-500);');
    });
});

describe('applyPalette', () => {
    afterEach(() => {
        const existing = document.getElementById(PALETTE_STYLE_ELEMENT_ID);
        if (existing) existing.remove();
    });

    it('should be a no-op when no document is provided', () => {
        expect(() => applyPalette({ primary: 'green' }, undefined)).not.toThrow();
    });

    it('should create a <style id="vc-palette"> element on first call', () => {
        applyPalette({ primary: 'green' });
        const style = document.getElementById(PALETTE_STYLE_ELEMENT_ID);
        expect(style).not.toBeNull();
        expect(style!.tagName).toBe('STYLE');
        expect(style!.textContent).toContain('--vc-color-primary-500: var(--color-green-500);');
    });

    it('should replace the existing <style> content on subsequent calls', () => {
        applyPalette({ primary: 'green' });
        applyPalette({ primary: 'violet' });

        const styles = document.querySelectorAll(`style#${PALETTE_STYLE_ELEMENT_ID}`);
        expect(styles.length).toBe(1);
        expect(styles[0].textContent).toContain('--vc-color-primary-500: var(--color-violet-500);');
        expect(styles[0].textContent).not.toContain('--color-green-500');
    });
});
