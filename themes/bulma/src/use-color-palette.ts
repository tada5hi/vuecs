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
 * Options for `useColorPalette()`. Mirrors `@vuecs/theme-tailwind`'s
 * SPA composable; both share the same `vc-color-palette` storage key
 * so consumers can swap themes at the docs / playground level without
 * losing state.
 *
 * The underlying generic dispatcher (in `@vuecs/design`) is wrapped
 * with `createSharedComposable`, so options are honored only on the
 * **first call**. For per-call configuration, call
 * `bindColorPalette()` from `@vuecs/design` directly.
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
 * library version, hand-edited DevTools value, payload written by
 * theme-tailwind under the same key). Drop unknown semantic scales and
 * non-catalog palette names rather than passing junk to the renderer,
 * which would emit invalid HSL channels.
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
 * Reactive Bulma-palette state with localStorage persistence (via
 * VueUse's `useStorage`).
 *
 * Thin wrapper over `@vuecs/design`'s generic theme-aware
 * `useColorPalette()` (plan 021 slice 2): the generic dispatcher walks
 * installed themes and concatenates each theme's `palette.handle`
 * output. theme-bulma declares its renderer at the theme level, so
 * importing this hook implicitly opts into the theme-runtime contract
 * — no direct `bindColorPalette` wiring here anymore.
 *
 * Storage key (`vc-color-palette`) is intentionally shared with
 * `@vuecs/theme-tailwind`'s SPA composable: when an app loads both
 * themes (e.g. the vuecs docs site demos), the same payload drives
 * both — Tailwind components get the Tailwind renderer's output, Bulma
 * components get the Bulma renderer's output, both written into the
 * same `<style id="vc-color-palette">` block (the dispatcher
 * concatenates).
 */
export function useColorPalette(options: UseColorPaletteOptions = {}): UseColorPaletteReturn<ColorPaletteConfig> {
    /*
     * CSP nonce: read via the cross-cutting Config registry (augmented
     * by this package's `config.ts` to expose `nonce?: string`). Passed
     * as a getter so the dispatcher re-reads on every `<style>` re-apply
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
