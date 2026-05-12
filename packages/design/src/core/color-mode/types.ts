import type { ComputedRef, WritableComputedRef } from 'vue';

export type ColorMode = 'light' | 'dark' | 'system';

/**
 * Options for `useColorMode()`. Note that `useColorMode` is wrapped
 * with `createSharedComposable`, so these options are honored **only
 * on the first call**. Subsequent invocations from anywhere in the
 * app receive the cached instance — passing a different `storageKey`,
 * `initial`, or `syncClass` is a silent no-op.
 *
 * If you need a per-call configuration, call `bindColorMode()`
 * directly with your own reactive ref instead.
 */
export interface UseColorModeOptions {
    /** Initial mode when no persisted value exists. Default: `'system'`. */
    initial?: ColorMode;
    /** Persist via localStorage (`useStorage` from `@vueuse/core`). Default: `true`. */
    persist?: boolean;
    /** Storage key for the default backend. Default: `'vc-color-mode'`. */
    storageKey?: string;
    /** Toggle the `.dark` / `.light` class on `<html>`. Default: `true`. */
    syncClass?: boolean;
}

export interface UseColorModeReturn {
    /** Selected mode — may be `'system'` to defer to OS preference. */
    mode: WritableComputedRef<ColorMode>;
    /** Effective mode — never `'system'`; resolves to `'light'` or `'dark'`. */
    resolved: ComputedRef<'light' | 'dark'>;
    /**
     * Convenience boolean proxying `resolved.value === 'dark'`.
     * Writing `true` sets `mode` to `'dark'`; `false` sets `'light'`.
     */
    isDark: WritableComputedRef<boolean>;
    /** Flip between light and dark. Always sets a concrete mode (no `'system'`). */
    toggle(): void;
}
