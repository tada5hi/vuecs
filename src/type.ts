/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {AbilityMeta} from "@typescript-auth/core";
import {AuthModuleInterface} from "./auth";
import {LayoutKey} from "./contants";

export type NavigationComponentTier = number;

export type NavigationComponentConfig = {
    id?: string,
    default?: boolean,
    type?: 'separator' | 'link',

    name: string,
    url?: string,

    icon?: string,
    environment?: 'development' | 'production' | 'testing',
    [LayoutKey.REQUIRED_LOGGED_IN]?: boolean,
    [LayoutKey.REQUIRED_LOGGED_OUT]?: boolean,
    [LayoutKey.REQUIRED_PERMISSIONS]?: string[] | ((auth: AuthModuleInterface) => boolean),
    [LayoutKey.REQUIRED_ABILITY]?: AbilityMeta[] | ((auth: AuthModuleInterface) => boolean),

    display?: boolean,

    rootLink?: boolean,
    components?: NavigationComponentConfig[],

    [key: string]: any
};

// --------------------------------------------------------

export interface NavigationProviderInterface {
    getComponent(
        tier: NavigationComponentTier,
        id: string,
        context: NavigationProviderContext
    ) : Promise<NavigationComponentConfig | undefined>;

    getComponents(
        tier: NavigationComponentTier,
        context: NavigationProviderContext
    ) : Promise<NavigationComponentConfig[]>;

    hasTier(
        tier: NavigationComponentTier
    ) : Promise<boolean>;

    getContextForUrl?(url: string): Promise<NavigationProviderContext|undefined>;
}

export type NavigationProviderContext = {
    components: NavigationComponentConfig[]
}

// --------------------------------------------------------


export type NavigationComponentToggleContext = {
    component: NavigationComponentConfig,
    enable: boolean,
    display?: boolean
}
