import { createSharedComposable, useStorage } from '@vueuse/core';
import type { ComputedRef, Ref } from 'vue';
import { computed, ref, watchEffect } from 'vue';
import { isObject } from '../../utils/object';
import { useThemeRuntimeManager } from '../theme-runtime/composable';
import { applyColorPaletteCss } from './apply';
import { COLOR_PALETTES, SEMANTIC_SCALES } from './catalog';
import { renderColorPaletteFromThemes } from './render';
import type { UseColorPaletteOptions, UseColorPaletteReturn } from './types';

const DEFAULT_STORAGE_KEY = 'vc-color-palette';

const SEMANTIC_SCALE_SET = new Set<string>(SEMANTIC_SCALES);
const PALETTE_NAME_SET = new Set<string>(COLOR_PALETTES);

function defaultSanitize<T>(value: unknown): T {
    /*
     * Defensive default: reject primitives + arrays, then filter to the
     * canonical catalog (six semantic scales × 22 palette names). Cookies
     * and localStorage can hold anything (older library version,
     * hand-edited DevTools value, payload written under the same key by
     * a different theme). Dropping unknown keys prevents broken CSS
     * downstream — the renderers each defend their inputs as a second
     * line of defense, but applying the filter at the dispatcher means
     * theme `palette.handle` hooks never see junk on the happy path.
     *
     * Themes whose palette config widens past the canonical catalog
     * (`ExtraColorPaletteNames` or a divergent scale set via
     * `scaleAliases`) pass their own `sanitize` to override.
     */
    if (!isObject(value)) {
        return {} as T;
    }

    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (
            SEMANTIC_SCALE_SET.has(k) &&
            typeof v === 'string' &&
            PALETTE_NAME_SET.has(v)
        ) {
            out[k] = v;
        }
    }
    return out as T;
}

const shallowMerge = <T extends Record<string, unknown>>(current: T, partial: Partial<T>): T => ({
    ...current,
    ...partial,
} as T);

/**
 * Theme-aware reactive palette state — un-shared variant.
 *
 * Concatenates every installed theme's `palette.handle` output into the
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
        source,
        persist = true,
        storageKey = DEFAULT_STORAGE_KEY,
        sanitize = defaultSanitize<T>,
        extend = shallowMerge,
        nonce,
    } = options;

    const resolveNonce: () => string | undefined = typeof nonce === 'function' ?
        nonce :
        () => nonce;

    const manager = useThemeRuntimeManager();

    /*
     * `source` lets external persistence layers (Nuxt's `useCookie`,
     * custom IndexedDB-backed refs, etc.) replace the default storage
     * without forking the dispatch logic. When provided, `persist` /
     * `storageKey` / `initial` are ignored — the caller is responsible
     * for the initial value and any persistence semantics.
     */
    const storage: Ref<T> = source ??
        (persist ?
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
            ref<T>(sanitize(initial)) as Ref<T>);

    const renderConcatenated = (palette: T): string => {
        const themes = manager?.themes;
        if (!themes || themes.length === 0) {
            return '';
        }

        /*
         * Sanitize at the render boundary so the `source`-provided path
         * (Nuxt cookie, custom IndexedDB, etc.) gets the same defensive
         * filter as the default `useStorage` path (which sanitizes at
         * `serializer.read` time). Theme `palette.handle` hooks should
         * never see primitives, arrays, or other malformed payloads —
         * downstream theme renderers each filter their own input, but
         * applying `sanitize` here keeps the per-theme filter as a
         * second line of defense rather than the only one.
         */
        const sanitized = sanitize(palette);
        return renderColorPaletteFromThemes(themes, sanitized as Record<string, string>);
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
            applyColorPaletteCss(renderConcatenated(storage.value), undefined, resolveNonce());
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
