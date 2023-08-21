/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { applyPluginBaseOptions } from '@vue-layout/core';
import type { App, Plugin } from 'vue';
import type { Options } from './type';

export * from './components';
export * from './type';

export function install(instance: App, options?: Options) : void {
    options ??= {};

    applyPluginBaseOptions(instance, options);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
