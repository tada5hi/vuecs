import type { App, Plugin } from 'vue';
import { installThemeManager } from './theme';
import type { ThemeManagerOptions } from './theme';
import { installDefaultsManager } from './defaults';
import type { DefaultsManagerOptions } from './defaults';

export * from './theme';
export * from './defaults';
export * from './utils';
export * from './types';

export type CoreOptions = ThemeManagerOptions & DefaultsManagerOptions;

export function install(app: App, options: CoreOptions = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);
}

export default { install } satisfies Plugin<[CoreOptions?]>;
