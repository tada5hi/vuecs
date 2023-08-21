/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PluginBaseOptions } from '@vue-layout/core';
import { applyPluginBaseOptions } from '@vue-layout/core';

import type { App, Plugin } from 'vue';
import { setNavigationProvider } from './provider';
import { setStore } from './store';
import {
    MyLink,
    NavigationComponent,
    NavigationComponents,
} from './components';
import type { Options } from './type';

export * from './components';
export * from './provider';
export * from './store';
export * from './utils';
export * from './type';

export function install(instance: App, options: Options) : void {
    if (options.provider) {
        setNavigationProvider(options.provider);
    }

    if (options.store) {
        setStore(options.store);
    }

    applyPluginBaseOptions(instance, options);

    Object.entries({
        MyLink,
        NavigationComponent,
        NavigationComponents,
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
}

export default {
    install,
} satisfies Plugin<Options>;
