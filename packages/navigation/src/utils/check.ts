/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component } from '../type';
import { hasOwnProperty } from './has-own-property';

export function isComponent(value: unknown) : value is Component {
    if (typeof value !== 'object') {
        return false;
    }

    const ob : Record<string, any> = value as object;
    if (
        hasOwnProperty(ob, 'id') &&
        typeof ob.id !== 'string' &&
        typeof ob.id !== 'undefined'
    ) {
        return false;
    }

    if (
        hasOwnProperty(ob, 'id') &&
        (
            typeof ob.id !== 'number' ||
            ob.id < 0
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

    return true;
}
