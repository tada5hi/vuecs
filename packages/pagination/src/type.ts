/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsOverride, PartialPick, PluginBaseOptions, VNodeClass,
} from '@vue-layout/core';
import type { MaybeRef, VNodeArrayChildren } from 'vue';

export type PaginationMeta = {
    busy?: boolean,
    total: number,
    limit: number,
    offset: number,
    page: number
};

export type PaginationOptions = {
    limit: number,
    offset: number,
    total: number,
    load: (meta: PaginationMeta) => (Promise<any> | any),
    busy: MaybeRef<boolean>,

    tag: string,
    class: VNodeClass,

    itemTag: string,
    itemClass: VNodeClass,

    linkClass: VNodeClass,
    linkActiveClass: VNodeClass,

    prevTag: string,
    prevClass?: VNodeClass,
    prevContent?: VNodeArrayChildren,

    nextTag: string,
    nextClass?: VNodeClass,
    nextContent?: VNodeArrayChildren
};

export type PaginationOptionsInput = OptionsOverride<
PaginationOptions,
PartialPick<PaginationOptions,
'tag' |
'class' |
'itemTag' |
'itemClass' |
'linkClass' |
'linkActiveClass' |
'prevTag' |
'nextTag'
>
>;

type Options = PluginBaseOptions;

export type {
    Options,
};
