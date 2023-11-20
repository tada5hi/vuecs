/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { applyPluginBaseOptions } from '@vue-layout/core';

import type { App, Plugin } from 'vue';

import './vue';

import { setNavigationProvider } from './provider';
import { setupStore } from './store';
import {
    VCNavItem,
    VCNavItems,
} from './components';
import type { Options } from './type';

export * from './components';
export * from './provider';
export * from './store';
export * from './module';
export * from './type';
export * from './core/flatten';

export function install(instance: App, options: Options) : void {
    if (options.provider) {
        setNavigationProvider(options.provider);
    }

    setupStore(instance);

    applyPluginBaseOptions(instance, options);

    Object.entries({
        VCNavItem,
        VCNavItems,
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
}

export default {
    install,
} satisfies Plugin<Options>;
export { buildNavigationForTier } from './core';
