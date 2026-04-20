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
        return existing;
    }

    const manager = new ThemeManager(options);
    provide(THEME_MANAGER_SYMBOL, manager, app);
    return manager;
}

export function injectThemeManager(app?: App): ThemeManager | undefined {
    return inject<ThemeManager>(THEME_MANAGER_SYMBOL, app);
}
