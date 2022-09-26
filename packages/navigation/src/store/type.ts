/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component, MaybeRef } from '../type';

export type StateType = {
    components: MaybeRef<Component[]>,
    componentsActive: MaybeRef<Component[]>,
    tiers?: MaybeRef<number>
};

export type BuildContext = {
    components?: Component[],
    url?: string
};
