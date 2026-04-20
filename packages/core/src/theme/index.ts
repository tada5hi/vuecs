export { extend, isExtendValue } from './extend';
export { resolveComponentTheme } from './resolve';
export { ThemeManager } from './manager';
export { installThemeManager, injectThemeManager } from './install';
export { useComponentTheme } from './composable';
export type {
    ExtendValue,
    ClassesMergeFn,
    Theme,
    ThemeElements,
    ThemeManagerOptions,
    ThemeClassesOverride,
    ThemeClassesOverrideValue,
    ThemeClasses,
} from './types';
