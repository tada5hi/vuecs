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
    VCLink,
} from './component';
import type { Options } from './types';

export * from './component';
export * from './types';

export function install(instance: App, options?: Options) : void {
    instance.component('VCLink', VCLink);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
