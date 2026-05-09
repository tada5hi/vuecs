export { extend, isExtendValue } from './extend';
export { defaultClassesMergeFn, resolveComponentTheme } from './resolve';
export { ThemeManager } from './manager';
export { installThemeManager, injectThemeManager } from './install';
export { useComponentTheme } from './composable';
export type { UseComponentThemeProps } from './composable';
export { extractVariantConfig, resolveVariantClasses } from './variant';
export { defineTheme } from './define';
export { mergeThemes } from './merge-themes';
export { themableProps, useThemeProps } from './themable';
export type {
    ExtendValue,
    ClassesMergeFn,
    Theme,
    ThemeConfig,
    ThemeElements,
    ThemeManagerOptions,
    ThemeClassesOverride,
    ThemeClassesOverrideValue,
    ThemeClasses,
    ColorModeHook,
    PaletteHook,
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
