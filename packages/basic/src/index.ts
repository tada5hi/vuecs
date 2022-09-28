/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import 'regenerator-runtime';

import '../assets/index.css';

import { App, Plugin, Ref } from 'vue';

// Import vue components
import {
    Link,
    NavigationComponent,
    NavigationComponents,
    NavigationStore,
    Pagination,
    ProviderInterface,
    setProvider,
    setStore,
} from './components';

export type PluginOptions = {
    navigationProvider: ProviderInterface,
    navigationState?: Ref<NavigationStore>
};

export function createPlugin(options?: Partial<PluginOptions>) : Plugin {
    options ??= {};

    if (options.navigationProvider) {
        setProvider(options.navigationProvider);
    }

    if (options.navigationState) {
        setStore(options.navigationState);
    }

    return (instance: App) => {
        Object.entries({
            Link,
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
