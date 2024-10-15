import { applyStoreManagerOptions, installStoreManager } from '@vuecs/core';

import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';
import { NavigationManager, providerManager } from './manager';

import {
    VCNavItem,
    VCNavItems,
} from './components';
import type { Options } from './types';

export * from './components';
export * from './provider';
export * from './manager';
export * from './types';

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
