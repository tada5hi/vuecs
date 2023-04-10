/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationElement } from '../type';

export type NavigationStore = {
    items: NavigationElement[],
    itemsActive: NavigationElement[],
    tiers?: number
};

export type NavigationStoreInitOptions = {
    forceSet?: boolean
};

export type NavigationBuildContext = {
    items?: NavigationElement[],
    url?: string
};
