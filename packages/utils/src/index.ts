import 'regenerator-runtime';

import '../assets/index.css';

import { Plugin } from 'vue';

// Import vue components
import * as components from './components';
// install function executed by Vue.use()
const install: Plugin = function install(instance) {
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
export * from './type';
