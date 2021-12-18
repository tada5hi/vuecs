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

    context.rootLevel = typeof context.rootLevel === 'undefined' ? true : context.rootLevel;

    for(let i=0; i<components.length; i++) {
        const component = components[i];

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
                display: context.display || isMatch,
                rootLevel: false
            });

            component.components = child.components;
            if(child.componentFound) {
                componentFound = true;
            }

            component.displayChildren = context.enable && (isMatch || child.componentFound);
        }

        component.display = context.enable && context.display;

        components[i] = component;
    }

    components = components.map(component => {
        component.display = context.rootLevel || component.display || componentFound;

        return component;
    });

    return {
        components,
        componentFound
    }
}

