export { extend, isExtendValue } from './extend';
export { resolveComponentTheme } from './resolve';
export { ThemeManager } from './manager';
export { installThemeManager, injectThemeManager } from './install';
export { useComponentTheme } from './composable';
export { extractVariantConfig, resolveVariantClasses } from './variant';
export type {
    ExtendValue,
    ClassesMergeFn,
    Theme,
    ThemeElements,
    ThemeManagerOptions,
    ThemeClassesOverride,
    ThemeClassesOverrideValue,
    ThemeClasses,
    ComponentThemeDefinition,
    ThemeElementDefinition,
    VariantSlotClasses,
    VariantDefinition,
    VariantDefinitions,
    CompoundVariantDefinition,
    DefaultVariants,
    VariantValues,
    VariantConfig,
} from './types';
