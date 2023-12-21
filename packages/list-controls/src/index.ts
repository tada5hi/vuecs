import { applyStoreManagerOptions, installStoreManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';
import type { Options } from './type';

export * from './components';
export * from './type';

export function install(instance: App, options: Options = {}) : void {
    if (options.storeManager) {
        applyStoreManagerOptions(instance, options.storeManager);
    } else {
        installStoreManager(instance);
    }
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
