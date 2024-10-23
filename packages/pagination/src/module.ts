import { isPromise } from '@vuecs/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import {
    h, isRef, mergeProps, unref,
} from 'vue';
import { buildPaginationOptions } from './normalize';
import type { PaginationMeta, PaginationOptionsInput } from './type';
import { calculateOffset, calculatePage, calculatePagesTotal } from './utils';

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

    const renderPage = (page: number, content: VNodeChild) => h(
        options.itemTag,
        {
            class: options.itemClass,
        },
        [
            h(
                'button',
                {
                    ...mergeProps({
                        ...(
                            page === pageCurrent ?
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

                        return load(page);
                    },
                },
                [content],
            ),
        ],
    );

    const renderFirstPage = () => {
        if (pageCurrent < 3) {
            return [];
        }

        if (options.firstIconClass) {
            return renderPage(1, h(
                options.firstIconTag,
                { class: options.firstIconClass },
            ));
        }

        if (options.prevIconClass) {
            return renderPage(1, [
                h(
                    options.prevIconTag,
                    { class: options.prevIconClass },
                ), h(
                    options.prevIconTag,
                    { class: options.prevIconClass },
                ),
            ]);
        }

        return renderPage(1, ['<<']);
    };

    const renderPreviousPage = () => {
        if (pageCurrent < 2) {
            return [];
        }

        if (options.prevIconClass) {
            return renderPage(pageCurrent - 1, h(
                options.prevIconTag,
                { class: options.prevIconClass },
            ));
        }

        return renderPage(pageCurrent - 1, ['<']);
    };

    const renderBetweenPages = () => {
        const children : VNodeArrayChildren = [];

        for (let i = 0; i < pagesBetween.length; i++) {
            children.push(renderPage(pagesBetween[i], pagesBetween[i]));
        }

        return children;
    };

    const renderNextPage = () => {
        if (pageCurrent === pagesTotal) {
            return [];
        }

        if (options.nextIconClass) {
            return renderPage(pageCurrent + 1, h(
                options.prevIconTag,
                { class: options.nextIconClass },
            ));
        }

        return renderPage(pageCurrent + 1, ['>']);
    };

    const renderLastPage = () => {
        if (pageCurrent >= (pagesTotal - 1)) {
            return [];
        }

        if (options.lastIconClass) {
            return renderPage(pagesTotal, h(
                options.lastIconTag,
                { class: options.lastIconClass },
            ));
        }

        if (options.nextIconClass) {
            return renderPage(pagesTotal, [
                h(
                    options.nextIconTag,
                    { class: options.nextIconClass },
                ), h(
                    options.nextIconTag,
                    { class: options.nextIconClass },
                ),
            ]);
        }

        return renderPage(pagesTotal, ['>>']);
    };

    return h(
        options.tag,
        {
            class: options.class,
        },
        [
            renderFirstPage(),
            renderPreviousPage(),
            renderBetweenPages(),
            renderNextPage(),
            renderLastPage(),
        ],
    );
}
