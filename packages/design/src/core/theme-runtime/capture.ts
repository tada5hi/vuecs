import type { ThemeRuntimeEntry } from './types';

/*
 * SSR capture utilities (plan 021 slice 3).
 *
 * On the client, `bindColorMode` and `useColorPalette` walk installed
 * themes and dispatch through their hooks against the live `document`.
 * On the server there is no `document` — but Nuxt SSR plugins still
 * need to flow the same theme-specific markers (`data-bs-theme` /
 * `data-theme` for color mode, `<style id="vc-color-palette">` for
 * palette) into the rendered head before first paint.
 *
 * The pattern: run themes' `colorMode.handle` against a synthetic
 * Document-like object that captures attribute mutations into a plain
 * record. The Nuxt plugin then plumbs the captured record into
 * `useHead({ htmlAttrs })`.
 *
 * Themes that need DOM operations beyond `setAttribute` /
 * `removeAttribute` / `classList` (e.g. inserting child nodes) are not
 * SSR-friendly via this helper; their CSR-only logic should guard with
 * `if (typeof window === 'undefined') return;`.
 */

/**
 * Build a synthetic Document-like whose `documentElement` records
 * `setAttribute` / `removeAttribute` calls into the supplied target
 * record, plus a no-op `classList`. **No other Document or Element
 * APIs are stubbed** — themes that call `doc.createElement`,
 * `doc.head.appendChild`, etc. WILL throw at SSR runtime. Themes
 * needing richer DOM access from `colorMode.handle` should guard their
 * CSR-only logic with `if (typeof window === 'undefined') return;`
 * and split the SSR-flowing bits into declarative `setAttribute` calls.
 *
 * Exposed for advanced consumers; the higher-level
 * `captureColorModeAttrs()` covers the common case and catches errors
 * per theme so a single broken theme can't crash SSR.
 */
export function createCaptureDocument(target: Record<string, string>): Document {
    const noopClassList = {
        add() {},
        remove() {},
        toggle(): boolean {
            return false;
        },
        contains(): boolean {
            return false;
        },
        replace() {},
    };

    const documentElement = {
        setAttribute(name: string, value: string): void {
            target[name] = value;
        },
        removeAttribute(name: string): void {
            delete target[name];
        },
        classList: noopClassList,
    };

    return { documentElement } as unknown as Document;
}

/**
 * Walk every installed theme's `colorMode.handle` against a synthetic
 * Document and capture the resulting attribute mutations. SSR plugins
 * use this to flow `data-bs-theme` / `data-theme` (or any other
 * attribute a theme declares) into `useHead({ htmlAttrs })` before
 * first paint.
 *
 * Each theme's handler runs in install order. If multiple themes set
 * the same attribute, the last one wins — same semantic as the live
 * `document.documentElement.setAttribute` chain on the client.
 *
 * Errors thrown by a theme's handler are caught + logged as a warning
 * so one malformed theme can't crash SSR; other themes still run.
 */
export function captureColorModeAttrs(
    themes: readonly ThemeRuntimeEntry[],
    mode: 'light' | 'dark',
): Record<string, string> {
    /*
     * Use a prototype-free record: attribute names come from theme
     * code (potentially third-party), and a key like `__proto__` could
     * theoretically poison the result if it later gets merged into
     * another object via `Object.assign` (which uses `[[Set]]` and
     * triggers the prototype setter). `Object.create(null)` avoids the
     * concern entirely without any functional downside.
     */
    const attrs: Record<string, string> = Object.create(null) as Record<string, string>;
    const fakeDoc = createCaptureDocument(attrs);

    for (const theme of themes) {
        if (!theme.colorMode?.handle) {
            continue;
        }

        const handle = theme.colorMode?.handle.bind(theme.colorMode);

        try {
            handle(fakeDoc, mode);
        } catch (e) {
            if (typeof console !== 'undefined') {
                // eslint-disable-next-line no-console
                console.warn('[vuecs] theme colorMode.handle failed; skipping:', e);
            }
        }
    }

    return attrs;
}
