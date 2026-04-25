/**
 * Semantic color scales exposed by @vuecs/design.
 * Each maps to a Tailwind palette via the `tokens.css` bindings.
 */
export type SemanticScaleName = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

/**
 * Tailwind v4's 22 built-in color palettes.
 * Any of these can be assigned to a semantic scale via setPalette().
 */
export type TailwindPaletteName =    'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' |
    'red' | 'orange' | 'amber' | 'yellow' | 'lime' |
    'green' | 'emerald' | 'teal' | 'cyan' | 'sky' |
    'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' |
    'pink' | 'rose';

/**
 * Runtime palette override. Partial — keys not set keep their defaults
 * from `tokens.css` (primary=blue, neutral=neutral, success=green,
 * warning=amber, error=red, info=sky).
 */
export type PaletteConfig = Partial<Record<SemanticScaleName, TailwindPaletteName>>;
