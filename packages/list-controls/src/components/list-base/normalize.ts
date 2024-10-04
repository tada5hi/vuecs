/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createComponentOptionsManager } from '@vuecs/core';
import type { Component } from '../constants';
import type { ListBaseOptions, ListBaseOptionsDefaults, ListBaseOptionsInput } from './types';

type Entity<T extends ListBaseOptionsInput<any, any>> = T extends ListBaseOptionsInput<infer U, any> ? U : never;
type Meta<T extends ListBaseOptionsInput<any, any>> = T extends ListBaseOptionsInput<any, infer U> ? U : never;

export function normalizeListBaseOptions<
    T extends ListBaseOptionsInput<any, any>,
    M = Meta<T>,
>(
    options: T,
    component: Component,
    defaults?: ListBaseOptionsDefaults<Entity<T>, M>,
): ListBaseOptions<Entity<T>, M> {
    defaults = defaults || {};

    const manager = createComponentOptionsManager<ListBaseOptions<Entity<T>, M>>({
        name: component,
    });

    return {
        slotItems: options.slotItems || {},
        slotProps: manager.buildOrFail({
            key: 'slotProps',
            value: options.slotProps,
            alt: defaults.slotProps || {},
        }),
        slotPropsBuilt: options.slotPropsBuilt,

        tag: manager.buildOrFail({
            key: 'tag',
            value: options.tag,
            alt: defaults.tag || 'div',
        }),
        class: manager.buildOrFail({
            key: 'class',
            value: options.class,
            alt: defaults.class || [],
        }),
        props: manager.buildOrFail({
            key: 'props',
            value: options.props,
            alt: defaults.props || {},
        }),

        total: options.total,
        load: options.load,
        meta: (options.meta || {}) as M,
        busy: options.busy,

        itemId: options.itemId,
        itemKey: options.itemKey,

        onCreated: options.onCreated,
        onUpdated: options.onUpdated,
        onDeleted: options.onDeleted,
    };
}
