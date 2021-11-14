/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Component} from "./type";
import {isComponentMatch} from "./utils";

// --------------------------------------------------

type ToggleComponentContext = {
    component: Component,
    enable: boolean,

    show?: boolean
}

export function toggleComponentTree(
    components: Component[],
    context: ToggleComponentContext
) : {componentFound: boolean, components: Component[]} {
    let componentFound = false;

    components = components
        .map(component => {
            const isMatch = isComponentMatch(context.component, component);

            if (
                component.components &&
                component.components.length > 0
            ) {
                const child = toggleComponentTree(component.components, {
                    ...context,
                    show: isMatch
                });

                component.components = child.components;
            }

            if(isMatch) {
                componentFound = true;
            }

            component.show = (context.show || isMatch) && context.enable;

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

