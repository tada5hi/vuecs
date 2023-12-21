import { applyStoreManagerOptions } from '@vuecs/core';
import type { App, Plugin } from 'vue';
import type { Options } from './type';

export * from './components';
export * from './type';

export function install(instance: App, options?: Options) : void {
    options ??= {};

    applyStoreManagerOptions(instance, options);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
