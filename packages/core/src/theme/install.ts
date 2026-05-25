import type { App } from 'vue';
import { inject, provide } from '../utils';
import { ThemeManager } from './manager';
import type { ThemeManagerOptions } from './types';

const THEME_MANAGER_SYMBOL = Symbol.for('VCThemeManager');

export function installThemeManager(
    app: App,
    options: ThemeManagerOptions = {},
): ThemeManager {
    const existing = inject<ThemeManager>(THEME_MANAGER_SYMBOL, app);
    if (existing) {
        // Merge fresh options into the existing manager so the order of
        // `app.use(...)` calls doesn't matter. Without this, a per-package
        // `install()` that runs first would freeze the manager with no
        // themes, and a later `app.use(vuecs, { themes: [...] })` would
        // silently drop them. Themes append (matches install-order
        // stacking); overrides replace (single-owner). See #1591.
        if (options.themes && options.themes.length > 0) {
            existing.setThemes([...existing.themes, ...options.themes]);
        }
        if (options.overrides !== undefined) {
            existing.setOverrides(options.overrides);
        }
        return existing;
    }

    const manager = new ThemeManager(options);
    provide(THEME_MANAGER_SYMBOL, manager, app);
    return manager;
}

export function injectThemeManager(app?: App): ThemeManager | undefined {
    return inject<ThemeManager>(THEME_MANAGER_SYMBOL, app);
}
