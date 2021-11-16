/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {AbilityMeta} from "@typescript-auth/core";
import {LayoutKey} from "./contants";

export type ComponentLevel = number;

export type Component = {
    id?: string,
    default?: boolean,
    type?: 'separator' | 'link',

    level?: ComponentLevel,
    parent?: string | Component,

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
    components?: Component[]
};

// --------------------------------------------------------

export interface LayoutProviderInterface {
    getComponent(level: ComponentLevel, id: string, context: LayoutProviderContext) : Promise<Component | undefined>;
    getComponents(level: ComponentLevel, context: LayoutProviderContext) : Promise<Component[]>;
    hasLevel(level: ComponentLevel) : Promise<boolean>;
    getContextForUrl?(url: string): Promise<LayoutProviderContext|undefined>;
}

export type LayoutProviderContext = {
    components: Component[]
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




