/*
 * Curated palette lists for the docs-site palette switcher. The
 * underlying `usePalette()` from `@vuecs/design` accepts every
 * Tailwind v4 palette — these subsets are just what the navbar
 * dropdown and the Hero swatches expose to readers.
 */

export const PRIMARY_PALETTES = [
    'blue',
    'green',
    'orange',
    'red',
    'purple',
    'pink',
    'teal',
    'indigo',
] as const;

export const NEUTRAL_PALETTES = [
    'neutral',
    'slate',
    'gray',
    'zinc',
    'stone',
] as const;

export type PrimaryPalette = (typeof PRIMARY_PALETTES)[number];
export type NeutralPalette = (typeof NEUTRAL_PALETTES)[number];
