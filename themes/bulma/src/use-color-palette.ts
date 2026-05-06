import { bindColorPalette } from '@vuecs/design';
import type { UseColorPaletteReturn } from '@vuecs/design';
import { createSharedComposable, useStorage } from '@vueuse/core';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { SEMANTIC_SCALES, TAILWIND_COLOR_PALETTES } from './constants';
import { renderColorPaletteStyles } from './palette';
import type { ColorPaletteConfig, SemanticScaleName, TailwindColorPaletteName } from './types';

/**
 * Options for `useColorPalette()`. Mirrors `@vuecs/theme-tailwind`'s
 * SPA composable; both share the same `vc-color-palette` storage key
 * so consumers can swap themes at the docs / playground level without
 * losing state.
 *
 * `useColorPalette` is wrapped with `createSharedComposable`, so options
 * are honored only on the **first call**. Subsequent invocations from
 * anywhere in the app receive the cached instance with the original
 * options — passing a different `storageKey` or `initial` is a silent
 * no-op. For per-call configuration, call `bindColorPalette()` from
 * `@vuecs/design` directly.
 */
export interface UseColorPaletteOptions {
    /** Initial palette when no persisted value exists. Default: `{}`. */
    initial?: ColorPaletteConfig;
    /** Persist via localStorage (`useStorage` from `@vueuse/core`). Default: `true`. */
    persist?: boolean;
    /** Storage key for the default backend. Default: `'vc-color-palette'`. */
    storageKey?: string;
}

const DEFAULT_STORAGE_KEY = 'vc-color-palette';

const TAILWIND_PALETTE_SET = new Set<string>(TAILWIND_COLOR_PALETTES);

/*
 * Defensive sanitizer: localStorage / cookies can hold anything (older
 * library version, hand-edited DevTools value, payload written by
 * theme-tailwind under the same key). Drop unknown semantic scales and
 * non-Tailwind palette names rather than passing junk to the renderer,
 * which would emit invalid HSL channels.
 */
const sanitize = (value: unknown): ColorPaletteConfig => {
    if (!value || typeof value !== 'object') return {};
    const input = value as Record<string, unknown>;
    const out: ColorPaletteConfig = {};
    for (const scale of SEMANTIC_SCALES) {
        const candidate = input[scale];
        if (typeof candidate === 'string' && TAILWIND_PALETTE_SET.has(candidate)) {
            out[scale as SemanticScaleName] = candidate as TailwindColorPaletteName;
        }
    }
    return out;
};

/**
 * Reactive Bulma-palette state with localStorage persistence (via
 * VueUse's `useStorage`). Wrapped with `createSharedComposable` so every
 * call site shares the same ref, watcher, and applied DOM state.
 *
 * Storage key (`vc-color-palette`) is intentionally shared with
 * `@vuecs/theme-tailwind`'s SPA composable: when an app loads both
 * themes (e.g. the vuecs docs site demos), the same payload drives both
 * — Tailwind components get the Tailwind renderer, Bulma components get
 * the Bulma renderer, and a single picker UI controls both.
 */
export const useColorPalette = createSharedComposable(
    (options: UseColorPaletteOptions = {}): UseColorPaletteReturn<ColorPaletteConfig> => {
        const {
            initial = {},
            persist = true,
            storageKey = DEFAULT_STORAGE_KEY,
        } = options;

        const storage: Ref<ColorPaletteConfig> = persist ?
            useStorage<ColorPaletteConfig>(storageKey, sanitize(initial), undefined, {
                serializer: {
                    read: (raw): ColorPaletteConfig => {
                        try {
                            return sanitize(JSON.parse(raw));
                        } catch {
                            return {};
                        }
                    },
                    write: (value) => JSON.stringify(value),
                },
            }) :
            ref<ColorPaletteConfig>(sanitize(initial));

        return bindColorPalette(storage, {
            render: renderColorPaletteStyles,
            extend: (current, partial) => ({ ...current, ...partial }),
        });
    },
);

export type { UseColorPaletteReturn } from '@vuecs/design';
