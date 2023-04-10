/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { App, Plugin } from 'vue';
import type { Options } from './type';

// Import vue components
import {
    Countdown,
} from './component';

export * from './component';
export * from './type';

export function install(instance: App, options?: Options) : void {
    options ??= {};

    instance.component('Countdown', Countdown);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
