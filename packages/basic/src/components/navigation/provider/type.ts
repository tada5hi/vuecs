/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { NavigationElement } from '../type';

export type NavigationProvider = {
    getElements: (tier: number, items: NavigationElement[]) => Promise<NavigationElement[]>,
    getElementsActive: (url: string) => Promise<NavigationElement[]>,
    hasTier: (tier: number) => Promise<boolean>
};
