/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationItem, NavigationItemsFn } from '../types';

export type NavigationManagerBuildOptions = {
    path: string
};

export type NavigationManagerOptions = {
    items: NavigationItemsFn | NavigationItem[]
};
