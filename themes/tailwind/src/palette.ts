import {
    COLOR_PALETTES,
    COLOR_PALETTE_SHADES,
    SEMANTIC_SCALES,
    applyColorPaletteCss,
} from '@vuecs/design';
import type { ColorPaletteName, SemanticScaleName } from '@vuecs/design';
import type { ColorPaletteConfig } from './types';

const SEMANTIC_SCALE_SET = new Set<string>(SEMANTIC_SCALES);
const PALETTE_NAME_SET = new Set<string>(COLOR_PALETTES);

/**
 * Build the CSS string that binds semantic scales to Tailwind palettes.
 *
 * Pure function — works identically on server and client. Returns a
 * `:root { ... }` block; inject it into `<head>` (server) or pass it to
 * `applyColorPaletteCss()` (client) to override the defaults from
 * `@vuecs/design`'s `assets/index.css`.
 *
 * Defense-in-depth: filters entries to known semantic scales + catalog
 * palette names so untrusted callers (cookie payloads, hand-edited
 * localStorage, ad-hoc `setColorPalette({ … })` calls) can't emit broken
 * `var(--color-undefined-…)` declarations.
 */
export function renderColorPaletteStyles(palette: ColorPaletteConfig): string {
    const entries = Object.entries(palette).filter(
        (entry): entry is [SemanticScaleName, ColorPaletteName] => (
            SEMANTIC_SCALE_SET.has(entry[0]) &&
            typeof entry[1] === 'string' &&
            PALETTE_NAME_SET.has(entry[1])
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
 * The optional `nonce` parameter wires CSP nonce attribution onto the
 * `<style id="vc-color-palette">` block. Direct callers pass the value
 * explicitly; the `useColorPalette` composable reads it from
 * `useConfig('nonce')` automatically.
 *
 * On the server this is a no-op; use `renderColorPaletteStyles()` directly
 * and inject the result into the SSR response head (see
 * `@vuecs/theme-tailwind-nuxt`).
 */
export function setColorPalette(
    palette: ColorPaletteConfig,
    doc: Document | undefined = globalThis.document,
    nonce?: string,
): void {
    applyColorPaletteCss(renderColorPaletteStyles(palette), doc, nonce);
}
