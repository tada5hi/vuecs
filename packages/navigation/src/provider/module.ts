/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationProviderInterface } from '../type';

let instance : NavigationProviderInterface | undefined;

export function useNavigationProvider(provider?: NavigationProviderInterface) : NavigationProviderInterface {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    if (typeof provider === 'undefined') {
        throw new Error('A Navigation Provider must be set!');
    }

    instance = provider;

    return instance;
}
