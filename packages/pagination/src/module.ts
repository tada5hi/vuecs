/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    createOptionBuilder, isPromise,
} from '@vuecs/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import {
    h, isRef, mergeProps, unref,
} from 'vue';
import type { PaginationMeta, PaginationOptions, PaginationOptionsInput } from './type';
import { calculateOffset, calculatePage, calculatePagesTotal } from './utils';

export function buildPaginationOptions(
    options: PaginationOptionsInput,
) : PaginationOptions {
    const { buildOrFail, build } = createOptionBuilder<PaginationOptions>('pagination');

    return {
        ...options,

        busy: options.busy ?? false,

        tag: buildOrFail({
            key: 'tag',
            value: options.tag,
            alt: 'ul',
        }),
        class: buildOrFail({
            key: 'class',
            value: options.class,
            alt: 'pagination',
        }),

        itemTag: buildOrFail({
            key: 'itemTag',
            value: options.itemTag,
            alt: 'li',
        }),
        itemClass: buildOrFail({
            key: 'itemClass',
            value: options.itemClass,
            alt: 'page-item',
        }),

        linkClass: buildOrFail({
            key: 'linkClass',
            value: options.linkClass,
            alt: 'page-link',
        }),
        linkActiveClass: buildOrFail({
            key: 'linkActiveClass',
            value: options.linkActiveClass,
            alt: 'active',
        }),

        prevTag: buildOrFail({
            key: 'prevTag',
            value: options.prevTag,
            alt: 'i',
        }),
        prevClass: build({
            key: 'prevClass',
            value: options.prevClass,
            alt: [],
        }),
        prevContent: build({
            key: 'prevContent',
            value: options.prevContent,
        }),

        nextTag: buildOrFail({
            key: 'nextTag',
            value: options.nextTag,
            alt: 'i',
        }),
        nextClass: build({
            key: 'nextClass',
            value: options.nextClass,
            alt: [],
        }),
        nextContent: build({
            key: 'nextContent',
            value: options.nextContent,
        }),
    };
}

export function buildPagination(input: PaginationOptionsInput) : VNodeChild {
    const options = buildPaginationOptions(input);

    let pagesTotal = 1;
    let pageCurrent = 1;

    let offset : number;

    if (typeof options.offset === 'undefined') {
        if (
            typeof options.page !== 'undefined' &&
            typeof options.limit !== 'undefined'
        ) {
            offset = calculateOffset({
                page: options.page,
                limit: options.limit,
            });
        } else {
            offset = 0;
        }
    } else {
        offset = options.offset;
    }

    if (
        typeof options.total !== 'undefined' &&
        typeof options.limit !== 'undefined'
    ) {
        pagesTotal = calculatePagesTotal({
            limit: options.limit,
            total: options.total,
        });

        pageCurrent = calculatePage({
            limit: options.limit,
            offset,
        });
    }

    const pagesBetween : number[] = [];
    for (let i = pageCurrent - 2; i < (pageCurrent + 2); i++) {
        if (i > 0 && i <= pagesTotal) {
            pagesBetween.push(i);
        }
    }

    const busy = unref(options.busy);

    const load = (page: number) : any => {
        if (busy || page === pageCurrent) {
            return undefined;
        }

        if (isRef(options.busy)) {
            options.busy.value = true;
        }

        const data : PaginationMeta = {
            page,
            offset: calculateOffset({ page, limit: options.limit }),
            limit: options.limit,
            total: pagesTotal,
        };

        console.log(data);

        const output = options.load(data);
        if (isPromise(output)) {
            return output.finally(() => {
                if (isRef(options.busy)) {
                    options.busy.value = false;
                }
            });
        }

        if (isRef(options.busy)) {
            options.busy.value = false;
        }

        return output;
    };

    const renderPagePrevious = () => {
        let content : VNodeChild;

        if (options.prevClass || options.prevContent) {
            content = h(
                options.prevTag,
                { class: options.prevClass },
                options.prevContent,
            );
        } else {
            content = [pageCurrent - 1];
        }

        let prevPage : VNodeArrayChildren = [];
        if (pageCurrent > 1) {
            prevPage = [
                h(
                    options.itemTag,
                    {
                        class: options.itemClass,
                    },
                    [
                        h(
                            'button',
                            {
                                class: options.linkClass,
                                disabled: options.busy,
                                onClick($event: any) {
                                    $event.preventDefault();

                                    return load(pageCurrent - 1);
                                },
                            },
                            [content],
                        ),
                    ],
                ),
            ];
        }

        return prevPage;
    };

    const renderPagesBetween = () => {
        const children : VNodeArrayChildren = [];

        for (let i = 0; i < pagesBetween.length; i++) {
            const node = h(
                options.itemTag,
                {
                    class: options.itemClass,
                },
                [
                    h('button', {
                        ...mergeProps({
                            ...(
                                pagesBetween[i] === pageCurrent ?
                                    {
                                        class: options.linkActiveClass,
                                    } :
                                    {}
                            ),
                        }, {
                            class: options.linkClass,
                        }),
                        disabled: options.busy,
                        onClick($event: any) {
                            $event.preventDefault();

                            // eslint-disable-next-line prefer-rest-params
                            return load(pagesBetween[i]);
                        },
                    }, [
                        pagesBetween[i],
                    ]),
                ],
            );

            children.push(node);
        }

        return children;
    };

    const renderPageNext = () => {
        let nextPage : VNodeArrayChildren = [];

        let content : VNodeChild;

        if (options.nextClass || options.nextContent) {
            content = h(
                options.nextTag,
                { class: options.nextClass },
                options.nextContent,
            );
        } else {
            content = [pageCurrent + 1];
        }

        if (pageCurrent < pagesTotal) {
            nextPage = [
                h(options.itemTag, {
                    class: options.itemClass,
                }, [
                    h(
                        'button',
                        {
                            class: options.linkClass,
                            disabled: options.busy,
                            onClick($event: any) {
                                $event.preventDefault();

                                return load(pageCurrent + 1);
                            },
                        },
                        [content],
                    ),
                ]),
            ];
        }

        return nextPage;
    };

    return h(
        options.tag,
        {
            class: options.class,
        },
        [
            renderPagePrevious(),
            renderPagesBetween(),
            renderPageNext(),
        ],
    );
}
