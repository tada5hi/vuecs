/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    MaybeRef,
    OptionsInputValue, OptionsOverride, VNodeClass,
} from '@vue-layout/core';
import type { VNodeChild } from 'vue';

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
    OptionsOverride<ItemActionToggleOptions<T>,
    OptionsInputValue<Pick<ItemActionToggleOptions<T>,
    'type' |
    'class' |
    'disabledClass' |
    'enabledClass' |
    'childType' |
    'childDisabledClass' |
    'childDisabledContent' |
    'childEnabledClass' |
    'childEnabledContent'
    >>
    >;
