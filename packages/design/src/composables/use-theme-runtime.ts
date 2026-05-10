import { inject } from 'vue';

/**
 * Bridge between `@vuecs/design` and `@vuecs/core`'s `ThemeManager`
 * without a hard runtime dep. Both packages reference the same
 * `Symbol.for('VCThemeManager')` so the ThemeManager provided by
 * `installThemeManager(app)` (in `@vuecs/core`) is reachable from
 * design composables that need to walk installed themes' runtime hooks.
 *
 * `inject()` returns `undefined` if no ThemeManager is installed —
 * design composables use that as the "no theme dispatch" fallback so
 * they keep working in standalone apps that import `@vuecs/design`
 * without `@vuecs/core`.
 */
const THEME_MANAGER_SYMBOL = Symbol.for('VCThemeManager');

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
 * Look up the ThemeManager installed by `app.use(vuecs)` (or
 * `installThemeManager(app)`). Returns `undefined` if no manager is
 * provided in the current setup context — design composables fall back
 * to no-dispatch behaviour in that case.
 *
 * Must be called during `setup()` or another composable's setup phase
 * (Vue's `inject()` requirement).
 */
export function useThemeRuntimeManager(): ThemeRuntimeManager | undefined {
    return inject<ThemeRuntimeManager | undefined>(THEME_MANAGER_SYMBOL, undefined);
}

/**
 * Re-exported globally-shared symbol for the ThemeManager. SSR plugins
 * (Nuxt, future frameworks) that need to look up the manager from
 * outside Vue's component context use this with `app.runWithContext`
 * (or equivalent) + `inject`.
 *
 * `Symbol.for(...)` is reference-equal across module boundaries, so
 * `@vuecs/core`'s `installThemeManager()` and `@vuecs/design`'s
 * `useThemeRuntimeManager()` and any external SSR plumbing can all
 * agree on the same key without a runtime import dance.
 */
export const THEME_RUNTIME_MANAGER_SYMBOL: unique symbol = THEME_MANAGER_SYMBOL as never;

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
 * Build a synthetic Document-like that records `setAttribute` /
 * `removeAttribute` calls on `documentElement` into a record. Other DOM
 * operations are silently no-op'd so themes don't crash during SSR.
 *
 * Exposed for advanced consumers; the higher-level
 * `captureColorModeAttrs()` covers the common case.
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
    const attrs: Record<string, string> = {};
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
