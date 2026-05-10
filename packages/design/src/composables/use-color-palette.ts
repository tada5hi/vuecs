import { createSharedComposable, useStorage } from '@vueuse/core';
import {
    computed,
    ref,
    watchEffect,
} from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { applyColorPaletteCss } from '../palette';
import type { UseColorPaletteReturn } from '../palette';
import { useThemeRuntimeManager } from './use-theme-runtime';

const DEFAULT_STORAGE_KEY = 'vc-color-palette';

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
}

function passthroughSanitize<T>(value: unknown): T {
    /*
     * Reject primitives and arrays: `JSON.parse('"blue"')` is valid and
     * returns a string. Without this guard a corrupted localStorage entry
     * would forward the primitive to `theme.palette.render`, which
     * expects an object and would emit broken CSS. Themes that need a
     * stricter shape pass their own `sanitize` (e.g. theme-tailwind
     * filters to known palette names).
     */
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {} as T;
    }
    return value as T;
}

const shallowMerge = <T extends Record<string, unknown>>(current: T, partial: Partial<T>): T => ({
    ...current,
    ...partial,
} as T);

/**
 * Theme-aware reactive palette state — un-shared variant.
 *
 * Concatenates every installed theme's `palette.render` output into the
 * `<style id="vc-color-palette">` element. Walking the installed themes
 * each render means runtime theme swaps via `setThemes()` automatically
 * pick up the new renderer chain.
 *
 * Concat (rather than last-wins) is the doctrinal semantic: when an app
 * stacks multiple palette-aware themes (the docs-site case where
 * Tailwind components and Bulma components share the same picker UI),
 * each theme's renderer emits its own non-overlapping CSS rules —
 * Tailwind rebinds `--vc-color-*`, Bulma writes per-variant HSL channel
 * vars. The CSS cascade resolves any incidental overlap with
 * later-rule-wins semantics, so concat behaves like last-wins for
 * overlapping properties AND emits both themes' unique properties.
 *
 * Production callers should use `useColorPalette` (the shared variant
 * below). This un-shared form is exposed primarily for testing — every
 * call creates a fresh `watchEffect` and palette state.
 */
export function useColorPaletteUnshared<
    T extends Record<string, unknown> = Record<string, string>,
>(options: UseColorPaletteOptions<T> = {}): UseColorPaletteReturn<T> {
    const {
        initial = {} as T,
        persist = true,
        storageKey = DEFAULT_STORAGE_KEY,
        sanitize = passthroughSanitize<T>,
        extend = shallowMerge,
    } = options;

    const manager = useThemeRuntimeManager();

    const storage: Ref<T> = persist ?
        useStorage<T>(storageKey, sanitize(initial), undefined, {
            serializer: {
                read: (raw): T => {
                    try {
                        return sanitize(JSON.parse(raw));
                    } catch {
                        return sanitize({});
                    }
                },
                write: (value) => JSON.stringify(value),
            },
        }) :
        ref<T>(sanitize(initial)) as Ref<T>;

    const renderConcatenated = (palette: T): string => {
        const themes = manager?.themes;
        if (!themes || themes.length === 0) return '';
        const parts: string[] = [];
        for (const theme of themes) {
            const render = theme.palette?.render;
            if (!render) continue;
            const out = render(palette as Record<string, string>);
            if (out) parts.push(out);
        }
        return parts.join('\n');
    };

    if (typeof document !== 'undefined') {
        /*
         * Reactive on both storage AND theme swaps: reading
         * `manager.themes` (a shallowRef-backed getter) inside the
         * effect subscribes to `setThemes()`. Reading `storage.value`
         * subscribes to palette changes. Either trigger re-renders the
         * `<style>` block.
         */
        watchEffect(() => {
            applyColorPaletteCss(renderConcatenated(storage.value));
        });
    }

    return {
        current: computed(() => storage.value) as ComputedRef<T>,
        set(palette) {
            storage.value = palette;
        },
        extend(partial) {
            storage.value = extend(storage.value, partial);
        },
    };
}

/**
 * Theme-aware reactive palette state with localStorage persistence
 * (plan 021 slice 2).
 *
 * Wrapped with `createSharedComposable` so every call site shares the
 * same ref + watcher. For SSR-aware cookie-backed storage (Nuxt), the
 * matching Nuxt module ships its own composable that calls
 * `bindColorPalette()` directly with a cookie-backed ref.
 */
export const useColorPalette = createSharedComposable(useColorPaletteUnshared);

export type { UseColorPaletteReturn } from '../palette';
