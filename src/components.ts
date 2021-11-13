/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Layout} from "./contants";
import {
    Component, ComponentType,
    ReduceComponentContext
} from "./type";
import {SideNavComponent} from "./side-nav";
import {MainNavComponent} from "./main-nav";

// --------------------------------------------------

type ToggleComponentContext = {
    type: ComponentType,
    navigationId?: string,
    component?: Component,

    inheritShow?: boolean,
    matchShow?: boolean
}

export function isComponentMatch(
    one?: Component,
    two?: Component
) : boolean {
    if(
        typeof one === 'undefined' ||
        typeof two === 'undefined'
    ) {
        return false;
    }

    if(
        one.hasOwnProperty('id') &&
        two.hasOwnProperty('id') &&
        (one as any).id !== (two as any).id
    ) {
        return false;
    }

    if(
        one.url &&
        two.url &&
        !(
            one.url === two.url ||
            one.url.startsWith(two.url) ||
            two.url.startsWith(one.url)
        )
    ) {
        return false;
    }

    if(
        one.name &&
        two.name &&
        one.name !== two.name
    ) {
        return false;
    }

    return true;
}

export function buildComponents<T extends MainNavComponent | SideNavComponent>(
    components: T[],
    context: ToggleComponentContext
) : {componentFound: boolean, components: T[]} {
    let componentFound = false;

    components = components
        .map(component => {
            const isMatch = isComponentMatch(context.component, component);

            if (
                component.components &&
                component.components.length > 0
            ) {
                const inheritShow = isMatch && context.matchShow;

                const child = buildComponents(component.components as T[], {
                    ...context,
                    inheritShow
                });

                component.components = child.components  as MainNavComponent[] | SideNavComponent[];
            }

            if(isMatch) {
                componentFound = true;
            }

            component.show = isMatch || (context.inheritShow ?? true);

            return component;
        });

    if(componentFound) {
        components = components.map(component => {
            component.show = true;
            return component;
        });
    }

    return {
        components,
        componentFound
    }
}

// --------------------------------------------------

export function reduceComponents<T extends MainNavComponent | SideNavComponent>(
    components: T[],
    context: ReduceComponentContext
) : T[] {
    return components
        .filter((component: Component) => {
            if (
                component.hasOwnProperty(Layout.REQUIRED_LOGGED_IN_KEY) &&
                component[Layout.REQUIRED_LOGGED_IN_KEY] &&
                !context.loggedIn
            ) {
                return false
            }

            if (
                component.hasOwnProperty(Layout.REQUIRED_LOGGED_OUT_KEY) &&
                component[Layout.REQUIRED_LOGGED_OUT_KEY] &&
                context.loggedIn
            ) {
                return false
            }

            const keys : string[] = [
                Layout.REQUIRED_PERMISSIONS_KEY,
                Layout.REQUIRED_ABILITY_KEY
            ];

            for(let i=0; i<keys.length; i++) {
                if(!component.hasOwnProperty(keys[i])) {
                    continue;
                }

                // @ts-ignore
                const required = component[keys[i]].filter(item => !!item);

                if(
                    Array.isArray(required) &&
                    required.length > 0
                ) {

                    if(Layout.REQUIRED_PERMISSIONS_KEY) {
                        return required.some(permission => context.auth.hasPermission(permission));
                    } else {
                        return required.some(ability => context.auth.hasAbility(ability));
                    }
                }

                if(typeof required === 'function') {
                    return required(context.auth);
                }
            }

            return true;
        });
}

