import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';

import VCPagination from './component.vue';
import type { Options } from './type';

export { VCPagination };
export * from './type';
export * from './utils';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);
    instance.component('VCPagination', VCPagination);
}

export default { install } satisfies Plugin<[Options?]>;
