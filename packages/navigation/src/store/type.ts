/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { NavigationItem } from '../type';

export type NavigationStore = {
    items: Ref<NavigationItem[]>,
    itemsActive: Ref<NavigationItem[]>
};

export type NavigationStoreInitOptions = {
    forceSet?: boolean
};

export type NavigationBuildContext = {
    itemsActive?: NavigationItem[],
    url?: string
    route?: RouteLocationNormalized
};
