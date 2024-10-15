import type { StoreManagerOptions } from '@vuecs/core';
import type { ElementType } from './constants';

export type NavigationItem = {
    id?: string | number,
    tier?: number,
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

export type NavigationItemNormalized = Omit<NavigationItem, 'tier' | 'children' | 'name'> & {
    name: string,
    tier: number,
    children: NavigationItemNormalized[],

    trace: string[]
};

export type NavigationItemsFn = (
    tier: number,
    parent?: NavigationItemNormalized
) => Promise<NavigationItem[] | undefined>;

export type Options = {
    items: NavigationItemsFn | NavigationItem[]
    storeManager?: StoreManagerOptions
};
