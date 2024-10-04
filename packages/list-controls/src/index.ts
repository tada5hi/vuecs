import { applyStoreManagerOptions, installStoreManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';
import type { Options } from './type';

import '../assets/index.css';

export * from './components';
export * from './type';

export function install(instance: App, options: Options = {}) : void {
    const storeManager = installStoreManager(instance);
    if (options.storeManager) {
        applyStoreManagerOptions(storeManager, options.storeManager);
    }
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
