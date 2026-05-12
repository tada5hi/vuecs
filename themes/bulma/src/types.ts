import type { ColorPaletteName, SemanticScaleName } from '@vuecs/design';

/**
 * Runtime palette assignment: pick a catalog palette per semantic
 * scale. Identical shape to `@vuecs/theme-tailwind`'s `ColorPaletteConfig`,
 * so the storage / cookie payload is interchangeable.
 *
 * `SemanticScaleName` and `ColorPaletteName` come from `@vuecs/design`'s
 * canonical catalog.
 */
export type ColorPaletteConfig = Partial<Record<SemanticScaleName, ColorPaletteName>>;

/** HSL channel triplet — degrees, percent, percent. */
export type Hsl = {
    h: number;
    s: number;
    l: number;
};
