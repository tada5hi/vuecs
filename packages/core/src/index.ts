import type { App, Plugin } from 'vue';
import { installThemeManager } from './theme';
import type { ThemeManagerOptions } from './theme';

export * from './theme';
export * from './utils';
export * from './types';

export function install(app: App, options?: ThemeManagerOptions): void {
    installThemeManager(app, options);
}

export default { install } satisfies Plugin<[ThemeManagerOptions?]>;
