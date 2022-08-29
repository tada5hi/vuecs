/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { useConfig } from '../module';
import { Component } from './constants';
import { ComponentConfig, ComponentOptions } from './type';

export function getComponentOption<
    C extends `${Component}` | Component,
    T extends keyof ComponentOptions<C>,
>(component: C, key: T) : ComponentOptions<C>[T] | undefined {
    const config = useConfig();

    if (typeof config.component[key] !== 'undefined') {
        return config.component[key];
    }
}

export function getComponentConfigDefault<
T extends keyof ComponentConfig,
    >(key: T) : ComponentConfig[T] | undefined {
    let value: unknown | undefined;

    switch (key) {
        case 'paginationClass':
            value = 'pagination';
            break;
        case 'paginationItemClass':
            value = 'page-item';
            break;
        case 'paginationLinkClass':
            value = 'page-link';
            break;
        case 'paginationLinkActiveClass':
            value = 'active';
            break;
    }

    return value as ComponentConfig[T];
}
