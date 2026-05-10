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
