/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MaybeRef, ToMaybeRef } from '../../type';

export type ItemActionToggleOptions<T> = {
    busy?: boolean,
    value: MaybeRef<T>,
    currentValue?: MaybeRef<T | T[] | null>,
    toggle?: (value: T) => void
};

export type ItemActionToggleOptionsInput<T> =
    Partial<Pick<ItemActionToggleOptions<T>, 'toggle'>> &
    ToMaybeRef<Pick<ItemActionToggleOptions<T>, 'value'>> &
    Partial<ToMaybeRef<Omit<ItemActionToggleOptions<T>, 'value' | 'toggle'>>>;
