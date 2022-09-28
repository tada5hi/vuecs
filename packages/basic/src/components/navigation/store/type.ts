/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationElement } from '../type';

export type NavigationStore = {
    components: NavigationElement[],
    componentsActive: NavigationElement[],
    tiers?: number
};

export type NavigationStoreInitOptions = {
    forceSet?: boolean
};

export type BuildContext = {
    components?: NavigationElement[],
    url?: string
};
