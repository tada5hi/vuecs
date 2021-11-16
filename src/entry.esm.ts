import 'regenerator-runtime';

import Vue, { PluginFunction } from 'vue';

// Import vue components
import * as components from './sfc/index';

// install function executed by Vue.use()
const install: PluginFunction<any> = function installVueLayoutNavigation(vue: typeof Vue) {
    Object.entries(components).forEach(([componentName, component]) => {
        vue.component(componentName, component);
    });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './sfc/index';
export * from './index';
