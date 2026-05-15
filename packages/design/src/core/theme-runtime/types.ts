/**
 * Minimal structural projection of `@vuecs/core`'s `ThemeManager`.
 * Only the surface design composables actually need is declared
 * locally — keeps the bridge a runtime-only contract.
 */
export interface ThemeRuntimeColorModeHook {
    /**
     * Called when the resolved color mode changes (or on first mount).
     * Side-effecting — themes typically set framework-specific
     * attributes on `doc.documentElement`. Named `handle` (not `apply`)
     * to avoid collision with `Function.prototype.apply`.
     */
    handle(doc: Document, mode: 'light' | 'dark'): void;
}

export interface ThemeRuntimePaletteHook {
    /**
     * Pure function — receives the resolved palette config and returns
     * a CSS string. Named `handle` to align with
     * `ThemeRuntimeColorModeHook.handle`.
     */
    handle(palette: Record<string, string>): string;
    names?: readonly string[];
    /**
     * Optional canonical-scale → theme-scale rename map. The dispatcher
     * translates input keys before calling `handle`. See `PaletteHook`
     * in `@vuecs/core` for the authoring-side contract.
     */
    scaleAliases?: Record<string, string>;
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
