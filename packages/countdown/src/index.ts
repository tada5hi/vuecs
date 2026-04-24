import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';
import type { Options } from './type';

import './vue';

import { VCCountdown } from './component';

export * from './component';
export * from './type';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);
    instance.component('VCCountdown', VCCountdown);
}

export default { install } satisfies Plugin<[Options?]>;
