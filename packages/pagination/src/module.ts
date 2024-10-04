import {
    createComponentOptionsManager, isPromise, mergeOption,
} from '@vuecs/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import {
    h, isRef, mergeProps, unref,
} from 'vue';
import { CSSClassDefault } from './constants';
import type { PaginationMeta, PaginationOptions, PaginationOptionsInput } from './type';
import { calculateOffset, calculatePage, calculatePagesTotal } from './utils';

export function buildPaginationOptions(
    options: PaginationOptionsInput,
) : PaginationOptions {
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

        prevTag: manager.buildOrFail({
            key: 'prevTag',
            value: options.prevTag,
            alt: 'i',
        }),
        prevClass: manager.build({
            key: 'prevClass',
            value: options.prevClass,
            alt: [],
        }),
        prevContent: manager.build({
            key: 'prevContent',
            value: options.prevContent,
        }),

        nextTag: manager.buildOrFail({
            key: 'nextTag',
            value: options.nextTag,
            alt: 'i',
        }),
        nextClass: manager.build({
            key: 'nextClass',
            value: options.nextClass,
            alt: [],
        }),
        nextContent: manager.build({
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
