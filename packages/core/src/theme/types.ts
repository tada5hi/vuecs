import type { EXTEND_SYMBOL } from './constants';

export type ExtendValue = {
    __extend: typeof EXTEND_SYMBOL;
    value: string;
};

export type ClassesMergeFn = (base: string, override: string) => string;

export type ThemeClassesOverrideValue = string | ExtendValue;

export type ThemeClasses = Record<string, string>;

export type ThemeClassesOverride<T extends ThemeClasses = ThemeClasses> = {
    [K in keyof T]?: ThemeClassesOverrideValue;
};

// ---------------------------------------------------------------------------
// Variant types
// ---------------------------------------------------------------------------

export type VariantSlotClasses<T extends ThemeClasses = ThemeClasses> = Partial<Record<keyof T & string, string>>;

export type VariantDefinition<T extends ThemeClasses = ThemeClasses> = Record<string, VariantSlotClasses<T>>;

export type VariantDefinitions<T extends ThemeClasses = ThemeClasses> = Record<string, VariantDefinition<T>>;

export type CompoundVariantDefinition<T extends ThemeClasses = ThemeClasses> = {
    variants: Record<string, string | boolean>;
    class: VariantSlotClasses<T>;
};

export type DefaultVariants = Record<string, string | boolean>;

export type VariantValues = Record<string, string | boolean | undefined>;

export type VariantConfig = {
    variants: VariantDefinitions;
    compoundVariants: CompoundVariantDefinition[];
    defaultVariants: DefaultVariants;
};

// ---------------------------------------------------------------------------
// Theme definition types
// ---------------------------------------------------------------------------

export type ComponentThemeDefinition<T extends ThemeClasses = ThemeClasses> = {
    classes: T;
    variants?: VariantDefinitions<T>;
    compoundVariants?: CompoundVariantDefinition<T>[];
    defaultVariants?: DefaultVariants;
};

export type ThemeElementDefinition<T extends ThemeClasses = ThemeClasses> = {
    classes?: ThemeClassesOverride<T>;
    variants?: VariantDefinitions<T>;
    compoundVariants?: CompoundVariantDefinition<T>[];
    defaultVariants?: DefaultVariants;
};

export interface ThemeElements {}

export type Theme = {
    elements: Partial<ThemeElements>;
    classesMergeFn?: ClassesMergeFn;
};

export type ThemeManagerOptions = {
    themes?: Theme[];
    overrides?: Theme;
};
