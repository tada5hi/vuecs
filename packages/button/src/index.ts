import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';

import { VCButton } from './component';
import type { Options } from './types';

export * from './component';
export type { ButtonProps } from './types';
export * from './types';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);
    instance.component('VCButton', VCButton);
}

export default { install } satisfies Plugin<[Options?]>;
