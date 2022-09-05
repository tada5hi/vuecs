import 'regenerator-runtime';

import '../assets/index.css';

import { App, Plugin } from 'vue';

// Import vue components
import * as components from './components';
import { hasOwnProperty } from './utils';
import { setProvider } from './provider';
import { setState } from './store';
import { Options } from './type';

export function createPlugin(options?: Partial<Options>) : Plugin {
    options ??= {};

    if (options.provider) {
        setProvider(options.provider);
    }

    if (options.state) {
        setState(options.state);
    }

    return (instance: App) => {
        Object.entries(components).forEach(([componentName, component]) => {
            instance.component(componentName, component);
        });
    };
}

// install function executed by Vue.use()
const install: Plugin = function install(
    instance,
    options,
) {
    Object.entries(components).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });

    if (
        typeof options === 'object' &&
        options !== null
    ) {
        if (hasOwnProperty(options, 'provider')) {
            setProvider(options.provider);
        }

        if (hasOwnProperty(options, 'state')) {
            setState(options.state);
        }
    }
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './auth';
export * from './components';
export * from './route';
export * from './provider';
export * from './store';
export * from './type';
export * from './utils';
