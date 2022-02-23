/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component, Components, ComponentsActive } from '../type';

export type StateType = {
    tierComponents: Components,
    tierComponent: ComponentsActive,
};

export type BuildContext = {
    activeComponents?: ComponentsActive,
    url?: string
};
