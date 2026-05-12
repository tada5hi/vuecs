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
} from '../../../../src/core/theme-runtime/capture';
import type { ThemeRuntimeEntry } from '../../../../src/core/theme-runtime/types';

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
                    handle(doc, mode) {
                        doc.documentElement.setAttribute('data-bs-theme', mode);
                    },
                },
            },
            {
                colorMode: {
                    handle(doc, mode) {
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

    it('returns an empty object when no theme declares colorMode.handle', () => {
        const themes: ThemeRuntimeEntry[] = [{}, { palette: { handle: () => '' } }];
        expect(captureColorModeAttrs(themes, 'light')).toEqual({});
    });

    it('honors install order — later theme wins on the same attribute', () => {
        const themes: ThemeRuntimeEntry[] = [
            {
                colorMode: {
                    handle(doc) {
                        doc.documentElement.setAttribute('shared', 'first');
                    },
                },
            },
            {
                colorMode: {
                    handle(doc) {
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
                    handle() {
                        throw new Error('boom');
                    },
                },
            },
            {
                colorMode: {
                    handle(doc, mode) {
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
        const handle = vi.fn();
        captureColorModeAttrs([{ colorMode: { handle } }], 'light');
        expect(handle).toHaveBeenCalledWith(expect.any(Object), 'light');
    });
});
