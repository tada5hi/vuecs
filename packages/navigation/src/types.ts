import type { StoreManagerOptions } from '@vuecs/core';
import type { ElementType } from './constants';

export type NavigationItem<
    META = any,
> = {
    level?: number,
    name: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    type?: `${ElementType}`,

    icon?: string,

    active?: boolean,
    activeMatch?: string,

    display?: boolean,
    displayChildren?: boolean,

    children?: NavigationItem[],

    meta?: META
};

export type NavigationItemNormalized<
    META = any,
> = Omit<NavigationItem<META>,
'name' |
'level' |
'children' |
'meta'
> & {
    name: string,
    level: number,
    children: NavigationItemNormalized<META>[],

    trace: string[],
    meta: META
};

export type NavigationItemsFnContext<
    META = any,
> = {
    level: number,
    parent?: NavigationItemNormalized<META>
};

export type NavigationItemsFn<
    META = any,
> = (
    ctx: NavigationItemsFnContext<META>
) => Promise<NavigationItem<META>[] | undefined>;

export type Options = {
    items: NavigationItemsFn | NavigationItem[]
    storeManager?: StoreManagerOptions
};
