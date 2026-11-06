import type { ColorPaletteName, SemanticScaleName } from '@vuecs/design';
import '../../config';

/**
 * Generic palette config typed against the design-system catalog.
 *
 * Widens automatically when community themes augment
 * `ExtraColorPaletteNames` in `@vuecs/design` — consumers installing
 * such a theme keep autocomplete on its extra names without any
 * Nuxt-side wiring.
 */
export type NuxtColorPaletteConfig = Partial<Record<SemanticScaleName, ColorPaletteName>>;
