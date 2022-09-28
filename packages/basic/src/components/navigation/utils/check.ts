/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from '@vue-layout/core';
import { NavigationElement } from '../type';

export function isComponent(value: unknown) : value is NavigationElement {
    if (typeof value !== 'object') {
        return false;
    }

    const ob : Record<string, any> = value as object;
    if (
        hasOwnProperty(ob, 'id') &&
        typeof ob.id !== 'string' &&
        typeof ob.id !== 'number' &&
        typeof ob.id !== 'undefined'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'tier') &&
        (
            typeof ob.tier !== 'number' ||
            ob.tier < 0
        )
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'name') &&
        typeof ob.name !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'url') &&
        typeof ob.url !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'urlTarget') &&
        typeof ob.urlTarget !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'default') &&
        typeof ob.default !== 'boolean'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'type') &&
        (
            typeof ob.type !== 'string' ||
            ['separator', 'link'].indexOf(ob.type) === -1
        )
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'icon') &&
        typeof ob.icon !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'display') &&
        typeof ob.display !== 'boolean'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'displayChildren') &&
        typeof ob.displayChildren !== 'boolean'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'rootLink') &&
        typeof ob.rootLink !== 'boolean'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'components')
    ) {
        if (!Array.isArray(ob.components)) {
            return false;
        }

        for (let i = 0; i < ob.components.length; i++) {
            if (!isComponent(ob.components[i])) {
                return false;
            }
        }
    }

    return true;
}
