/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component } from '../type';
import { NavigationStateKey } from './constants';

export type StateType = {
    [NavigationStateKey.COMPONENTS]: Component[],
    [NavigationStateKey.COMPONENTS_ACTIVE]: Component[],
    [NavigationStateKey.TIERS]?: number
};

export type BuildContext = {
    componentsActive?: Component[],
    url?: string
};
