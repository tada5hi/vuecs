/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNodeArrayChildren } from 'vue';
import { VNodeClass } from '../../type';

export type PaginationMeta = {
    limit: number,
    offset: number,
    total: number,
    page: number
};

export type PaginationOptions = {
    class: VNodeClass,
    itemClass: VNodeClass,

    linkClass: VNodeClass,
    linkActiveClass: VNodeClass,

    prevType?: string,
    prevClass?: VNodeClass,
    prevContent?: VNodeArrayChildren,

    nextType?: string,
    nextClass?: VNodeClass,
    nextContent?: VNodeArrayChildren
};
