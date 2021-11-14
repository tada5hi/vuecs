/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {AbilityMeta} from "@typescript-auth/core";

export type ComponentLevelName = `level-${number}`;

export type Component = {
    id?: string,
    level: ComponentLevelName,

    name: string,
    url?: string,
    icon?: string,
    environment?: 'development' | 'production' | 'testing',
    requireLoggedIn?: boolean,
    requirePermissions?: string[],
    requireLoggedOut?: boolean,
    show?: boolean

    type: 'separator' | 'link',
    rootLink?: boolean,
    components?: Component[]
};

// --------------------------------------------------------

export interface LayoutProviderInterface {
    setComponents(level: ComponentLevelName): Promise<void>;
    getComponent(level: ComponentLevelName, id: string) : Promise<Component | ComponentLevelName>;
    getComponents(level: ComponentLevelName) : Promise<Component[]>;
}

// --------------------------------------------------------

export type ReduceComponentContext = {
    loggedIn: boolean,
    show?: boolean,
    auth: AuthModule,
    [key: string]: any
}

// --------------------------------------------------------

export type AuthModule = {
    hasAbility(ability: AbilityMeta) : boolean;
    hasPermission(name: string): boolean;
    [key: string]: any
}


