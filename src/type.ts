/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {AbilityMeta} from "@typescript-auth/core";
import {LayoutKey} from "./contants";

export type NavigationComponentLevel = number;

export type NavigationComponentConfig = {
    id?: string,
    default?: boolean,
    type?: 'separator' | 'link',

    level?: NavigationComponentLevel,
    parent?: string | NavigationComponentConfig,

    name: string,
    url?: string,

    icon?: string,
    environment?: 'development' | 'production' | 'testing',
    [LayoutKey.REQUIRED_LOGGED_IN]?: boolean,
    [LayoutKey.REQUIRED_LOGGED_OUT]?: boolean,
    [LayoutKey.REQUIRED_PERMISSIONS]?: string[] | ((auth: AuthModuleInterface) => boolean),
    [LayoutKey.REQUIRED_ABILITY]?: AbilityMeta[] | ((auth: AuthModuleInterface) => boolean),

    show?: boolean,

    rootLink?: boolean,
    components?: NavigationComponentConfig[]
};

// --------------------------------------------------------

export interface NavigationProviderInterface {
    getComponent(level: NavigationComponentLevel, id: string, context: NavigationProviderContext) : Promise<NavigationComponentConfig | undefined>;
    getComponents(level: NavigationComponentLevel, context: NavigationProviderContext) : Promise<NavigationComponentConfig[]>;
    hasLevel(level: NavigationComponentLevel) : Promise<boolean>;
    getContextForUrl?(url: string): Promise<NavigationProviderContext|undefined>;
}

export type NavigationProviderContext = {
    components: NavigationComponentConfig[]
}

export interface AuthModuleInterface {
    hasAbility(ability: AbilityMeta) : boolean;
    hasPermission(name: string): boolean;
    [key: string]: any
}

// --------------------------------------------------------

export type ReduceComponentContext = {
    loggedIn: boolean,
    show?: boolean,
    auth?: AuthModuleInterface,
    [key: string]: any
}

// --------------------------------------------------------




