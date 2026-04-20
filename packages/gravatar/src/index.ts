import { installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import './vue';

import { VCGravatar } from './component';
import type { Options } from './type';

export * from './component';
export * from './type';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    instance.component('VCGravatar', VCGravatar);
}

export default { install } satisfies Plugin<[Options?]>;
