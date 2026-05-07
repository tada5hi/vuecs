/**
 * Semantic scales — same shape as `@vuecs/theme-tailwind`. Kept in lockstep
 * so a `setColorPalette({ primary: 'green' })` call works identically across
 * themes.
 */
export type SemanticScaleName = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

/**
 * Tailwind v4 palette-name catalog. Reused verbatim so cross-theme
 * consumers see one vocabulary. Bulma doesn't ship its own named palette
 * catalog (its design language is HSL-channel-based), so leaning on
 * Tailwind's catalog is the lowest-friction option.
 */
export type TailwindColorPaletteName = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';

/**
 * Runtime palette assignment: pick a Tailwind-catalog palette per semantic
 * scale. Identical shape to `@vuecs/theme-tailwind`'s `ColorPaletteConfig`,
 * so the storage / cookie payload is interchangeable.
 */
export type ColorPaletteConfig = Partial<Record<SemanticScaleName, TailwindColorPaletteName>>;

/** HSL channel triplet — degrees, percent, percent. */
export type Hsl = {
    h: number;
    s: number;
    l: number;
};
