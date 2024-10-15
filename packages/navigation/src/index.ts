import { applyStoreManagerOptions, installStoreManager } from '@vuecs/core';

import type { App, Plugin } from 'vue';

import './vue';
import { NavigationManager } from './module';

import { providerManager } from './singleton';
import {
    VCNavItem,
    VCNavItems,
} from './components';
import type { Options } from './type';

export * from './components';
export * from './provider';
export * from './build';
export * from './module';
export * from './type';

export function install(instance: App, options: Options) : void {
    const manager = new NavigationManager({
        provider: options.provider,
    });

    providerManager(manager, instance);

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
