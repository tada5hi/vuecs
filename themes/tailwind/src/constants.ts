import type { SemanticScaleName, TailwindColorPaletteName } from './types';

export const SEMANTIC_SCALES: readonly SemanticScaleName[] = [
    'primary',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
] as const;

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

export const COLOR_PALETTE_SHADES: readonly string[] = [
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
