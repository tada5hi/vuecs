import { createSharedComposable, usePreferredDark, useStorage } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';

export type ColorMode = 'light' | 'dark' | 'system';

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

const DEFAULT_STORAGE_KEY = 'vc-color-mode';
const COLOR_MODES: readonly ColorMode[] = ['light', 'dark', 'system'];
const COLOR_MODE_SET = new Set<string>(COLOR_MODES);

const sanitize = (value: unknown, fallback: ColorMode): ColorMode => (
    typeof value === 'string' && COLOR_MODE_SET.has(value) ?
        (value as ColorMode) :
        fallback
);

/**
 * Wire any reactive `Ref<ColorMode>` into the design system: track
 * system preference, expose the resolved light/dark value, and
 * (optionally) sync the `.dark` / `.light` class on `<html>`.
 *
 * The `syncClass` watcher mirrors what `@vuecs/nuxt`'s SSR plugin
 * writes server-side, so client hydration leaves the class in place.
 */
export function bindColorMode(
    source: Ref<ColorMode>,
    options: Pick<UseColorModeOptions, 'syncClass'> = {},
): UseColorModeReturn {
    const { syncClass = true } = options;
    const preferredDark = usePreferredDark();

    const resolved = computed<'light' | 'dark'>(() => {
        if (source.value === 'dark') return 'dark';
        if (source.value === 'light') return 'light';
        return preferredDark.value ? 'dark' : 'light';
    });

    const mode = computed<ColorMode>({
        get: () => source.value,
        set: (value) => {
            source.value = value;
        },
    });

    const isDark = computed<boolean>({
        get: () => resolved.value === 'dark',
        set: (value) => {
            source.value = value ? 'dark' : 'light';
        },
    });

    if (syncClass && typeof document !== 'undefined') {
        watch(
            resolved,
            (value) => {
                document.documentElement.classList.toggle('dark', value === 'dark');
                document.documentElement.classList.toggle('light', value === 'light');
            },
            { immediate: true },
        );
    }

    function toggle(): void {
        source.value = resolved.value === 'dark' ? 'light' : 'dark';
    }

    return {
        mode,
        resolved,
        isDark,
        toggle,
    };
}

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
