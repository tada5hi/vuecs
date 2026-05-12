import { useConfig } from '@vuecs/core';
import {
    COLOR_PALETTES,
    SEMANTIC_SCALES,
    useColorPalette as useColorPaletteCore,
} from '@vuecs/design';
import type {
    ColorPaletteName,
    SemanticScaleName,
    UseColorPaletteReturn,
} from '@vuecs/design';
import type { ColorPaletteConfig } from './types';

/**
 * Options for `useColorPalette()`. Note that the underlying
 * generic dispatcher (in `@vuecs/design`) is wrapped with
 * `createSharedComposable`, so these options are honored **only on
 * the first call**. Subsequent invocations from anywhere in the app
 * receive the cached instance with the original options.
 *
 * For per-call configuration (e.g. multiple independent palettes,
 * custom storage backend), call `bindColorPalette()` from
 * `@vuecs/design` directly with `renderColorPaletteStyles` and your
 * own ref.
 */
export interface UseColorPaletteOptions {
    /** Initial palette when no persisted value exists. Default: `{}`. */
    initial?: ColorPaletteConfig;
    /** Persist via localStorage (`useStorage` from `@vueuse/core`). Default: `true`. */
    persist?: boolean;
    /** Storage key for the default backend. Default: `'vc-color-palette'`. */
    storageKey?: string;
}

const PALETTE_NAME_SET = new Set<string>(COLOR_PALETTES);

/*
 * Defensive sanitizer: localStorage / cookies can hold anything (older
 * library version, hand-edited DevTools value). Drop unknown keys and
 * non-catalog palette names rather than passing junk to the renderer.
 */
const sanitize = (value: unknown): ColorPaletteConfig => {
    if (!value || typeof value !== 'object') return {};
    const input = value as Record<string, unknown>;
    const out: ColorPaletteConfig = {};
    for (const scale of SEMANTIC_SCALES) {
        const candidate = input[scale];
        if (typeof candidate === 'string' && PALETTE_NAME_SET.has(candidate)) {
            out[scale as SemanticScaleName] = candidate as ColorPaletteName;
        }
    }
    return out;
};

/**
 * Reactive Tailwind-palette state with localStorage persistence (via
 * VueUse's `useStorage`).
 *
 * Thin wrapper over `@vuecs/design`'s generic theme-aware
 * `useColorPalette()` (plan 021 slice 2): the generic dispatcher walks
 * installed themes and concatenates each theme's `palette.handle`
 * output. theme-tailwind declares its renderer at the theme level, so
 * importing this hook implicitly opts into the theme-runtime contract
 * — no direct `bindColorPalette` wiring here anymore.
 *
 * For SSR-aware cookie-backed storage (Nuxt), `@vuecs/nuxt`'s
 * auto-imported `useColorPalette()` provides the equivalent shape
 * backed by a cookie instead of localStorage.
 */
export function useColorPalette(options: UseColorPaletteOptions = {}): UseColorPaletteReturn<ColorPaletteConfig> {
    /*
     * CSP nonce: read via the cross-cutting Config registry (augmented
     * by `@vuecs/theme-tailwind` to expose `nonce?: string`). Passed as
     * a getter so the dispatcher re-reads on every `<style>` re-apply
     * — supports reactive `setConfig({ nonce: '...' })` flows.
     */
    const nonce = useConfig('nonce');

    return useColorPaletteCore<ColorPaletteConfig>({
        ...options,
        sanitize,
        extend: (current, partial) => ({ ...current, ...partial }),
        nonce: () => nonce.value,
    });
}

export type { UseColorPaletteReturn } from '@vuecs/design';
