/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty, isObject } from '@vue-layout/core';
import type { NavigationItem } from '../type';

export function isNavigationItem(value: unknown) : value is NavigationItem {
    if (!isObject(value)) {
        return false;
    }

    if (
        hasOwnProperty(value, 'id') &&
        typeof value.id !== 'string' &&
        typeof value.id !== 'number' &&
        typeof value.id !== 'undefined'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'tier') &&
        (
            typeof value.tier !== 'number' ||
            value.tier < 0
        )
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'name') &&
        typeof value.name !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'url') &&
        typeof value.url !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'urlTarget') &&
        typeof value.urlTarget !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'default') &&
        typeof value.default !== 'boolean'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'type') &&
        (
            typeof value.type !== 'string' ||
            ['separator', 'link'].indexOf(value.type) === -1
        )
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'icon') &&
        typeof value.icon !== 'string'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'display') &&
        typeof value.display !== 'boolean'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'displayChildren') &&
        typeof value.displayChildren !== 'boolean'
    ) {
        return false;
    }

    if (
        hasOwnProperty(value, 'rootLink') &&
        typeof value.rootLink !== 'boolean'
    ) {
        return false;
    }

    if (hasOwnProperty(value, 'children')) {
        if (!Array.isArray(value.children)) {
            return false;
        }

        for (let i = 0; i < value.children.length; i++) {
            if (!isNavigationItem(value.children[i])) {
                return false;
            }
        }
    }

    return true;
}
