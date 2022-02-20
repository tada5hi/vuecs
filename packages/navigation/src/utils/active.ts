/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component, ComponentsActive } from '../type';
import { parseTier } from './tier';

export function hasActiveComponent(
    components: ComponentsActive,
    tier: string | number,
) : boolean {
    return Object.prototype.hasOwnProperty.call(components, parseTier(tier));
}

export function getActiveComponent(
    components: ComponentsActive,
    tier: string | number,
) : Component | undefined {
    if (hasActiveComponent(components, tier)) {
        return components[parseTier(tier)];
    }

    return undefined;
}
