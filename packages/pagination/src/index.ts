/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PluginBaseOptions } from '@vue-layout/core';
import { applyPluginBaseOptions } from '@vue-layout/core';

import type { App, Plugin } from 'vue';

// Import vue components
import {
    Pagination,
} from './component';
import type { Options } from './type';

export * from './component';
export * from './module';
export * from './type';

export function install(instance: App, options?: Options) : void {
    options ??= {};

    applyPluginBaseOptions(options);

    instance.component('Pagination', Pagination);
}

export default {
    install,
} satisfies Plugin<PluginBaseOptions | undefined>;
