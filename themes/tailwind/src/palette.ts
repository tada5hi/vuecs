import { applyColorPaletteCss } from '@vuecs/design';
import { COLOR_PALETTE_SHADES, SEMANTIC_SCALES, TAILWIND_COLOR_PALETTES } from './constants';
import type { ColorPaletteConfig, SemanticScaleName, TailwindColorPaletteName } from './types';

const SEMANTIC_SCALE_SET = new Set<string>(SEMANTIC_SCALES);
const TAILWIND_PALETTE_SET = new Set<string>(TAILWIND_COLOR_PALETTES);

/**
 * Build the CSS string that binds semantic scales to Tailwind palettes.
 *
 * Pure function — works identically on server and client. Returns a
 * `:root { ... }` block; inject it into `<head>` (server) or pass it to
 * `applyColorPaletteCss()` (client) to override the rebind defaults from
 * `@vuecs/theme-tailwind`'s `assets/index.css`.
 *
 * Defense-in-depth: filters entries to known semantic scales + Tailwind
 * palette names so untrusted callers (cookie payloads, hand-edited
 * localStorage, ad-hoc `setColorPalette({ … })` calls) can't emit broken
 * `var(--color-undefined-…)` declarations.
 */
export function renderColorPaletteStyles(palette: ColorPaletteConfig): string {
    const entries = Object.entries(palette).filter(
        (entry): entry is [SemanticScaleName, TailwindColorPaletteName] => (
            SEMANTIC_SCALE_SET.has(entry[0]) &&
            typeof entry[1] === 'string' &&
            TAILWIND_PALETTE_SET.has(entry[1])
        ),
    );
    if (entries.length === 0) {
        return '';
    }

    const declarations: string[] = [];
    for (const [scale, paletteName] of entries) {
        for (const shade of COLOR_PALETTE_SHADES) {
            declarations.push(
                `    --vc-color-${scale}-${shade}: var(--color-${paletteName}-${shade});`,
            );
        }
    }

    return `:root {\n${declarations.join('\n')}\n}\n`;
}

/**
 * Apply a Tailwind palette override at runtime (client-side).
 * Composes `@vuecs/design`'s `applyColorPaletteCss()` with our
 * `renderColorPaletteStyles()` renderer.
 *
 * On the server this is a no-op; use `renderColorPaletteStyles()` directly
 * and inject the result into the SSR response head (see
 * `@vuecs/theme-tailwind-nuxt`).
 */
export function setColorPalette(palette: ColorPaletteConfig, doc: Document | undefined = globalThis.document): void {
    applyColorPaletteCss(renderColorPaletteStyles(palette), doc);
}
