/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationProvider } from './type';

let instance : NavigationProvider | undefined;

export function useNavigationProvider(module?: NavigationProvider) : NavigationProvider {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    if (typeof module === 'undefined') {
        throw new Error('A Navigation Provider must be set!');
    }

    instance = module;

    return instance;
}

export function setNavigationProvider(module: NavigationProvider) {
    instance = module;
}

export function createNavigationProvider(input: NavigationProvider) : NavigationProvider {
    return input;
}
