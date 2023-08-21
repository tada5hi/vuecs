/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { App } from 'vue';
import { StoreName } from '../store';
import { installStoreManager } from '../store-manager';
import type { PluginBaseOptions } from './type';

export function applyPluginBaseOptions(
    instance: App,
    options: PluginBaseOptions,
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
