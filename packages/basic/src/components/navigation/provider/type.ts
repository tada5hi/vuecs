/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { NavigationElement } from '../type';

export interface ProviderInterface {
    getComponents(
        tier: number,
        components: NavigationElement[]
    ): Promise<NavigationElement[]>;

    getComponentsActive(url: string): Promise<NavigationElement[]>;

    hasTier(
        tier: number
    ): Promise<boolean>;
}
