/**
 * Semantic color scales exposed by vuecs.
 * Each scale tracks one Tailwind palette through the `--vc-color-<scale>-*`
 * variable family. Defaults are concrete OKLCH values from `@vuecs/design`;
 * `@vuecs/theme-tailwind`'s `assets/index.css` rebinds them to
 * `var(--color-<palette>-*)` so `setColorPalette()` can swap them at runtime.
 */
export type SemanticScaleName = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

/**
 * Tailwind v4's 22 built-in color palettes.
 * Any of these can be assigned to a semantic scale via `setColorPalette()`.
 */
export type TailwindColorPaletteName =    'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' |
    'red' | 'orange' | 'amber' | 'yellow' | 'lime' |
    'green' | 'emerald' | 'teal' | 'cyan' | 'sky' |
    'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' |
    'pink' | 'rose';

/**
 * Runtime palette override. Partial — keys not set keep their defaults
 * from `@vuecs/theme-tailwind`'s `assets/index.css` (primary=blue,
 * neutral=neutral, success=green, warning=amber, error=red, info=sky).
 */
export type ColorPaletteConfig = Partial<Record<SemanticScaleName, TailwindColorPaletteName>>;
