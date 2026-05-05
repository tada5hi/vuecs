import vuecs, { injectThemeManager } from '@vuecs/core';
import bootstrapTheme from '@vuecs/theme-bootstrap';
import bulmaTheme from '@vuecs/theme-bulma';
import tailwindTheme from '@vuecs/theme-tailwind';
import type { App } from 'vue';

/*
 * Shared `@vuecs/core` install for every demo. Each iframe is its own
 * Vue app, so this runs once per demo. The default theme is
 * `@vuecs/theme-tailwind` (mirrors a real consumer who picked Tailwind);
 * the docs `<SettingsModal>` lets a reader flip to `bootstrap` or `bulma`
 * for visual QA via postMessage.
 */
export type DemoThemeName = 'tailwind' | 'bootstrap' | 'bulma';

export const themeFactories: Record<DemoThemeName, () => ReturnType<typeof tailwindTheme>> = {
    tailwind: tailwindTheme,
    bootstrap: bootstrapTheme,
    bulma: bulmaTheme,
};

/**
 * Maps each non-Tailwind demo theme to the `data-*-css` attribute on the
 * preloaded-but-disabled framework `<link>` in the demo HTML shell. The
 * Tailwind theme has no entry — its styles are embedded by Vite, no
 * framework-CSS toggle needed.
 */
const cssLinkAttrByTheme: Partial<Record<DemoThemeName, string>> = {
    bootstrap: 'data-bootstrap-css',
    bulma: 'data-bulma-css',
};

let installedApp: App | null = null;

export function installVuecs(app: App): void {
    app.use(vuecs, { themes: [tailwindTheme()] });
    installedApp = app;
}

/**
 * Swap the active theme at runtime. Called by the iframe-bridge when the
 * parent docs page postMessages a `set-theme` event from the
 * SettingsModal. Walks Vue's inject tree to grab the ThemeManager, then
 * calls `setThemes([newTheme()])`.
 *
 * Each non-Tailwind theme has a corresponding `<link disabled>` in the
 * demo HTML shell that loads the framework CSS from a CDN. We toggle
 * exactly one link enabled at a time so framework styles don't leak
 * across themes.
 */
export function setDemoTheme(name: DemoThemeName): void {
    if (!installedApp) return;

    for (const [theme, attr] of Object.entries(cssLinkAttrByTheme)) {
        const link = document.querySelector<globalThis.HTMLLinkElement>(`link[${attr}]`);
        if (link) {
            link.disabled = name !== theme;
        }
    }

    // `runWithContext` lets us call `inject()` outside a setup() — needed
    // because the iframe-bridge calls this from a `message` event handler.
    installedApp.runWithContext(() => {
        const manager = injectThemeManager();
        manager.setThemes([themeFactories[name]()]);
    });
}
