/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component } from '../type';

export type StateType = {
    tierComponents: Record<string, Component[]>,
    tierComponent: Record<string, Component | undefined>,
};

export type BuildContext = {
    activeComponents?: Record<string, Component>,
    url?: string
};
