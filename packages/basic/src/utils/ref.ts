/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isReadonly, isRef } from 'vue';
import { MaybeRef } from '../type';

export function setMaybeRefValue<T>(input: MaybeRef<T>, value: T) {
    if (isRef(input)) {
        if (!isReadonly(input)) {
            input.value = value;
        }
    } else {
        input = value;
    }

    return input;
}
