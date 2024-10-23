import type {
    ComponentOptionsOverride, PartialPick, StoreManagerOptions, VNodeClass,
} from '@vuecs/core';
import type { MaybeRef, VNodeArrayChildren, VNodeChild } from 'vue';

export type PaginationMeta = {
    busy?: boolean,
    total: number,
    limit: number,
    offset: number,
    page: number
};

export type PaginationMetaInput = Omit<PaginationMeta, 'page' | 'offset'> &
Partial<Pick<PaginationMeta, 'page' | 'offset'>>;

export type PaginationOptions = {
    offset?: number,
    limit: number,
    total: number,

    page?: number,

    load: (meta: PaginationMeta) => (Promise<any> | any),
    busy: MaybeRef<boolean>,

    tag: string,
    class: VNodeClass,

    itemTag: string,
    itemClass: VNodeClass,

    linkClass: VNodeClass,
    linkActiveClass: VNodeClass,

    firstIconTag: string,
    firstIconClass?: VNodeClass,

    lastIconTag: string,
    lastIconClass?: VNodeClass,

    prevIconTag: string,
    prevIconClass?: VNodeClass,

    nextIconTag: string,
    nextIconClass?: VNodeClass,
};

export type PaginationOptionsInput = ComponentOptionsOverride<
PaginationOptions,
PartialPick<PaginationOptions,
'tag' |
'class' |
'itemTag' |
'itemClass' |
'linkClass' |
'linkActiveClass' |
'firstIconTag' |
'prevIconTag' |
'nextIconTag' |
'lastIconTag'
>
>;

type Options = {
    storeManager?: StoreManagerOptions
};

export type {
    Options,
};
