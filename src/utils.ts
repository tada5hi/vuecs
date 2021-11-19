/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {NavigationComponentConfig} from "./type";

export function isNavigationComponentMatch(
    one?: NavigationComponentConfig,
    two?: NavigationComponentConfig
): boolean {
    if (
        typeof one === 'undefined' ||
        typeof two === 'undefined'
    ) {
        return false;
    }

    if (
        one.hasOwnProperty('id') &&
        two.hasOwnProperty('id') &&
        (one as any).id !== (two as any).id
    ) {
        return false;
    }

    if (
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

    if (
        one.name &&
        two.name &&
        one.name !== two.name
    ) {
        return false;
    }

    return true;
}

export function initComponents(
    components: NavigationComponentConfig[],
    show: boolean = true
) {
    return components.map((component: NavigationComponentConfig) => {
        component.display = show;
        if(!component.type) {
            component.type = 'link';
        }

        if(component.components) {
            component.components = initComponents(component.components, false);
        }

        return component;
    });
}
