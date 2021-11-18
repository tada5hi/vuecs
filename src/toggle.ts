/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {NavigationComponentConfig} from "./type";
import {isNavigationComponentMatch} from "./utils";

// --------------------------------------------------

type ToggleComponentContext = {
    component: NavigationComponentConfig,
    enable: boolean,

    show?: boolean
}

export function toggleNavigationComponentTree(
    components: NavigationComponentConfig[],
    context: ToggleComponentContext
) : {componentFound: boolean, components: NavigationComponentConfig[]} {
    let componentFound = false;

    components = components
        .map(component => {
            const isMatch = isNavigationComponentMatch(context.component, component);
            if(isMatch) {
                componentFound = true;
            }

            if (
                component.components &&
                component.components.length > 0
            ) {
                const child = toggleNavigationComponentTree(component.components, {
                    ...context,
                    show: isMatch
                });

                component.components = child.components;
                if(child.componentFound) {
                    componentFound = true;
                }
            }

            component.show = (context.show || componentFound) && context.enable;

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

