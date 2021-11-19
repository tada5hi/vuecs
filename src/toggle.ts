/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {NavigationComponentConfig, NavigationComponentToggleContext} from "./type";
import {isNavigationComponentMatch} from "./utils";

// --------------------------------------------------

export function toggleNavigationComponentTree(
    components: NavigationComponentConfig[],
    context: NavigationComponentToggleContext
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
                    display: isMatch
                });

                component.components = child.components;
                if(child.componentFound) {
                    componentFound = true;
                }
            }

            component.display = (context.display || componentFound) && context.enable;

            return component;
        });

    if(componentFound) {
        components = components.map(component => {
            component.display = true;
            return component;
        });
    }

    return {
        components,
        componentFound
    }
}

