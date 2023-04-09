/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ComponentStore } from '../store';

const instances : Record<string, ComponentStore> = {};

export function usePresetComponentStore(key: string) : ComponentStore {
    if (typeof instances[key] !== 'undefined') {
        return instances[key];
    }

    const instance = new ComponentStore();

    instances[key] = instance;

    return instance;
}

export function getRegisteredPresets() {
    return Object.keys(instances);
}
