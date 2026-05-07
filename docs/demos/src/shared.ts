import vuecs from '@vuecs/core';
import tailwindTheme, { setColorPalette as setTailwindColorPalette } from '@vuecs/theme-tailwind';
import type { ColorPaletteConfig as TailwindColorPaletteConfig } from '@vuecs/theme-tailwind';
import type { App } from 'vue';

/*
 * Shared `@vuecs/core` install for every demo. Each iframe is its own
 * Vue app, so this runs once per demo. The docs site is pinned to
 * `@vuecs/theme-tailwind` — per-theme proof lives in the runnable
 * example apps under `examples/{tailwind,bootstrap,bulma}/`.
 */

export function installVuecs(app: App): void {
    app.use(vuecs, { themes: [tailwindTheme()] });
}

/**
 * Live runtime palette swap — rewrites `--vc-color-<scale>-*` so all
 * mounted components re-tint without theme re-resolution. The docs site
 * runs Tailwind only, so this dispatches directly to the Tailwind
 * renderer.
 */
export function applyDemoColorPalette(palette: { primary?: string; neutral?: string }): void {
    setTailwindColorPalette(palette as TailwindColorPaletteConfig);
}
