/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import type { RouteLocationNormalized } from 'vue-router';
import type { NavigationElement } from '../type';

export type NavigationProvider = {
    getElements: (tier: number, items: NavigationElement[]) => Promise<NavigationElement[]> | NavigationElement[],
    getElementsActiveByURL?: (url: string) => Promise<NavigationElement[]> | NavigationElement[],
    getElementsActiveByRoute?: (route: RouteLocationNormalized) => Promise<NavigationElement[]> | NavigationElement[],
    hasTier: (tier: number) => Promise<boolean>
};
