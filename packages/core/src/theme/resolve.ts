import { isExtendValue } from './extend';
import type {
    ClassesMergeFn,
    Theme,
    ThemeClasses,
    ThemeClassesOverride,
    ThemeClassesOverrideValue,
    ThemeElements,
} from './types';

const RESERVED_KEYS = new Set(['variants', 'defaultVariants', 'compoundVariants']);

function defaultClassesMergeFn(base: string, override: string): string {
    if (!base) return override;
    if (!override) return base;
    return `${base} ${override}`;
}

function resolveElementValue(
    current: string | undefined,
    override: ThemeClassesOverrideValue,
    mergeFn: ClassesMergeFn,
): string {
    if (isExtendValue(override)) {
        return mergeFn(current || '', override.value);
    }
    return override;
}

function applyOverrides(
    result: Record<string, string>,
    overrides: ThemeClassesOverride,
    mergeFn: ClassesMergeFn,
) {
    const keys = Object.keys(overrides);
    for (const key of keys) {
        const value = overrides[key];
        if (typeof value === 'undefined') continue;
        if (RESERVED_KEYS.has(key)) continue;

        result[key] = resolveElementValue(result[key], value, mergeFn);
    }
}

export function resolveComponentTheme<T extends ThemeClasses>(
    componentName: string,
    defaults: T,
    themes: Theme[],
    overrideClasses: ThemeElements | undefined,
    instanceThemeClass: ThemeClassesOverride<T> | undefined,
    classesMergeFn?: ClassesMergeFn,
): T {
    const merge = classesMergeFn || defaultClassesMergeFn;
    const result: Record<string, string> = { ...defaults };

    // Layer 2: Themes (in array order)
    for (const theme of themes) {
        const componentClasses = theme.elements[componentName];
        if (!componentClasses) continue;

        applyOverrides(result, componentClasses, merge);
    }

    // Layer 3: User overrides
    if (overrideClasses) {
        const componentClasses = overrideClasses[componentName];
        if (componentClasses) {
            applyOverrides(result, componentClasses, merge);
        }
    }

    // Layer 4: Instance themeClass prop
    if (instanceThemeClass) {
        applyOverrides(result, instanceThemeClass, merge);
    }

    return result as T;
}
