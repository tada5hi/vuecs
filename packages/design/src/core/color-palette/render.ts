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

        try {
            const out = handle(palette);
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
