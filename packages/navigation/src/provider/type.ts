/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { Component } from '../type';

export interface ProviderInterface {
    getComponents(
        tier: number,
        components: Component[]
    ): Promise<Component[]>;

    getComponentsActive(url: string): Promise<Component[]>;

    hasTier(
        tier: number
    ): Promise<boolean>;
}
