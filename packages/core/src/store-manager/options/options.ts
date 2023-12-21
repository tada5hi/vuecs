import type { App } from 'vue';
import { StoreName } from '../../store';
import { installStoreManager } from '../singleton';
import type { StoreManagerOptions } from './type';

export function applyStoreManagerOptions(
    instance: App,
    options: StoreManagerOptions,
) {
    const manager = installStoreManager(instance);

    if (options.presets) {
        const presetKeys = Object.keys(options.presets);
        for (let i = 0; i < presetKeys.length; i++) {
            const store = manager.use(presetKeys[i]);
            store.setAll(options.presets[presetKeys[i]]);
        }
    }

    if (options.defaults) {
        const store = manager.use(StoreName.DEFAULT);
        store.setAll(options.defaults);
    }
}
