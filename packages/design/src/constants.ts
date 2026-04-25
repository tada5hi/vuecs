import type { SemanticScaleName, TailwindPaletteName } from './types';

export const SEMANTIC_SCALES: readonly SemanticScaleName[] = [
    'primary',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
] as const;

export const TAILWIND_PALETTES: readonly TailwindPaletteName[] = [
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

export const PALETTE_SHADES: readonly string[] = [
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

/**
 * DOM id used by `applyPalette()` for the injected <style> element.
 * The Nuxt SSR plugin uses the same id so client hydration replaces
 * the server-rendered block atomically.
 */
export const PALETTE_STYLE_ELEMENT_ID = 'vc-palette';
