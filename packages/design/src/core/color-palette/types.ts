import type { ComputedRef } from 'vue';

export interface UseColorPaletteReturn<T> {
    /** Read-only view of the current palette. */
    current: ComputedRef<T>;
    /**
     * Replace the entire palette. Themes typically pass an empty config
     * to reset to defaults (the meaning of "empty" is theme-defined).
     */
    set(palette: T): void;
    /**
     * Merge `partial` over the current value via the theme's `extend`
     * implementation. Default semantics: shallow object spread. Themes
     * with non-object palette shapes pass their own via `BindColorPaletteOptions.extend`.
     */
    extend(partial: Partial<T>): void;
}

export interface BindColorPaletteOptions<T> {
    /** Render the palette value as a CSS string applied to `<style id="vc-color-palette">`. */
    render: (value: T) => string;
    /**
     * Override the default shallow-merge semantics of `extend()`. The
     * default works for any `Record`-shaped palette; themes with
     * structured non-object shapes (deep-merge, replace-on-conflict,
     * etc.) supply their own here.
     */
    extend: (current: T, partial: Partial<T>) => T;
    /**
     * Target a non-global Document (iframes, test environments).
     * Defaults to `globalThis.document`; on the server (`undefined`)
     * the watcher is still installed but `applyColorPaletteCss` is a
     * no-op — the first reactive read on the client triggers a re-paint.
     */
    document?: Document;
    /**
     * CSP nonce written to the `<style id="vc-color-palette">` element.
     * Accepts a string (resolved once) or a getter `() => string | undefined`
     * (called on every re-apply, so reactive nonce changes propagate).
     */
    nonce?: string | (() => string | undefined);
}

/**
 * Options for the generic theme-aware `useColorPalette()` dispatcher.
 *
 * `useColorPalette` is wrapped with `createSharedComposable`, so these
 * options are honored **only on the first call**. Subsequent invocations
 * from anywhere in the app receive the cached instance with the original
 * options — passing a different `storageKey`, `sanitize`, or `extend` is
 * a silent no-op. For per-call configuration with custom storage,
 * compose `bindColorPalette()` directly with your own ref.
 */
export interface UseColorPaletteOptions<T extends Record<string, unknown>> {
    /** Initial palette when no persisted value exists. Default: `{}` (cast to `T`). */
    initial?: T;
    /** Persist via localStorage (`useStorage` from `@vueuse/core`). Default: `true`. */
    persist?: boolean;
    /** Storage key for the default backend. Default: `'vc-color-palette'`. */
    storageKey?: string;
    /**
     * Theme-aware sanitizer for serialized values. Themes pass their own
     * (e.g. `@vuecs/theme-tailwind` filters to known semantic scales +
     * Tailwind palette names). Default: pass-through cast.
     */
    sanitize?: (raw: unknown) => T;
    /**
     * Override the default shallow-merge semantics of `extend()`. Default:
     * `{ ...current, ...partial }`. Themes with structured non-object
     * shapes supply their own.
     */
    extend?: (current: T, partial: Partial<T>) => T;
    /**
     * CSP nonce written to the `<style id="vc-color-palette">` element.
     * Accepts a string (resolved once) or a getter
     * `() => string | undefined` (called on every re-render, so reactive
     * nonce changes propagate). Per-theme wrappers in
     * `@vuecs/theme-tailwind` / `@vuecs/theme-bulma` read this from
     * `useConfig('nonce')` automatically.
     */
    nonce?: string | (() => string | undefined);
}
