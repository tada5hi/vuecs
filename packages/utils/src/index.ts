import 'regenerator-runtime';

import '../assets/index.css';

import vue, { PluginFunction } from 'vue';

// Import vue components
import * as components from './components';
import { InstallOptions } from './type';
import { useLayoutLanguage } from './utils';

// install function executed by Vue.use()
const install: PluginFunction<any> = function install(
    instance: typeof vue,
    options?: InstallOptions,
) {
    options ??= {};
    if (options.language) {
        useLayoutLanguage(options.language);
    }

    Object.entries(components).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './components';
export * from './render';
export * from './utils';
