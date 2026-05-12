import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { renderColorPaletteFromThemes } from '../../../../src/core/color-palette/render';
import type { ThemeRuntimeEntry } from '../../../../src/core/theme-runtime/types';

describe('renderColorPaletteFromThemes', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('concatenates outputs from every palette-aware theme', () => {
        const themes: ThemeRuntimeEntry[] = [
            { palette: { handle: (p) => `/* tailwind */ --primary: ${p.primary};` } },
            { palette: { handle: (p) => `/* bulma */ --bulma-primary: ${p.primary};` } },
        ];
        const css = renderColorPaletteFromThemes(themes, { primary: 'green' });
        expect(css).toContain('--primary: green');
        expect(css).toContain('--bulma-primary: green');
        expect(css.indexOf('--primary')).toBeLessThan(css.indexOf('--bulma-primary'));
    });

    it('returns empty string when no theme declares palette.handle', () => {
        const themes: ThemeRuntimeEntry[] = [{ colorMode: { handle: () => {} } }, {}];
        expect(renderColorPaletteFromThemes(themes, { primary: 'red' })).toBe('');
    });

    it('skips themes whose render returns empty', () => {
        const themes: ThemeRuntimeEntry[] = [
            { palette: { handle: () => '' } },
            { palette: { handle: (p) => `--primary: ${p.primary};` } },
        ];
        expect(renderColorPaletteFromThemes(themes, { primary: 'red' })).toBe('--primary: red;');
    });

    it('isolates errors per theme', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const themes: ThemeRuntimeEntry[] = [
            {
                palette: {
                    handle() {
                        throw new Error('boom');
                    },
                },
            },
            { palette: { handle: (p) => `--primary: ${p.primary};` } },
        ];
        const css = renderColorPaletteFromThemes(themes, { primary: 'red' });
        expect(css).toBe('--primary: red;');
        expect(warn).toHaveBeenCalled();
    });
});
