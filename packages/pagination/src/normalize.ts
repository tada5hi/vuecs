/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { createComponentOptionsManager, mergeOption } from '@vuecs/core';
import { CSSClassDefault } from './constants';
import type { PaginationOptions, PaginationOptionsInput } from './type';

export function buildPaginationOptions(
    options: PaginationOptionsInput,
): PaginationOptions {
    const manager = createComponentOptionsManager<PaginationOptions>({
        name: 'pagination',
    });

    return {
        ...options,

        busy: options.busy ?? false,

        tag: manager.buildOrFail({
            key: 'tag',
            value: options.tag,
            alt: 'ul',
        }),
        class: mergeOption(
            'class',
            manager.buildOrFail({
                key: 'class',
                value: options.class,
                alt: [],
            }),
            [CSSClassDefault.ROOT],
        ),

        itemTag: manager.buildOrFail({
            key: 'itemTag',
            value: options.itemTag,
            alt: 'li',
        }),
        itemClass: mergeOption(
            'class',
            manager.buildOrFail({
                key: 'itemClass',
                value: options.itemClass,
                alt: [],
            }),
            [CSSClassDefault.ITEM],
        ),

        linkClass: mergeOption(
            'class',
            manager.buildOrFail({
                key: 'linkClass',
                value: options.linkClass,
                alt: [],
            }),
            [CSSClassDefault.LINK],
        ),
        linkActiveClass: manager.buildOrFail({
            key: 'linkActiveClass',
            value: options.linkActiveClass,
            alt: 'active',
        }),

        firstIconTag: manager.buildOrFail({
            key: 'firstIconTag',
            value: options.firstIconTag,
            alt: 'i',
        }),
        firstIconClass: manager.build({
            key: 'firstIconClass',
            value: options.firstIconClass,
        }),

        lastIconTag: manager.buildOrFail({
            key: 'lastIconTag',
            value: options.lastIconTag,
            alt: 'i',
        }),
        lastIconClass: manager.build({
            key: 'lastIconClass',
            value: options.lastIconClass,
        }),

        prevIconTag: manager.buildOrFail({
            key: 'prevIconTag',
            value: options.prevIconTag,
            alt: 'i',
        }),
        prevIconClass: manager.build({
            key: 'prevIconClass',
            value: options.prevIconClass,
        }),

        nextIconTag: manager.buildOrFail({
            key: 'nextIconTag',
            value: options.nextIconTag,
            alt: 'i',
        }),
        nextIconClass: manager.build({
            key: 'nextIconClass',
            value: options.nextIconClass,
        }),
    };
}
