/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNodeArrayChildren, VNodeChild, computed, defineComponent, h, mergeProps,
} from 'vue';
import { Component, buildOptionValue, buildOptionValueOrFail } from '../../options';
import { Library } from '../../constants';
import { PaginationMeta } from './type';

export const Pagination = defineComponent({
    props: {
        total: {
            type: Number,
            default: 0,
        },
        limit: {
            type: Number,
            default: 0,
        },
        offset: {
            type: Number,
            default: 0,
        },
        busy: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['load'],
    setup(props, { emit }) {
        const totalPages = computed(() => {
            if (props.limit === 0 || props.total === 0) return 1;

            const pages = Math.ceil(props.total / props.limit);
            return pages >= 1 ? pages : 1;
        });

        const currentPage = computed(() => {
            if (props.limit === 0 || props.total === 0) return 1;

            return Math.floor(props.offset / props.limit) + 1;
        });

        const pages = computed(() => {
            const items = [];

            for (let i = currentPage.value - 2; i < (currentPage.value + 2); i++) {
                if (i > 0 && i <= totalPages.value) {
                    items.push(i);
                }
            }

            return items;
        });

        const goTo = (page: number) => {
            if (props.busy || page === currentPage.value) return;

            const data : PaginationMeta = {
                page,
                offset: (page - 1) * props.limit,
                limit: props.limit,
                total: totalPages.value,
            };

            emit('load', data);
        };

        const renderPrevPage = () => {
            let content : VNodeChild;

            const prevClass = buildOptionValue({
                component: Component.Pagination,
                key: 'prevClass',
                alt: [],
                library: {
                    [Library.FONT_AWESOME]: {
                        value: 'fa fa-chevron-left',
                    },
                },
            });
            const prevContent = buildOptionValue({
                component: Component.Pagination,
                key: 'prevContent',
            });
            if (prevClass || prevContent) {
                content = h(
                    buildOptionValueOrFail({
                        component: Component.Pagination,
                        key: 'prevType',
                        alt: 'i',
                    }),
                    { class: prevClass },
                    prevContent,
                );
            } else {
                content = [currentPage.value - 1];
            }

            let prevPage : VNodeArrayChildren = [];
            if (currentPage.value > 1) {
                prevPage = [
                    h(
                        'li',
                        {
                            class: buildOptionValueOrFail({
                                component: Component.Pagination,
                                key: 'itemClass',
                                alt: 'page-item',
                            }),
                        },
                        [
                            h(
                                'button',
                                {
                                    class: buildOptionValueOrFail({
                                        component: Component.Pagination,
                                        key: 'linkClass',
                                        alt: 'page-link',
                                    }),
                                    disabled: props.busy,
                                    onClick($event: any) {
                                        $event.preventDefault();

                                        return goTo(currentPage.value - 1);
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
            const betweenPages : VNodeArrayChildren = [];

            for (let i = 0; i < pages.value.length; i++) {
                const node = h(
                    'li',
                    {
                        class: buildOptionValueOrFail({
                            component: Component.Pagination,
                            key: 'itemClass',
                            alt: 'page-item',
                        }),
                    },
                    [
                        h('button', {
                            ...mergeProps({
                                ...(
                                    pages.value[i] === currentPage.value ?
                                        {
                                            class: buildOptionValueOrFail({
                                                component: Component.Pagination,
                                                key: 'linkActiveClass',
                                                alt: 'active',
                                            }),
                                        } :
                                        {}
                                ),
                            }, {
                                class: buildOptionValueOrFail({
                                    component: Component.Pagination,
                                    key: 'linkClass',
                                    alt: 'page-link',
                                }),
                            }),
                            disabled: props.busy,
                            onClick($event: any) {
                                $event.preventDefault();

                                // eslint-disable-next-line prefer-rest-params
                                return goTo(pages.value[i]);
                            },
                        }, [
                            pages.value[i],
                        ]),
                    ],
                );

                betweenPages.push(node);
            }

            return betweenPages;
        };

        const renderNextPage = () => {
            let nextPage : VNodeArrayChildren = [];

            let content : VNodeChild;

            const nextClass = buildOptionValue({
                component: Component.Pagination,
                key: 'nextClass',
                alt: [],
                library: {
                    [Library.FONT_AWESOME]: {
                        value: 'fa fa-chevron-right',
                    },
                },
            });

            const nextContent = buildOptionValue({
                component: Component.Pagination,
                key: 'nextContent',
            });

            if (nextClass || nextContent) {
                content = h(
                    buildOptionValueOrFail({
                        component: Component.Pagination,
                        key: 'nextType',
                        alt: 'i',
                    }),
                    { class: nextClass },
                    nextContent,
                );
            } else {
                content = [currentPage.value + 1];
            }

            if (currentPage.value < totalPages.value) {
                nextPage = [
                    h('li', {
                        class: buildOptionValueOrFail({
                            component: Component.Pagination,
                            key: 'itemClass',
                            alt: 'page-item',
                        }),
                    }, [
                        h(
                            'button',
                            {
                                class: buildOptionValueOrFail({
                                    component: Component.Pagination,
                                    key: 'linkClass',
                                    alt: 'page-link',
                                }),
                                disabled: props.busy,
                                onClick($event: any) {
                                    $event.preventDefault();

                                    return goTo(currentPage.value + 1);
                                },
                            },
                            [content],
                        ),
                    ]),
                ];
            }

            return nextPage;
        };

        return () => h(
            'ul',
            {
                class: buildOptionValueOrFail({
                    component: Component.Pagination,
                    key: 'class',
                    alt: 'pagination',
                    library: {
                        [Library.BOOTSTRAP]: {
                            value: 'justify-content-center',
                        },
                        [Library.BOOTSTRAP_V5]: {
                            value: 'justify-content-center',
                        },
                    },
                }),
            },
            [
                renderPrevPage(),
                renderBetweenPages(),
                renderNextPage(),
            ],
        );
    },
});

export default Pagination;
