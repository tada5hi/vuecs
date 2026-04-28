import vuecs, { injectThemeManager } from '@vuecs/core';
import bootstrapTheme from '@vuecs/theme-bootstrap';
import tailwindTheme from '@vuecs/theme-tailwind';
import type { App } from 'vue';

/*
 * Shared `@vuecs/core` install for every demo. Each iframe is its own
 * Vue app, so this runs once per demo. The default theme is
 * `@vuecs/theme-tailwind` (mirrors a real consumer who picked Tailwind);
 * the docs `<SettingsModal>` lets a reader flip to `bootstrap` for
 * visual QA via postMessage.
 */
export type DemoThemeName = 'tailwind' | 'bootstrap';

export const themeFactories: Record<DemoThemeName, () => ReturnType<typeof tailwindTheme>> = {
    tailwind: tailwindTheme,
    bootstrap: bootstrapTheme,
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
 */
export function setDemoTheme(name: DemoThemeName): void {
    if (!installedApp) return;
    // Bootstrap CSS for `@vuecs/theme-bootstrap` is preloaded as a disabled
    // <link> in the demo HTML shell; toggle it on/off so the bootstrap
    // class names actually have visual effect (and don't leak into the
    // tailwind preview when switched off).
    const link = document.querySelector<globalThis.HTMLLinkElement>('link[data-bootstrap-css]');
    if (link) {
        link.disabled = name !== 'bootstrap';
    }
    // `runWithContext` lets us call `inject()` outside a setup() — needed
    // because the iframe-bridge calls this from a `message` event handler.
    installedApp.runWithContext(() => {
        const manager = injectThemeManager();
        manager.setThemes([themeFactories[name]()]);
    });
}
