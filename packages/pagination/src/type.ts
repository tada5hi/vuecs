import type {
    OptionsOverride, PartialPick, PluginBaseOptions, VNodeClass,
} from '@vuecs/core';
import type { MaybeRef, VNodeArrayChildren } from 'vue';

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
