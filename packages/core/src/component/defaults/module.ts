/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ComponentStore } from '../store';

let instance : ComponentStore | undefined;

export function useDefaultComponentStore() {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    instance = new ComponentStore();

    return instance;
}

export function setDefaultComponentOptionsMap(data: Record<string, Record<string, any>>) {
    const store = useDefaultComponentStore();

    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        store.setOptions(keys[i], data[keys[i]]);
    }
}
