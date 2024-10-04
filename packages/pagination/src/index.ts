import { applyStoreManagerOptions, installStoreManager } from '@vuecs/core';

import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';

// Import vue components
import {
    VCPagination,
} from './component';
import type { Options } from './type';

export * from './component';
export * from './module';
export * from './type';
export * from './utils';

export function install(instance: App, options: Options = {}) : void {
    const storeManager = installStoreManager(instance);
    if (options.storeManager) {
        applyStoreManagerOptions(storeManager, options.storeManager);
    }

    instance.component('VCPagination', VCPagination);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
