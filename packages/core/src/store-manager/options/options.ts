import { StoreName } from '../../store';
import type { StoreManager } from '../module';
import type { StoreManagerOptions } from './type';

export function applyStoreManagerOptions(
    manager: StoreManager,
    options: StoreManagerOptions,
) {
    if (options.presets) {
        const presetKeys = Object.keys(options.presets);
        for (const presetKey of presetKeys) {
            const store = manager.use(presetKey);
            store.setAll(options.presets[presetKey]);
        }
    }

    if (options.defaults) {
        const store = manager.use(StoreName.DEFAULT);
        store.setAll(options.defaults);
    }
}
