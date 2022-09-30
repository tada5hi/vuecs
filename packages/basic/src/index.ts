/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import 'regenerator-runtime';
import {
    ComponentsOptions, PresetsBuildIn, getBuildInPresets, setDefaults, setPresets,
} from '@vue-layout/hyperscript';

import { App, Plugin, Ref } from 'vue';

// Import vue components
import {
    Countdown,
    MyLink,
    NavigationComponent,
    NavigationComponents,
    NavigationProvider,
    NavigationStore,
    Pagination,
    setNavigationProvider,
    setStore,
} from './components';

export type PluginOptions = {
    navigationProvider: NavigationProvider,
    navigationStore?: Ref<NavigationStore>,
    presets?: Record<string, ComponentsOptions> | (`${PresetsBuildIn}`)[],
    defaults?: ComponentsOptions
};

export function createPlugin(options?: Partial<PluginOptions>) : Plugin {
    options ??= {};

    if (options.navigationProvider) {
        setNavigationProvider(options.navigationProvider);
    }

    if (options.navigationStore) {
        setStore(options.navigationStore);
    }

    if (options.presets) {
        if (Array.isArray(options.presets)) {
            setPresets(getBuildInPresets(options.presets));
        } else {
            setPresets(options.presets);
        }
    }

    if (options.defaults) {
        setDefaults(options.defaults);
    }

    return (instance: App) => {
        Object.entries({
            Countdown,
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
