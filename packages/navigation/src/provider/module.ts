/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ProviderInterface } from '../type';

let instance : ProviderInterface | undefined;

export function useProvider(module?: ProviderInterface) : ProviderInterface {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    if (typeof module === 'undefined') {
        throw new Error('A Navigation Provider must be set!');
    }

    instance = module;

    return instance;
}

export function setProvider(module: ProviderInterface) {
    instance = module;
}
