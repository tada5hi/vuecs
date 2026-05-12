import type { ColorPaletteName, SemanticScaleName } from '@vuecs/design';

/**
 * Runtime palette override. Partial — keys not set keep their defaults
 * from `@vuecs/design`'s `assets/index.css` (primary=blue, neutral=neutral,
 * success=green, warning=amber, error=red, info=sky).
 *
 * `SemanticScaleName` and `ColorPaletteName` come from `@vuecs/design`'s
 * canonical catalog. A theme that ships extra palette names declares its
 * own union (`type AcmePaletteName = ColorPaletteName | 'acme-blue'`).
 */
export type ColorPaletteConfig = Partial<Record<SemanticScaleName, ColorPaletteName>>;
