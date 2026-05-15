import type { EXTEND_SYMBOL } from './constants';

export type ExtendValue = {
    __extend: typeof EXTEND_SYMBOL;
    value: string;
};

export type ClassesMergeFn = (base: string, override: string) => string;

export type ThemeClassesOverrideValue = string | ExtendValue;

export type ReservedThemeKeys = 'variants' | 'defaultVariants' | 'compoundVariants';

export type ThemeClasses = Record<string, string> & {
    [K in ReservedThemeKeys]?: never;
};

export type ThemeClassesOverride<T extends ThemeClasses = ThemeClasses> = {
    [K in keyof T]?: ThemeClassesOverrideValue;
} & {
    [K in ReservedThemeKeys]?: never;
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

/**
 * Forward-compat hook for plan 021 (theme-configurable runtime hooks).
 *
 * A theme can declare an `apply` callback that toggles framework-specific
 * dark-mode markers (e.g. `data-bs-theme`, `data-theme`) when color mode
 * changes. Currently a no-op at runtime; reserved here so authoring code
 * (`defineTheme`) compiles forward when plan 021 ships.
 */
export type ColorModeHook = {
    /**
     * Called when the resolved color mode changes (or on first mount).
     * Side-effecting — theme implementations typically set framework-
     * specific attributes on `doc.documentElement` (e.g. `data-bs-theme`,
     * `data-theme`).
     *
     * Named `handle` (not `apply`) to avoid collision with
     * `Function.prototype.apply` and to align with
     * `PaletteHook.handle`.
     */
    handle: (doc: Document, mode: 'light' | 'dark') => void;
};

/**
 * Forward-compat hook for plan 021 (theme-configurable runtime hooks).
 *
 * A theme can declare a palette renderer + the catalog of valid names it
 * accepts. Currently a no-op at runtime; reserved here so authoring code
 * (`defineTheme`) compiles forward when plan 021 ships.
 */
export type PaletteHook = {
    /**
     * Pure function — receives the resolved palette config and returns
     * a CSS string. The caller (`useColorPalette`) writes the result to
     * the `<style id="vc-color-palette">` block. Named `handle` to
     * align with `ColorModeHook.handle`.
     */
    handle: (palette: Record<string, string>) => string;
    names?: readonly string[];
    /**
     * Optional canonical-scale → theme-scale rename map. When set, the
     * dispatcher translates input keys before calling `handle`, so the
     * theme can author its renderer against its own naming.
     *
     * Example — a community theme using `brand` / `danger` instead of
     * the canonical `primary` / `error`:
     *
     *     scaleAliases: { primary: 'brand', error: 'danger' }
     *
     * The public-facing palette config still uses canonical
     * `SemanticScaleName` keys; aliases stay an internal-to-theme
     * concern. Last-wins across the `defineTheme` chain (palette is a
     * single-owner slot — only one renderer owns the `<style>` block).
     */
    scaleAliases?: Record<string, string>;
};

export type Theme = {
    elements: Partial<ThemeElements>;
    classesMergeFn?: ClassesMergeFn;
    colorMode?: ColorModeHook;
    palette?: PaletteHook;
};

export type ThemeConfig = {
    /**
     * Theme(s) to inherit from. Resolved left-to-right; later entries
     * override earlier ones. Omit to author a leaf theme from scratch.
     */
    extends?: Theme | Theme[];

    /** Per-component slot/variant overrides (same shape as Theme.elements). */
    elements?: Partial<ThemeElements>;

    /** Optional class-merge function for `extend()` markers. Later wins across the chain. */
    classesMergeFn?: ClassesMergeFn;

    /**
     * Plan 021 forward-compat slot. When ≥1 layer in the chain declares
     * `colorMode.handle`, the merged theme exposes a composed callback that
     * runs every layer's handler in chain order.
     */
    colorMode?: ColorModeHook;

    /**
     * Plan 021 forward-compat slot. Later wins across the chain — only one
     * renderer can own the runtime palette `<style>` block.
     */
    palette?: PaletteHook;
};

export type ThemeManagerOptions = {
    themes?: Theme[];
    overrides?: Theme;
};
