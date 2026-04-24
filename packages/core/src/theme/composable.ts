import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import type {
    ComponentThemeDefinition,
    ThemeClasses,
    ThemeClassesOverride,
    VariantValues,
} from './types';
import { injectThemeManager } from './install';

/**
 * Shape of the `props` argument expected by `useComponentTheme`.
 *
 * The composable relies on Vue's reactive props proxy to track changes:
 * passing the live `props` object from `setup(props)` works out-of-the-box
 * and the returned `ComputedRef<T>` recomputes when `props.themeClass`
 * or `props.themeVariant` change. Passing a plain, non-reactive object
 * literal will resolve once but will NOT recompute — only use that form
 * for one-shot resolution (e.g. in tests) or pass a `reactive(...)`
 * object.
 */
export type UseComponentThemeProps<T extends ThemeClasses> = {
    themeClass?: ThemeClassesOverride<T>;
    themeVariant?: VariantValues;
};

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
