import { createSharedComposable, useStorage } from '@vueuse/core';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { bindColorMode } from './bind';
import type { ColorMode, UseColorModeOptions, UseColorModeReturn } from './types';

const DEFAULT_STORAGE_KEY = 'vc-color-mode';
const COLOR_MODES: readonly ColorMode[] = ['light', 'dark', 'system'];
const COLOR_MODE_SET = new Set<string>(COLOR_MODES);

const sanitize = (value: unknown, fallback: ColorMode): ColorMode => (
    typeof value === 'string' && COLOR_MODE_SET.has(value) ?
        (value as ColorMode) :
        fallback
);

/**
 * Reactive color-mode state with localStorage persistence. Shared
 * across all call sites via `createSharedComposable` so toggling in
 * one component updates every consumer (and the `<html>` class) in
 * lockstep.
 *
 * For SSR-aware cookie-backed storage (Nuxt), the `@vuecs/nuxt` module
 * ships its own `useColorMode()` that calls `bindColorMode()` directly
 * with a cookie-backed ref. Both expose the same return shape.
 */
export const useColorMode = createSharedComposable(
    (options: UseColorModeOptions = {}): UseColorModeReturn => {
        const {
            initial = 'system',
            persist = true,
            storageKey = DEFAULT_STORAGE_KEY,
            syncClass = true,
        } = options;

        const storage: Ref<ColorMode> = persist ?
            useStorage<ColorMode>(storageKey, initial, undefined, {
                serializer: {
                    read: (raw) => sanitize(raw, initial),
                    write: (value) => value,
                },
            }) :
            ref<ColorMode>(initial);

        return bindColorMode(storage, { syncClass });
    },
);
