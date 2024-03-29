import { applyStoreManagerOptions, installStoreManager } from '@vuecs/core';

import type { App, Plugin } from 'vue';

import './vue';

import { setNavigationProvider } from './provider';
import { setupStore } from './store';
import {
    VCNavItem,
    VCNavItems,
} from './components';
import type { Options } from './type';

export * from './components';
export * from './provider';
export * from './module';
export * from './type';
export * from './core/flatten';

export function install(instance: App, options: Options) : void {
    if (options.provider) {
        setNavigationProvider(options.provider);
    }

    setupStore(instance);

    const storeManager = installStoreManager(instance);
    if (options.storeManager) {
        applyStoreManagerOptions(storeManager, options.storeManager);
    }

    Object.entries({
        VCNavItem,
        VCNavItems,
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
}

export default {
    install,
} satisfies Plugin<Options>;
export { buildNavigationForTier } from './core';
