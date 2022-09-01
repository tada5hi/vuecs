/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ref } from 'vue';
import { ToMaybeRef } from '../type';
import { StateType } from './type';

let instance : ToMaybeRef<StateType> | undefined;

export function useState() : ToMaybeRef<StateType> {
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

export function setState(state: ToMaybeRef<StateType>) {
    instance = state;
}

export function getState() : ToMaybeRef<StateType> | undefined {
    return instance;
}
