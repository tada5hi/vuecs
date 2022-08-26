/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, h, unref,
} from 'vue';
import { ItemActionToggleOptions } from './type';
import { unrefWithDefault } from '../../utils';
import { pushMaybeRefArrayValue, setMaybeRefValue, spliceMaybeRefArray } from '../utils';
import { MaybeRef } from '../../type';

export function buildItemActionToggle<T>(
    options: ItemActionToggleOptions<T>,
) : VNode {
    const busy = unrefWithDefault(options.busy, false);
    const value = unref(options.value);
    const currentValue = unref(options.currentValue);

    return h('button', {
        disabled: busy,
        class: [
            'btn btn-xs',
            {
                'btn-dark': value !== currentValue,
                'btn-warning': value === currentValue,
            },
        ],
        onClick($event: any) {
            $event.preventDefault();

            if (typeof options.toggle === 'function') {
                options.toggle(value);
            }

            if (Array.isArray(currentValue)) {
                const index = currentValue.indexOf(value);
                if (index === -1) {
                    pushMaybeRefArrayValue(options.currentValue as MaybeRef<T[]>, value);
                } else {
                    spliceMaybeRefArray(options.currentValue as MaybeRef<T[]>, index, 1);
                }

                return;
            }

            if (value === currentValue) {
                setMaybeRefValue(options.currentValue, null);

                return;
            }

            setMaybeRefValue(options.currentValue, value);
        },
    }, [
        h('i', {
            class: {
                'fa fa-plus': value !== currentValue,
                'fa fa-minus': value === currentValue,
            },
        }),
    ]);
}
