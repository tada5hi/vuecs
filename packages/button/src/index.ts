import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';

import { VCButton } from './component';
import type { Options } from './type';

export * from './component';
export * from './type';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);
    instance.component('VCButton', VCButton);
}

export default { install } satisfies Plugin<[Options?]>;
