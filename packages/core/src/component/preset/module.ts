/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Store } from '../../store';

const instances : Record<string, Store> = {};

export function usePresetStore(key: string) : Store {
    if (typeof instances[key] !== 'undefined') {
        return instances[key];
    }

    const instance = new Store();

    instances[key] = instance;

    return instance;
}

export function getRegisteredPresets() {
    return Object.keys(instances);
}
