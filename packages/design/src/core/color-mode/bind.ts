import { usePreferredDark } from '@vueuse/core';
import { computed, watch } from 'vue';
import type { Ref } from 'vue';
import { useThemeRuntimeManager } from '../theme-runtime/composable';
import type { ColorMode, UseColorModeOptions, UseColorModeReturn } from './types';

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

    /*
     * Theme-configurable dispatch (plan 021): each installed theme that
     * declares a `colorMode.handle` hook gets called with the resolved
     * mode. Themes use this to mirror framework-specific dark-mode
     * markers (theme-bootstrap → `data-bs-theme`, theme-bulma →
     * `data-theme`) so framework chrome flips alongside vuecs's own
     * `.dark` class without per-app `watchEffect` mirrors.
     *
     * The watch source is a tuple `[resolved, () => manager?.themes]`
     * because Vue's `watch(source, callback)` only tracks reactive
     * dependencies accessed inside the source — callback reads do NOT
     * subscribe. Including the themes getter in the source means
     * `ThemeManager.setThemes()` (which mutates the underlying
     * `shallowRef`) re-fires the dispatch with the new theme list.
     */
    const manager = useThemeRuntimeManager();
    if (typeof document !== 'undefined') {
        watch(
            [resolved, () => manager?.themes],
            ([value, themes]) => {
                if (!themes) return;
                for (const theme of themes) {
                    theme.colorMode?.handle(document, value);
                }
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
