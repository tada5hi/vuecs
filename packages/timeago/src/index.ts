/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ref } from 'vue';
import type { App, Plugin, Ref } from 'vue';

// Import vue components
import {
    Timeago,
} from './component';
import { InjectionKey } from './constants';
import type { InjectionContext, Options } from './type';

export * from './component';
export * from './type';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $timeagoLocale?: Ref<string>;
        // Add other custom properties here
    }
}

export function install(instance: App, options?: Options) : void {
    options ??= {};

    instance.provide<InjectionContext>(InjectionKey, {
        converter: options.converter,
        locales: options.locales || {},
    });

    instance.config.globalProperties.$timeagoLocale = ref(options.locale || 'en');

    instance.component(options.name || 'Timeago', Timeago);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
