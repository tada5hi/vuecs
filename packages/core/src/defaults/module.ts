/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Store } from '../../store';

let instance : Store | undefined;

export function useDefaultsStore() {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    instance = new Store();

    return instance;
}
