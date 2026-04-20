import type { ComputedRef, MaybeRef } from 'vue';
import { computed, unref } from 'vue';
import type { ThemeClasses, ThemeClassesOverride } from './types';
import { injectThemeManager } from './install';

export function useComponentTheme<T extends ThemeClasses>(
    componentName: string,
    instanceThemeClass: MaybeRef<ThemeClassesOverride<T> | undefined>,
    defaults: T,
): ComputedRef<T> {
    const manager = injectThemeManager();
    if (!manager) {
        throw new Error(
            'ThemeManager is not installed. Call app.use(vuecs) or installThemeManager(app) before using components.',
        );
    }

    return computed(() => {
        const themeClass = unref(instanceThemeClass);
        return manager.resolve<T>(componentName, defaults, themeClass);
    });
}
