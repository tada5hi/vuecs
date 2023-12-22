import { StoreName } from '../../store';
import type { StoreManager } from '../module';
import type { StoreManagerOptions } from './type';

export function applyStoreManagerOptions(
    manager: StoreManager,
    options: StoreManagerOptions,
) {
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
