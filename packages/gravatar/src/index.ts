import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import './vue';

import { VCGravatar } from './component';
import type { Options } from './types';

export * from './component';
export type { GravatarThemeClasses, GravatarFallbackSlotProps, GravatarProps } from './types';
export * from './types';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);
    instance.component('VCGravatar', VCGravatar);
}

export default { install } satisfies Plugin<[Options?]>;
