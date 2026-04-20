import { installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';

import { VCPagination } from './component';
import type { Options } from './type';

export * from './component';
export * from './type';
export * from './utils';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    instance.component('VCPagination', VCPagination);
}

export default { install } satisfies Plugin<[Options?]>;
