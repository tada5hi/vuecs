import { PALETTE_SHADES, PALETTE_STYLE_ELEMENT_ID } from './constants';
import type { PaletteConfig, SemanticScaleName, TailwindPaletteName } from './types';

/**
 * Build the CSS string that binds semantic scales to Tailwind palettes.
 *
 * Pure function — works identically on server and client. Returns a
 * `:root { ... }` block; inject it into `<head>` (server) or into a
 * `<style>` element (client) to override the defaults from `tokens.css`.
 */
export function renderPaletteStyles(palette: PaletteConfig): string {
    const entries = Object.entries(palette) as [SemanticScaleName, TailwindPaletteName][];
    if (entries.length === 0) {
        return '';
    }

    const declarations: string[] = [];
    for (const [scale, paletteName] of entries) {
        for (const shade of PALETTE_SHADES) {
            declarations.push(
                `    --vc-color-${scale}-${shade}: var(--color-${paletteName}-${shade});`,
            );
        }
    }

    return `:root {\n${declarations.join('\n')}\n}\n`;
}

/**
 * Apply a palette override at runtime (client-side).
 *
 * Inserts or updates a single `<style id="vc-palette">` element in `<head>`.
 * Safe to call repeatedly — subsequent calls replace the element's content.
 *
 * On the server this is a no-op; use `renderPaletteStyles()` directly and
 * inject the result into the SSR response head (see `@vuecs/nuxt`).
 */
export function setPalette(palette: PaletteConfig, doc: Document | undefined = globalThis.document): void {
    if (!doc) return;

    const css = renderPaletteStyles(palette);

    let style = doc.getElementById(PALETTE_STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!style) {
        style = doc.createElement('style');
        style.id = PALETTE_STYLE_ELEMENT_ID;
        doc.head.appendChild(style);
    }
    style.textContent = css;
}
