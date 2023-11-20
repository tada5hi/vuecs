/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { App, Plugin } from 'vue';

import './vue';

// Import vue components
import {
    VLLink,
} from './component';
import type { Options } from './type';

export * from './component';
export * from './type';

export function install(instance: App, options?: Options) : void {
    instance.component('VLLink', VLLink);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
