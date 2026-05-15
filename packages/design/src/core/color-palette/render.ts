import type { ThemeRuntimeEntry } from '../theme-runtime/types';

/**
 * Concatenate every installed theme's `palette.handle` output into a
 * single CSS string. SSR plugins emit the result as the
 * `<style id="vc-color-palette">` block so palette-aware themes flow
 * on first paint.
 *
 * Mirrors the client-side concat semantics in `useColorPalette()`:
 * non-overlapping rules from different themes coexist; CSS cascade
 * resolves any incidental overlap with later-rule-wins.
 *
 * Errors thrown by a theme's handler are caught + logged so one
 * broken theme can't crash SSR; other themes still emit.
 */
export function renderColorPaletteFromThemes(
    themes: readonly ThemeRuntimeEntry[],
    palette: Record<string, string>,
): string {
    const parts: string[] = [];
    for (const theme of themes) {
        if (!theme.palette?.handle) {
            continue;
        }

        // Preserve `this` so themes whose handle method reads from
        // `theme.palette` state (e.g. caches a renderer instance) keep
        // working when the function is extracted before call.
        const handle = theme.palette.handle.bind(theme.palette);

        // Apply per-theme scale aliasing (plan 026). Themes whose
        // internal scale names diverge from the canonical six declare
        // a rename map; the dispatcher rewrites input keys so the
        // theme's renderer sees its own naming while the public-facing
        // palette config stays canonical.
        const input = applyScaleAliases(palette, theme.palette.scaleAliases);

        try {
            const out = handle(input);
            if (out) {
                parts.push(out);
            }
        } catch (e) {
            if (typeof console !== 'undefined') {
                // eslint-disable-next-line no-console
                console.warn('[vuecs] theme palette.handle failed; skipping:', e);
            }
        }
    }
    return parts.join('\n');
}

function applyScaleAliases(
    palette: Record<string, string>,
    aliases: Record<string, string> | undefined,
): Record<string, string> {
    if (!aliases) {
        return palette;
    }
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(palette)) {
        const target = aliases[k];
        out[target ?? k] = v;
    }
    return out;
}
