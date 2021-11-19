import 'regenerator-runtime';

import '../assets/index.css';

import vue, { PluginFunction } from 'vue';

// Import vue components
import * as components from './sfc/index';

// install function executed by Vue.use()
const install: PluginFunction<any> = function installVueLayoutNavigation(instance: typeof vue) {
    Object.entries(components).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './sfc/index';
export * from './index';
