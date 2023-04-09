/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PluginBaseOptions } from '@vue-layout/core';
import { applyPluginBaseOptions } from '@vue-layout/core';

import type { App, Plugin, Ref } from 'vue';

// Import vue components
import type {
    NavigationProvider,
    NavigationStore,
} from './components';
import {
    Countdown,
    FormInputCheckbox,
    FormInputText,
    FormSelect,
    FormTextarea,
    Gravatar,
    MyLink,
    NavigationComponent,
    NavigationComponents,
    Pagination,
    setNavigationProvider,
    setStore,
} from './components';

export type PluginOptions = PluginBaseOptions & {
    navigationProvider: NavigationProvider,
    navigationStore?: Ref<NavigationStore>,
};

export function createPlugin(options?: Partial<PluginOptions>) : Plugin {
    options ??= {};

    if (options.navigationProvider) {
        setNavigationProvider(options.navigationProvider);
    }

    if (options.navigationStore) {
        setStore(options.navigationStore);
    }

    applyPluginBaseOptions(options);

    return (instance: App) => {
        Object.entries({
            Countdown,
            FormInputCheckbox,
            FormInputText,
            FormSelect,
            FormTextarea,
            Gravatar,
            MyLink,
            NavigationComponent,
            NavigationComponents,
            Pagination,
        }).forEach(([componentName, component]) => {
            instance.component(componentName, component);
        });
    };
}

// install function executed by Vue.use()
const install: Plugin = function install(
    instance,
    options,
) {
    const plugin = createPlugin(options);
    instance.use(plugin);
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './components';
