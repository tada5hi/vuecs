import 'regenerator-runtime';

import './assets/index.css';

import vue, { PluginFunction } from 'vue';

// Import vue components
import * as components from './components';
import { setProvider } from './provider';
import { InstallOptions } from './type';

// install function executed by Vue.use()
const install: PluginFunction<any> = function install(
    instance: typeof vue,
    options?: InstallOptions,
) {
    options = options || {};

    if (options.provider) {
        setProvider(options.provider);
    }

    Object.entries(components).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './auth';
export * from './components';
export * from './middleware';
export * from './provider';
export * from './store';
export * from './type';
export * from './utils';
