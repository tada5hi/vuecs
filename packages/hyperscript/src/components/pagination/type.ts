/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeArrayChildren } from 'vue';
import type { OptionsInput, VNodeClass } from '@vue-layout/core';
import type { ListLoadFn } from '../type';

export type PaginationOptions = {
    limit: number,
    offset: number,
    total: number,
    load: ListLoadFn,
    busy: boolean,

    tag: string,
    class: VNodeClass,

    itemTag: string,
    itemClass: VNodeClass,

    linkClass: VNodeClass,
    linkActiveClass: VNodeClass,

    prevType: string,
    prevClass?: VNodeClass,
    prevContent?: VNodeArrayChildren,

    nextType: string,
    nextClass?: VNodeClass,
    nextContent?: VNodeArrayChildren
};

export type PaginationOptionsInput = OptionsInput<
PaginationOptions,
'limit' | 'offset' | 'total' | 'load'
>;
