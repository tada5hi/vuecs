import { inject } from 'vue';
import type { InjectionKey } from 'vue';

/**
 * Minimal structural projection of `@vuecs/core`'s `ThemeManager`.
 * Only the surface design composables actually need is declared
 * locally — keeps the bridge a runtime-only contract.
 */
export interface ThemeRuntimeColorModeHook {
    apply(doc: Document, mode: 'light' | 'dark'): void;
}

export interface ThemeRuntimePaletteHook {
    render(palette: Record<string, string>): string;
    names?: readonly string[];
}

export interface ThemeRuntimeEntry {
    colorMode?: ThemeRuntimeColorModeHook;
    palette?: ThemeRuntimePaletteHook;
}

export interface ThemeRuntimeManager {
    /**
     * Reactive list of installed themes (reads through `ThemeManager`'s
     * `shallowRef`, so accessing this inside a `watch` callback tracks
     * theme swaps via `setThemes()`).
     */
    readonly themes: readonly ThemeRuntimeEntry[];
}

/**
 * Globally-shared `InjectionKey` for the ThemeManager. SSR plugins
 * (Nuxt, future frameworks) that need to look up the manager from
 * outside Vue's component context use this with `app.runWithContext`
 * (or equivalent) + `inject`.
 *
 * Bridge between `@vuecs/design` and `@vuecs/core`'s `ThemeManager`
 * without a hard runtime dep: both packages reference the same
 * `Symbol.for('VCThemeManager')` registry key, so the ThemeManager
 * provided by `installThemeManager(app)` (in `@vuecs/core`) is
 * reachable here. `Symbol.for(...)` is reference-equal across module
 * boundaries, and the `InjectionKey<ThemeRuntimeManager>` cast
 * surfaces the manager type to `inject()` callers without leaking
 * `@vuecs/core` internals.
 *
 * `inject()` returns `undefined` if no ThemeManager is installed —
 * design composables use that as the "no theme dispatch" fallback so
 * they keep working in standalone apps that import `@vuecs/design`
 * without `@vuecs/core`.
 */
export const THEME_RUNTIME_MANAGER_SYMBOL = Symbol.for('VCThemeManager') as InjectionKey<ThemeRuntimeManager>;

/**
 * Look up the ThemeManager installed by `app.use(vuecs)` (or
 * `installThemeManager(app)`). Returns `undefined` if no manager is
 * provided in the current setup context — design composables fall back
 * to no-dispatch behaviour in that case.
 *
 * Must be called during `setup()` or another composable's setup phase
 * (Vue's `inject()` requirement).
 */
export function useThemeRuntimeManager(): ThemeRuntimeManager | undefined {
    return inject(THEME_RUNTIME_MANAGER_SYMBOL, undefined);
}

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
 * The pattern: run themes' `colorMode.apply` against a synthetic
 * Document-like object that captures attribute mutations into a plain
 * record. The Nuxt plugin then plumbs the captured record into
 * `useHead({ htmlAttrs })`. For palette, just concatenate every theme's
 * `palette.render` output and emit one `<style>` block.
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
 * needing richer DOM access from `colorMode.apply` should guard their
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
 * Walk every installed theme's `colorMode.apply` against a synthetic
 * Document and capture the resulting attribute mutations. SSR plugins
 * use this to flow `data-bs-theme` / `data-theme` (or any other
 * attribute a theme declares) into `useHead({ htmlAttrs })` before
 * first paint.
 *
 * Each theme's apply runs in install order. If multiple themes set the
 * same attribute, the last one wins — same semantic as the live
 * `document.documentElement.setAttribute` chain on the client.
 *
 * Errors thrown by a theme's apply are caught + logged as a warning so
 * one malformed theme can't crash SSR; other themes still run.
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
        const apply = theme.colorMode?.apply;
        if (!apply) continue;
        try {
            apply(fakeDoc, mode);
        } catch (e) {
            if (typeof console !== 'undefined') {
                // eslint-disable-next-line no-console
                console.warn('[vuecs] theme colorMode.apply failed during SSR; skipping:', e);
            }
        }
    }

    return attrs;
}

/**
 * Concatenate every installed theme's `palette.render` output into a
 * single CSS string. SSR plugins emit the result as the
 * `<style id="vc-color-palette">` block so palette-aware themes flow
 * on first paint.
 *
 * Mirrors the client-side concat semantics in `useColorPalette()`:
 * non-overlapping rules from different themes coexist; CSS cascade
 * resolves any incidental overlap with later-rule-wins.
 */
export function renderColorPaletteFromThemes(
    themes: readonly ThemeRuntimeEntry[],
    palette: Record<string, string>,
): string {
    const parts: string[] = [];
    for (const theme of themes) {
        const render = theme.palette?.render;
        if (!render) continue;
        try {
            const out = render(palette);
            if (out) parts.push(out);
        } catch (e) {
            if (typeof console !== 'undefined') {
                // eslint-disable-next-line no-console
                console.warn('[vuecs] theme palette.render failed during SSR; skipping:', e);
            }
        }
    }
    return parts.join('\n');
}
