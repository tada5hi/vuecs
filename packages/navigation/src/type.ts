import type { StoreManagerOptions } from '@vuecs/core';
import type { App, Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { ElementType } from './constants';
import type { NavigationProvider } from './provider';

export type NavigationItem = {
    id?: string | number,
    tier?: number,
    name?: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    type?: `${ElementType}`,

    icon?: string,

    active?: boolean,

    display?: boolean,
    displayChildren?: boolean,

    root?: boolean,
    children?: NavigationItem[],

    [key: string]: any
};

export type Options = {
    provider: NavigationProvider,
    storeManager?: StoreManagerOptions
};

export type NavigationBuildContext = {
    items?: NavigationItem[],
    itemsActive?: NavigationItem[],
    url?: string
    route?: RouteLocationNormalized
};
