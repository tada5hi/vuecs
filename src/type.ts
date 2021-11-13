/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {AbilityMeta} from "@typescript-auth/core";
import {MainNavComponent} from "./main-nav";
import {SideNavComponent} from "./side-nav";

export type Component = MainNavComponent | SideNavComponent;
export type ComponentType = 'side' | 'main';

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


