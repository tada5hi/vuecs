import type { ComputedRef, MaybeRef } from 'vue';
import { computed, unref } from 'vue';
import type { 
    ComponentThemeDefinition, 
    ThemeClasses, 
    ThemeClassesOverride, 
    VariantValues, 
} from './types';
import { injectThemeManager } from './install';

export function useComponentTheme<T extends ThemeClasses>(
    componentName: string,
    instanceThemeClass: MaybeRef<ThemeClassesOverride<T> | undefined>,
    defaults: ComponentThemeDefinition<T>,
    variantValues?: MaybeRef<VariantValues | undefined>,
): ComputedRef<T> {
    const manager = injectThemeManager();
    if (!manager) {
        throw new Error(
            'ThemeManager is not installed. Call app.use(vuecs) or installThemeManager(app) before using components.',
        );
    }

    return computed(() => {
        const themeClass = unref(instanceThemeClass);
        const variants = unref(variantValues);
        return manager.resolve<T>(componentName, defaults, themeClass, variants);
    });
}
