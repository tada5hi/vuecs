/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Component, ComponentLevelName} from "./type";

let components : Record<ComponentLevelName, Component[]> = {};

export function setComponents(level: ComponentLevelName, items: Component[]) {
    components[level] = items;
}

export function getMainNavComponents(level: ComponentLevelName) : Component[] {
    return components[level];
}

export function getComponentBy(
    level: ComponentLevelName,
    id: string
) : Component | undefined {
    if(!components.hasOwnProperty(level)) {
        return undefined;
    }

    const index = components[level].findIndex(navigation => navigation.id === id);
    if(index !== -1) {
        return components[level][index];
    }

    return undefined;
}
