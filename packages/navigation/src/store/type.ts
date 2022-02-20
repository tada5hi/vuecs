/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationComponentConfig } from '../type';

export type NavigationStateType = {
    tierComponents: Record<string, NavigationComponentConfig[]>,
    tierComponent: Record<string, NavigationComponentConfig | undefined>,
};

export type NavigationBuildContext = {
    activeComponents?: Record<string, NavigationComponentConfig>,
    url?: string
};
