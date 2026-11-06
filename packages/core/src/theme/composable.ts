import type { ComponentThemeDefinition, ThemeClasses, UseComponentThemeProps  } from './types';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import { injectThemeManager } from './install';

export function useComponentTheme<T extends ThemeClasses>(
    componentName: string,
    props: UseComponentThemeProps<T>,
    defaults: ComponentThemeDefinition<T>,
): ComputedRef<T> {
    const manager = injectThemeManager();

    if (!manager) {
        throw new Error(
            'ThemeManager is not installed. Call app.use(vuecs) or installThemeManager(app) before using components.',
        );
    }

    return computed(() => manager.resolve<T>(
        componentName,
        defaults,
        props.themeClass,
        props.themeVariant,
    ));
}
