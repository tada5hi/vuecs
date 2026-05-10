import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    captureColorModeAttrs,
    createCaptureDocument,
    renderColorPaletteFromThemes,
} from '../../../src/composables/use-theme-runtime';
import type { ThemeRuntimeEntry } from '../../../src/composables/use-theme-runtime';

describe('createCaptureDocument', () => {
    it('captures setAttribute calls on documentElement', () => {
        const target: Record<string, string> = {};
        const doc = createCaptureDocument(target);
        doc.documentElement.setAttribute('data-bs-theme', 'dark');
        expect(target).toEqual({ 'data-bs-theme': 'dark' });
    });

    it('removes attributes via removeAttribute', () => {
        const target: Record<string, string> = { 'data-bs-theme': 'dark' };
        const doc = createCaptureDocument(target);
        doc.documentElement.removeAttribute('data-bs-theme');
        expect(target).toEqual({});
    });

    it('exposes a no-op classList that does not throw', () => {
        const target: Record<string, string> = {};
        const doc = createCaptureDocument(target);
        expect(() => {
            doc.documentElement.classList.add('foo');
            doc.documentElement.classList.remove('foo');
            doc.documentElement.classList.toggle('foo');
        }).not.toThrow();
    });
});

describe('captureColorModeAttrs', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('captures attribute mutations from each theme', () => {
        const themes: ThemeRuntimeEntry[] = [
            {
                colorMode: {
                    apply(doc, mode) {
                        doc.documentElement.setAttribute('data-bs-theme', mode);
                    },
                },
            },
            {
                colorMode: {
                    apply(doc, mode) {
                        doc.documentElement.setAttribute('data-theme', mode);
                    },
                },
            },
        ];

        const attrs = captureColorModeAttrs(themes, 'dark');
        expect(attrs).toEqual({
            'data-bs-theme': 'dark',
            'data-theme': 'dark',
        });
    });

    it('returns an empty object when no theme declares colorMode.apply', () => {
        const themes: ThemeRuntimeEntry[] = [{}, { palette: { render: () => '' } }];
        expect(captureColorModeAttrs(themes, 'light')).toEqual({});
    });

    it('honors install order — later theme wins on the same attribute', () => {
        const themes: ThemeRuntimeEntry[] = [
            {
                colorMode: {
                    apply(doc) {
                        doc.documentElement.setAttribute('shared', 'first');
                    },
                },
            },
            {
                colorMode: {
                    apply(doc) {
                        doc.documentElement.setAttribute('shared', 'second');
                    },
                },
            },
        ];
        expect(captureColorModeAttrs(themes, 'light').shared).toBe('second');
    });

    it('isolates errors per theme — one bad theme does not break the others', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const themes: ThemeRuntimeEntry[] = [
            {
                colorMode: {
                    apply() {
                        throw new Error('boom');
                    },
                },
            },
            {
                colorMode: {
                    apply(doc, mode) {
                        doc.documentElement.setAttribute('data-theme', mode);
                    },
                },
            },
        ];
        const attrs = captureColorModeAttrs(themes, 'dark');
        expect(attrs).toEqual({ 'data-theme': 'dark' });
        expect(warn).toHaveBeenCalled();
    });

    it('passes the resolved mode through unchanged', () => {
        const apply = vi.fn();
        captureColorModeAttrs([{ colorMode: { apply } }], 'light');
        expect(apply).toHaveBeenCalledWith(expect.any(Object), 'light');
    });
});

describe('renderColorPaletteFromThemes', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('concatenates outputs from every palette-aware theme', () => {
        const themes: ThemeRuntimeEntry[] = [
            { palette: { render: (p) => `/* tailwind */ --primary: ${p.primary};` } },
            { palette: { render: (p) => `/* bulma */ --bulma-primary: ${p.primary};` } },
        ];
        const css = renderColorPaletteFromThemes(themes, { primary: 'green' });
        expect(css).toContain('--primary: green');
        expect(css).toContain('--bulma-primary: green');
        expect(css.indexOf('--primary')).toBeLessThan(css.indexOf('--bulma-primary'));
    });

    it('returns empty string when no theme declares palette.render', () => {
        const themes: ThemeRuntimeEntry[] = [{ colorMode: { apply: () => {} } }, {}];
        expect(renderColorPaletteFromThemes(themes, { primary: 'red' })).toBe('');
    });

    it('skips themes whose render returns empty', () => {
        const themes: ThemeRuntimeEntry[] = [
            { palette: { render: () => '' } },
            { palette: { render: (p) => `--primary: ${p.primary};` } },
        ];
        expect(renderColorPaletteFromThemes(themes, { primary: 'red' })).toBe('--primary: red;');
    });

    it('isolates errors per theme', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const themes: ThemeRuntimeEntry[] = [
            {
                palette: {
                    render() {
                        throw new Error('boom');
                    },
                },
            },
            { palette: { render: (p) => `--primary: ${p.primary};` } },
        ];
        const css = renderColorPaletteFromThemes(themes, { primary: 'red' });
        expect(css).toBe('--primary: red;');
        expect(warn).toHaveBeenCalled();
    });
});
