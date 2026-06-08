import { installLocale } from './install';
import type { LocaleOptions } from './types';
import type { App, Plugin } from 'vue';

export * from './bind';
export * from './composable';
export * from './constants';
export * from './install';
export * from './types';

export function install(app: App, options: LocaleOptions = {}): void {
    installLocale(app, options);
}

export default { install } satisfies Plugin<[LocaleOptions?]>;
