/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ref } from 'vue';
import { StateType } from './type';

let instance : StateType | undefined;

export function useState() : StateType {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    instance = {
        components: ref([]),
        componentsActive: ref([]),
        tiers: undefined,
    };

    return instance;
}

export function setState(state: StateType) {
    instance = state;
}

export function getState() : StateType | undefined {
    return instance;
}
