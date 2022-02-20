/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationComponentConfig, TierComponentsActive } from '../type';
import { parseTier } from './tier';

export function hasActiveComponent(
    components: TierComponentsActive,
    tier: string | number,
) : boolean {
    return Object.prototype.hasOwnProperty.call(components, parseTier(tier));
}

export function getActiveComponent(
    components: TierComponentsActive,
    tier: string | number,
) : NavigationComponentConfig | undefined {
    if (hasActiveComponent(components, tier)) {
        return components[parseTier(tier)];
    }

    return undefined;
}
