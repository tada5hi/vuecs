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

    let totalPages = 1;
    let currentPage = 1;
    if (options.total > 0 && options.limit > 0) {
        totalPages = Math.max(Math.ceil(options.total / options.limit), 1);
        currentPage = Math.floor(options.offset / options.limit) + 1;
    }

    const betweenPages : number[] = [];
    for (let i = currentPage - 2; i < (currentPage + 2); i++) {
        if (i > 0 && i <= totalPages) {
            betweenPages.push(i);
        }
    }

    const busy = unref(options.busy);

    const load = (page: number) : any => {
        if (busy || page === currentPage) {
            return undefined;
        }

        if (isRef(options.busy)) {
            options.busy.value = true;
        }

        const data : PaginationMeta = {
            page,
            offset: (page - 1) * options.limit,
            limit: options.limit,
            total: totalPages,
        };

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

    const renderPrevPage = () => {
        let content : VNodeChild;

        if (options.prevClass || options.prevContent) {
            content = h(
                options.prevTag,
                { class: options.prevClass },
                options.prevContent,
            );
        } else {
            content = [currentPage - 1];
        }

        let prevPage : VNodeArrayChildren = [];
        if (currentPage > 1) {
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

                                    return load(currentPage - 1);
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

    const renderBetweenPages = () => {
        const children : VNodeArrayChildren = [];

        for (let i = 0; i < betweenPages.length; i++) {
            const node = h(
                options.itemTag,
                {
                    class: options.itemClass,
                },
                [
                    h('button', {
                        ...mergeProps({
                            ...(
                                betweenPages[i] === currentPage ?
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
                            return load(betweenPages[i]);
                        },
                    }, [
                        betweenPages[i],
                    ]),
                ],
            );

            children.push(node);
        }

        return children;
    };

    const renderNextPage = () => {
        let nextPage : VNodeArrayChildren = [];

        let content : VNodeChild;

        if (options.nextClass || options.nextContent) {
            content = h(
                options.nextTag,
                { class: options.nextClass },
                options.nextContent,
            );
        } else {
            content = [currentPage + 1];
        }

        if (currentPage < totalPages) {
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

                                return load(currentPage + 1);
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
            renderPrevPage(),
            renderBetweenPages(),
            renderNextPage(),
        ],
    );
}
