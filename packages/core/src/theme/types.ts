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

export interface ThemeElements {}

export type Theme = {
    elements: Partial<ThemeElements>;
    classesMergeFn?: ClassesMergeFn;
};

export type ThemeManagerOptions = {
    themes?: Theme[];
    overrides?: Theme;
};
