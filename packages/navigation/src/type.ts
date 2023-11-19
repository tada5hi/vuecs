/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PluginBaseOptions } from '@vue-layout/core';
import type { ElementType } from './constants';
import type { NavigationProvider } from './provider';

export type NavigationItem = {
    id?: string | number,
    tier?: number,
    name?: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    type?: `${ElementType}`,

    icon?: string,

    active?: boolean,

    display?: boolean,
    displayChildren?: boolean,

    rootLink?: boolean,
    children?: NavigationItem[],

    requireLoggedIn?: boolean,
    requireLoggedOut?: boolean,
    requirePermissions?: string | string[] | ((checker: (name: string) => boolean) => boolean)

    [key: string]: any
};

export type Options = PluginBaseOptions & {
    provider: NavigationProvider
};
