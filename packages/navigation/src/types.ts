import type { StoreManagerOptions } from '@vuecs/core';
import type { ElementType } from './constants';

export type NavigationItem = {
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

    meta?: Record<string, any>
};

export type NavigationItemNormalized = Omit<NavigationItem, 'level' | 'children' | 'name'> & {
    name: string,
    level: number,
    children: NavigationItemNormalized[],

    trace: string[]
};

export type NavigationItemsFnContext = {
    level: number,
    parent?: NavigationItemNormalized
};

export type NavigationItemsFn = (
    ctx: NavigationItemsFnContext
) => Promise<NavigationItem[] | undefined>;

export type Options = {
    items: NavigationItemsFn | NavigationItem[]
    storeManager?: StoreManagerOptions
};
