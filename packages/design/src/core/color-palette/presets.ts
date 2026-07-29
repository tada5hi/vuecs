import type { ColorPaletteConfig } from './catalog';

/**
 * A color-vision-deficiency (CVD) conscious palette preset.
 *
 * Accessibility re-palettes are a **whole-palette swap**, not a
 * per-component override: feed this to `setColorPalette()` /
 * `useColorPalette().set()` and every semantic surface re-tints at once
 * through the installed themes' `palette.handle` hooks — the exact same
 * mechanism a brand re-palette uses. That is the architecture's a11y
 * story: one role→palette contract, swapped wholesale.
 *
 * The mapping keeps `success` and `error` out of the red↔green confusion
 * zone (deuteranopia / protanopia — the most common CVD): `success` → teal
 * and `error` → rose never collapse to the same perceived hue. `warning`
 * stays amber and `neutral` stays grey (always CVD-safe).
 *
 * Caveats — do NOT treat this as a complete a11y measure on its own:
 * - Six simultaneously distinguishable hues is near the CVD limit; colour
 *   alone is never sufficient. Keep pairing state with an icon and/or a
 *   text label (the Alert / Toast / Badge families expose icon slots for
 *   exactly this).
 * - Tune per target: red-green (deuteran/protan) and blue-yellow (tritan)
 *   deficiencies stress different pairs. This preset favours the common
 *   red-green case; author your own `ColorPaletteConfig` for another
 *   profile.
 */
export const colorBlindSafePalette: ColorPaletteConfig = {
    primary: 'blue',
    info: 'cyan',
    success: 'teal',
    warning: 'amber',
    error: 'rose',
    neutral: 'neutral',
};
