import {
    COLOR_PALETTES,
    COLOR_PALETTE_SHADES,
    SEMANTIC_SCALES,
    applyColorPaletteCss,
} from '@vuecs/design';
import type { ColorPaletteConfig, ColorPaletteName, SemanticScaleName } from '@vuecs/design';
import { COLOR_PALETTE_HSL } from './palette-catalog';

const SEMANTIC_SCALE_SET = new Set<string>(SEMANTIC_SCALES);
const PALETTE_NAME_SET = new Set<string>(COLOR_PALETTES);

/**
 * Build the CSS string that rebinds Bulma's per-variant theming onto the
 * chosen Tailwind palette catalog.
 *
 * Bulma 1.0 reads three groups of CSS variables for theming:
 *   1. Per-variant **HSL channels** (`--bulma-<scale>-h/s/l`) drive the
 *      auto-derived hover / active / `.is-light` shades on `.button`,
 *      `.tag`, `.notification`, etc. Setting these is what makes the
 *      Bulma side of the bridge respond to runtime palette switches —
 *      pure CSS can't decompose `--vc-color-primary-600` into channels,
 *      but JS can (via the pre-decomposed catalog generated at package
 *      build time).
 *   2. Direct semantic vars (`--bulma-primary`, `-info`, …) read by
 *      `has-background-*` / `has-text-*` utilities. We re-emit each at
 *      the chosen palette's `-500` shade so utilities stay aligned.
 *   3. The vuecs design tokens (`--vc-color-<scale>-{50…950}`) — emitted
 *      so consumer-authored CSS that references them follows along, and
 *      so any of the bridge's direct property overrides (`background-color:
 *      var(--vc-color-primary-600)`) re-tint correctly.
 *
 * Pure function — works identically on server and client. Returns a
 * `:root { ... }` block; inject into `<head>` (server) or pass to
 * `applyColorPaletteCss()` (client).
 *
 * Defense-in-depth: filters entries to known semantic scales + Tailwind
 * palette names so untrusted callers (cookie payloads, hand-edited
 * localStorage, ad-hoc `setColorPalette({ … })` calls) can't emit
 * broken declarations.
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

    // Bulma exposes `info` and `link` as separate axes (link defaults to
    // a brand-blue, info to a sky-cyan); the bridge already maps both to
    // --vc-color-info, so when the consumer rebinds `info`, propagate to
    // `link` too. Other axes don't have a Bulma-side alias to chase.
    const declarations: string[] = [];
    for (const [scale, paletteName] of entries) {
        const shades = COLOR_PALETTE_HSL[paletteName];
        const base = shades['500'];

        // (1) HSL channel vars — drive Bulma's auto-derivation on
        //     .button, .tag, .notification, etc.
        const bulmaScale = scale === 'error' ? 'danger' : scale;
        declarations.push(
            `    --bulma-${bulmaScale}-h: ${base.h}deg;`,
            `    --bulma-${bulmaScale}-s: ${base.s}%;`,
            `    --bulma-${bulmaScale}-l: ${base.l}%;`,
        );
        if (scale === 'info') {
            // `link` is a Bulma axis with no vuecs counterpart; align with `info`.
            declarations.push(
                `    --bulma-link-h: ${base.h}deg;`,
                `    --bulma-link-s: ${base.s}%;`,
                `    --bulma-link-l: ${base.l}%;`,
            );
        }

        // (2) Direct semantic vars — read by `.has-background-*` / `.has-text-*`.
        const baseHsl = `hsl(${base.h}deg, ${base.s}%, ${base.l}%)`;
        declarations.push(`    --bulma-${bulmaScale}: ${baseHsl};`);
        if (scale === 'info') {
            declarations.push(`    --bulma-link: ${baseHsl};`);
        }

        // (3) vuecs design tokens — keep consumer-authored CSS that
        //     references `--vc-color-<scale>-N` in lockstep with the
        //     palette switch.
        for (const shade of COLOR_PALETTE_SHADES) {
            const {
                h, 
                s, 
                l, 
            } = shades[shade];
            declarations.push(
                `    --vc-color-${scale}-${shade}: hsl(${h}deg, ${s}%, ${l}%);`,
            );
        }
    }

    return `:root {\n${declarations.join('\n')}\n}\n`;
}

/**
 * Apply a Bulma palette override at runtime (client-side). Composes
 * `@vuecs/design`'s `applyColorPaletteCss()` with our
 * `renderColorPaletteStyles()` renderer.
 *
 * The optional `nonce` parameter wires CSP nonce attribution onto the
 * `<style id="vc-color-palette">` block. CSP-strict consumers using
 * `useColorPalette` from `@vuecs/design` pass nonce via
 * `nonce: () => useConfig('nonce').value`.
 *
 * On the server this is a no-op; use `renderColorPaletteStyles()` directly
 * and inject the result into the SSR response head (or rely on
 * `@vuecs/nuxt`'s palette server plugin, which dispatches through the
 * theme runtime).
 */
export function setColorPalette(
    palette: ColorPaletteConfig,
    doc: Document | undefined = globalThis.document,
    nonce?: string,
): void {
    applyColorPaletteCss(renderColorPaletteStyles(palette), doc, nonce);
}
