/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { unref } from 'vue';
import { MaybeRef } from '../type';

export function unrefRecord(data: Record<string, MaybeRef<unknown>>) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = unref(data[keys[i]]);
    }

    return data;
}
