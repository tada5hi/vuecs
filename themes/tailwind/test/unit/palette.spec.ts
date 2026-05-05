// @vitest-environment jsdom
import { 
    afterEach, 
    describe, 
    expect, 
    it, 
} from 'vitest';
import { COLOR_PALETTE_STYLE_ELEMENT_ID } from '@vuecs/design';
import { renderColorPaletteStyles, setColorPalette } from '../../src/palette';

describe('renderColorPaletteStyles', () => {
    it('should return an empty string for an empty palette', () => {
        expect(renderColorPaletteStyles({})).toBe('');
    });

    it('should emit all 11 shades for each scale assignment', () => {
        const css = renderColorPaletteStyles({ primary: 'green' });
        expect(css).toContain(':root {');
        for (const shade of ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']) {
            expect(css).toContain(`--vc-color-primary-${shade}: var(--color-green-${shade});`);
        }
    });

    it('should emit declarations for every provided scale', () => {
        const css = renderColorPaletteStyles({
            primary: 'blue',
            success: 'emerald',
            error: 'rose',
        });
        expect(css).toContain('--vc-color-primary-500: var(--color-blue-500);');
        expect(css).toContain('--vc-color-success-500: var(--color-emerald-500);');
        expect(css).toContain('--vc-color-error-500: var(--color-rose-500);');
    });
});

describe('setColorPalette', () => {
    afterEach(() => {
        const existing = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        if (existing) existing.remove();
    });

    it('should be a no-op when no document is provided', () => {
        expect(() => setColorPalette({ primary: 'green' }, undefined)).not.toThrow();
    });

    it('should create a <style id="vc-color-palette"> element on first call', () => {
        setColorPalette({ primary: 'green' });
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style).not.toBeNull();
        expect(style!.tagName).toBe('STYLE');
        expect(style!.textContent).toContain('--vc-color-primary-500: var(--color-green-500);');
    });

    it('should replace the existing <style> content on subsequent calls', () => {
        setColorPalette({ primary: 'green' });
        setColorPalette({ primary: 'violet' });

        const styles = document.querySelectorAll(`style#${COLOR_PALETTE_STYLE_ELEMENT_ID}`);
        expect(styles.length).toBe(1);
        expect(styles[0].textContent).toContain('--vc-color-primary-500: var(--color-violet-500);');
        expect(styles[0].textContent).not.toContain('--color-green-500');
    });
});
