import { createSharedComposable, useStorage } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { SEMANTIC_SCALES, TAILWIND_PALETTES } from '../constants';
import { setPalette } from '../palette';
import type { PaletteConfig, SemanticScaleName, TailwindPaletteName } from '../types';

/**
 * Options for `usePalette()`. Note that `usePalette` is wrapped with
 * `createSharedComposable`, so these options are honored **only on
 * the first call**. Subsequent invocations from anywhere in the app
 * receive the cached instance with the original options — passing a
 * different `storageKey` or `initial` is a silent no-op.
 *
 * If you need a per-call configuration (e.g. multiple independent
 * palettes, custom storage backend), call `bindPalette()` directly
 * with your own reactive ref instead.
 */
export interface UsePaletteOptions {
    /** Initial palette when no persisted value exists. Default: `{}`. */
    initial?: PaletteConfig;
    /** Persist via localStorage (`useStorage` from `@vueuse/core`). Default: `true`. */
    persist?: boolean;
    /** Storage key for the default backend. Default: `'vc-palette'`. */
    storageKey?: string;
}

export interface UsePaletteReturn {
    /** Read-only view of the current palette. */
    current: ComputedRef<PaletteConfig>;
    /**
     * Replace the entire palette. Pass `{}` to reset to design-token
     * defaults. Existing scales not in `palette` are dropped.
     */
    set(palette: PaletteConfig): void;
    /**
     * Add or override individual scale assignments — shallow-merges
     * `partial` over the current value. Untouched scales are
     * preserved (e.g. `extend({ primary: 'green' })` keeps any existing
     * `neutral` selection).
     *
     * Mirrors the `extend()` marker in `@vuecs/core`'s theme system:
     * same verb, same "merge instead of replace" intent.
     */
    extend(partial: PaletteConfig): void;
}

const DEFAULT_STORAGE_KEY = 'vc-palette';

const TAILWIND_PALETTE_SET = new Set<string>(TAILWIND_PALETTES);

/*
 * Defensive sanitizer: localStorage / cookies can hold anything (older
 * library version, hand-edited DevTools value). Drop unknown keys and
 * non-Tailwind palette names rather than passing junk to `setPalette()`,
 * which would emit invalid CSS variable references.
 */
const sanitize = (value: unknown): PaletteConfig => {
    if (!value || typeof value !== 'object') return {};
    const input = value as Record<string, unknown>;
    const out: PaletteConfig = {};
    for (const scale of SEMANTIC_SCALES) {
        const candidate = input[scale];
        if (typeof candidate === 'string' && TAILWIND_PALETTE_SET.has(candidate)) {
            out[scale as SemanticScaleName] = candidate as TailwindPaletteName;
        }
    }
    return out;
};

/**
 * Wire any reactive `Ref<PaletteConfig>` into the design system: apply
 * the current value to the DOM via `setPalette()`, and re-apply on every
 * change. Used as the building block for `usePalette()` and for the
 * Nuxt-aware `usePalette()` override that swaps the storage backend.
 *
 * Server-side (no `document`): the watcher is still installed but
 * `setPalette()` is a no-op. The first reactive read on the client
 * triggers a re-paint.
 */
export function bindPalette(source: Ref<PaletteConfig>): UsePaletteReturn {
    if (typeof document !== 'undefined') {
        setPalette(source.value);
    }
    watch(
        source,
        (next) => {
            setPalette(next);
        },
        { deep: true },
    );

    return {
        current: computed(() => source.value),
        set(palette) {
            source.value = palette;
        },
        extend(partial) {
            source.value = { ...source.value, ...partial };
        },
    };
}

/**
 * Reactive palette state with localStorage persistence (via VueUse's
 * `useStorage`). Wrapped with `createSharedComposable` so every call
 * site shares the same ref, watcher, and applied DOM state — picking a
 * palette in one component updates every other consumer instantly.
 *
 * For SSR-aware cookie-backed storage (Nuxt), the `@vuecs/nuxt` module
 * ships its own `usePalette()` that calls `bindPalette()` directly with
 * a cookie-backed ref. Both expose the same `{ current, set, extend }`
 * shape.
 */
export const usePalette = createSharedComposable(
    (options: UsePaletteOptions = {}): UsePaletteReturn => {
        const {
            initial = {},
            persist = true,
            storageKey = DEFAULT_STORAGE_KEY,
        } = options;

        const storage: Ref<PaletteConfig> = persist ?
            useStorage<PaletteConfig>(storageKey, sanitize(initial), undefined, {
                serializer: {
                    read: (raw): PaletteConfig => {
                        try {
                            return sanitize(JSON.parse(raw));
                        } catch {
                            return {};
                        }
                    },
                    write: (value) => JSON.stringify(value),
                },
            }) :
            ref<PaletteConfig>(sanitize(initial));

        return bindPalette(storage);
    },
);
