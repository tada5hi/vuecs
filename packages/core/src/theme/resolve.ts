import { isExtendValue } from './extend';
import type {
    ClassesMergeFn,
    ComponentThemeDefinition,
    Theme,
    ThemeClasses,
    ThemeClassesOverride,
    ThemeClassesOverrideValue,
    ThemeElementDefinition,
} from './types';

export function defaultClassesMergeFn(base: string, override: string): string {
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

        result[key] = resolveElementValue(result[key], value, mergeFn);
    }
}

function applyThemeOverrides(
    result: Record<string, string>,
    defaults: Record<string, string>,
    overrides: ThemeClassesOverride,
    mergeFn: ClassesMergeFn,
) {
    const keys = Object.keys(overrides);
    for (const key of keys) {
        const value = overrides[key];
        if (typeof value === 'undefined') continue;

        if (isExtendValue(value)) {
            // extend: merge with current accumulated result
            result[key] = mergeFn(result[key] || '', value.value);
        } else {
            // replace: merge with defaults (preserving defaults), reset theme contributions
            const defaultValue = defaults[key];
            result[key] = defaultValue ? mergeFn(defaultValue, value) : value;
        }
    }
}

export function resolveComponentTheme<T extends ThemeClasses>(
    componentName: string,
    defaults: ComponentThemeDefinition<T>,
    themes: Theme[],
    overrideElements: Record<string, ThemeElementDefinition> | undefined,
    instanceThemeClass: ThemeClassesOverride<T> | undefined,
    classesMergeFn?: ClassesMergeFn,
): T {
    const merge = classesMergeFn || defaultClassesMergeFn;
    const result: Record<string, string> = { ...defaults.classes };

    // Layer 2: Themes (in array order) — always preserve defaults
    for (const theme of themes) {
        const elements = theme.elements as Record<string, ThemeElementDefinition>;
        const entry = elements[componentName];
        if (!entry?.classes) continue;

        applyThemeOverrides(result, defaults.classes as Record<string, string>, entry.classes, merge);
    }

    // Layer 3: User overrides
    if (overrideElements) {
        const entry = overrideElements[componentName];
        if (entry?.classes) {
            applyOverrides(result, entry.classes, merge);
        }
    }

    // Layer 4: Instance themeClass prop
    if (instanceThemeClass) {
        applyOverrides(result, instanceThemeClass, merge);
    }

    return result as T;
}
