/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNodeChild } from 'vue';
import { MaybeRef, OptionsInput, VNodeClass } from '@vue-layout/core';

export type ItemActionToggleOptions<T> = {
    type: string,
    class?: VNodeClass,

    disabledClass?: VNodeClass,
    enabledClass?: VNodeClass,

    childType: string,
    childDisabledClass?: VNodeClass,
    childDisabledContent?: VNodeChild,
    childEnabledClass?: VNodeClass,
    childEnabledContent?: VNodeChild,

    busy: boolean,
    value: MaybeRef<T>,
    currentValue?: MaybeRef<T | T[] | null>,
    onChange?: (value: T | T[] | null) => void
};

export type ItemActionToggleOptionsInput<T> =
    OptionsInput<ItemActionToggleOptions<T>,
    'value',
    'onChange' | 'currentValue'
    >;
