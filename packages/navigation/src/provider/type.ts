/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import type { RouteLocationNormalized } from 'vue-router';
import type { NavigationItem } from '../type';

export type NavigationProvider = {
    getItems: (
        tier: number,
        itemsActive: NavigationItem[]
    ) => Promise<NavigationItem[] | undefined> | NavigationItem[] | undefined,
    getItemsActiveByURL?: (
        url: string
    ) => Promise<NavigationItem[]> | NavigationItem[],
    getItemsActiveByRoute?: (
        route: RouteLocationNormalized
    ) => Promise<NavigationItem[]> | NavigationItem[]
};
