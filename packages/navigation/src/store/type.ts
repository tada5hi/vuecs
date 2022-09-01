/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component } from '../type';

export type StateType = {
    components: Component[],
    componentsActive: Component[],
    tiers?: number
};

export type BuildContext = {
    components?: Component[],
    url?: string
};
