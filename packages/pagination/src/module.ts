/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    createOptionValueBuilderForComponent,
    extractValueFromOptionValueInput,
    unrefWithDefault,
} from '@vue-layout/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import type { PaginationMeta, PaginationOptions, PaginationOptionsInput } from './type';

export function buildPaginationOptions(
    options: PaginationOptionsInput,
) : PaginationOptions {
    const { buildOrFail, build } = createOptionValueBuilderForComponent<PaginationOptions>('pagination');

    return {
        ...options,

        busy: unrefWithDefault(extractValueFromOptionValueInput(options.busy), false),

        tag: buildOrFail({
            key: 'tag',
            value: unref(options.tag),
            alt: 'ul',
        }),
        class: buildOrFail({
            key: 'class',
            value: unref(options.class),
            alt: 'pagination',
        }),

        itemTag: buildOrFail({
            key: 'itemTag',
            value: unref(options.itemTag),
            alt: 'li',
        }),
        itemClass: buildOrFail({
            key: 'itemClass',
            alt: 'page-item',
        }),

        linkClass: buildOrFail({
            key: 'linkClass',
            alt: 'page-link',
        }),
        linkActiveClass: buildOrFail({
            key: 'linkActiveClass',
            alt: 'active',
        }),

        prevType: buildOrFail({
            key: 'prevType',
            alt: 'i',
        }),
        prevClass: build({
            key: 'prevClass',
            alt: [],
        }),
        prevContent: build({
            key: 'prevContent',
        }),

        nextType: buildOrFail({
            key: 'nextType',
            alt: 'i',
        }),
        nextClass: build({
            key: 'nextClass',
            alt: [],
        }),
        nextContent: build({
            key: 'nextContent',
        }),
    };
}

export function buildPagination(input: PaginationOptionsInput) {
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

    const loadPage = (page: number) => {
        if (options.busy || page === currentPage) return;

        const data : PaginationMeta = {
            page,
            offset: (page - 1) * options.limit,
            limit: options.limit,
            total: totalPages,
        };

        options.load(data);
    };

    const renderPrevPage = () => {
        let content : VNodeChild;

        if (options.prevClass || options.prevContent) {
            content = h(
                options.prevType,
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

                                    return loadPage(currentPage - 1);
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
                            return loadPage(betweenPages[i]);
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
                options.nextType,
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

                                return loadPage(currentPage + 1);
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
