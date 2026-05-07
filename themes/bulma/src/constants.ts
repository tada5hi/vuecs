import type { SemanticScaleName, TailwindColorPaletteName } from './types';

/**
 * Semantic-scale axis. Same six names as `@vuecs/theme-tailwind` so a
 * `setColorPalette({ primary: 'green' })` call works identically.
 */
export const SEMANTIC_SCALES: readonly SemanticScaleName[] = [
    'primary',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
] as const;

/**
 * Tailwind v4's 22 named palettes. Reused verbatim — Bulma 1.0 has no
 * named-palette catalog of its own (its design language is HSL-channel-
 * based), so we lean on Tailwind's vocabulary and convert each at
 * package build time via `scripts/build-palette-catalog.ts`.
 */
export const TAILWIND_COLOR_PALETTES: readonly TailwindColorPaletteName[] = [
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
