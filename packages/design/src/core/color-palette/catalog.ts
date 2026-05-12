/**
 * Canonical palette catalog for the vuecs design system.
 *
 * The names originated in Tailwind v4 (see `@vuecs/design/standalone`'s
 * `palettes.css`, generated from `tailwindcss/theme.css`), but the
 * catalog is now considered design-owned: every supported palette
 * source — Tailwind via `@import "tailwindcss"`, or the
 * standalone subpath — provides the matching `--color-<palette>-<shade>`
 * literals so `setColorPalette()` resolves correctly regardless of
 * whether Tailwind is loaded.
 *
 * Themes typically reuse this catalog verbatim (theme-tailwind and
 * theme-bulma both declare `palette.names: COLOR_PALETTES`). A theme
 * with extra palette names just defines its own local union:
 *
 *     type AcmePaletteName = ColorPaletteName | 'acme-blue';
 *
 * — and ships its own `palette.names` array.
 */

/**
 * The six semantic scales every vuecs theme exposes through the
 * `--vc-color-<scale>-*` variable family. A `setColorPalette({
 * primary: 'green' })` call binds one scale to one palette catalog
 * entry at runtime.
 */
export const SEMANTIC_SCALES = [
    'primary',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
] as const;

export type SemanticScaleName = typeof SEMANTIC_SCALES[number];

/**
 * The 22 catalog palettes shipped with `@vuecs/design` (sourced
 * verbatim from Tailwind v4). Any of these can be assigned to a
 * `SemanticScaleName` via `setColorPalette()`.
 */
export const COLOR_PALETTES = [
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
] as const;

/**
 * Augmentation hook for community themes that extend the catalog with
 * their own palette names. Defaults to empty — `ColorPaletteName` is just
 * the 22-name Tailwind-derived catalog. A theme that ships extra palettes
 * widens the union via declaration merging:
 *
 *     declare module '@vuecs/design' {
 *         interface ExtraColorPaletteNames {
 *             'acme-blue': true;
 *             'acme-orange': true;
 *         }
 *     }
 *
 * Both the SPA composables (`@vuecs/theme-tailwind`'s `useColorPalette`,
 * etc.) and `@vuecs/nuxt`'s `colorPalette.value` option pick up the
 * extension automatically because both type against `ColorPaletteName`.
 */
export interface ExtraColorPaletteNames {}

export type ColorPaletteName = typeof COLOR_PALETTES[number] | keyof ExtraColorPaletteNames;

/**
 * Tailwind-style 11-stop shade ladder. The same ladder appears in
 * every catalog entry (the standalone subpath's `palettes.css` and
 * Tailwind's own `theme.css` both emit `--color-<palette>-<shade>`
 * for each stop).
 */
export const COLOR_PALETTE_SHADES = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
] as const;

export type ColorPaletteShade = typeof COLOR_PALETTE_SHADES[number];
