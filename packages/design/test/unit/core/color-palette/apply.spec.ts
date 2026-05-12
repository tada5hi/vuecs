// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import {
    COLOR_PALETTE_STYLE_ELEMENT_ID,
    applyColorPaletteCss,
} from '../../../../src/core/color-palette/apply';

describe('applyColorPaletteCss', () => {
    afterEach(() => {
        document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.remove();
    });

    it('is a no-op when no document is provided', () => {
        expect(() => applyColorPaletteCss(':root { --x: 1; }', undefined)).not.toThrow();
    });

    it('inserts a <style id="vc-color-palette"> on first call', () => {
        applyColorPaletteCss(':root { --x: 1; }');
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style).not.toBeNull();
        expect(style!.tagName).toBe('STYLE');
        expect(style!.textContent).toBe(':root { --x: 1; }');
    });

    it('replaces the existing <style> content on subsequent calls', () => {
        applyColorPaletteCss(':root { --x: 1; }');
        applyColorPaletteCss(':root { --x: 2; }');
        const styles = document.querySelectorAll(`style#${COLOR_PALETTE_STYLE_ELEMENT_ID}`);
        expect(styles.length).toBe(1);
        expect(styles[0].textContent).toBe(':root { --x: 2; }');
    });

    it('writes a nonce attribute when the third arg is set', () => {
        applyColorPaletteCss(':root { --x: 1; }', document, 'abc123');
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.getAttribute('nonce')).toBe('abc123');
    });

    it('updates the nonce attribute when the value changes', () => {
        applyColorPaletteCss(':root { --x: 1; }', document, 'first');
        applyColorPaletteCss(':root { --x: 2; }', document, 'second');
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.getAttribute('nonce')).toBe('second');
    });

    it('removes the nonce attribute when subsequent calls pass undefined', () => {
        applyColorPaletteCss(':root { --x: 1; }', document, 'abc');
        applyColorPaletteCss(':root { --x: 2; }', document);
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.hasAttribute('nonce')).toBe(false);
    });

    it('does not set nonce when undefined on initial call', () => {
        applyColorPaletteCss(':root { --x: 1; }');
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.hasAttribute('nonce')).toBe(false);
    });
});
