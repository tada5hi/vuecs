/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import type { RouteLocationNormalized } from 'vue-router';
import type { NavigationItem } from '../type';

export type NavigationProvider = {
    getElements: (tier: number, itemsActive: NavigationItem[]) => Promise<NavigationItem[]> | NavigationItem[],
    getElementsActiveByURL?: (url: string) => Promise<NavigationItem[]> | NavigationItem[],
    getElementsActiveByRoute?: (route: RouteLocationNormalized) => Promise<NavigationItem[]> | NavigationItem[],
    hasTier: (tier: number) => Promise<boolean>
};
