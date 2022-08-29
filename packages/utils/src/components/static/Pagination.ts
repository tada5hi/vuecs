/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNodeArrayChildren, computed, defineComponent, h, mergeProps,
} from 'vue';
import { Component } from '../../config/component/constants';
import { getComponentOption } from '../../config/component/module';
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
            let prevPage = h('');
            if (currentPage.value > 1) {
                prevPage = h(
                    'li',
                    { class: getComponentOption(Component.Pagination, 'paginationItemClass') },
                    [
                        h('button', {
                            class: getComponentOption(Component.Pagination, 'paginationLinkClass'),
                            disabled: props.busy,
                            onClick($event: any) {
                                $event.preventDefault();

                                return goTo(currentPage.value - 1);
                            },
                        }, [
                            h('i', { class: 'fa fa-chevron-left' }),
                        ]),
                    ],
                );
            }

            return prevPage;
        };

        const renderBetweenPages = () => {
            const betweenPages : VNodeArrayChildren = [];

            for (let i = 0; i < pages.value.length; i++) {
                const node = h(
                    'li',
                    { class: getComponentOption('paginationItemClass') },
                    [
                        h('button', {
                            ...mergeProps({
                                ...(
                                    pages.value[i] === currentPage.value ?
                                        {
                                            class: getComponentOption('paginationLinkActiveClass'),
                                        } :
                                        {}
                                ),
                            }, {
                                class: getComponentOption('paginationLinkClass'),
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
            let nextPage = h('');

            if (currentPage.value < totalPages.value) {
                nextPage = h('li', { class: getComponentOption('paginationItemClass') }, [
                    h('button', {
                        class: getComponentOption('paginationLinkClass'),
                        disabled: props.busy,
                        onClick($event: any) {
                            $event.preventDefault();

                            return goTo(currentPage.value + 1);
                        },
                    }, [
                        h('i', { class: 'fa fa-chevron-right' }),
                    ]),
                ]);
            }

            return nextPage;
        };

        return () => h(
            'ul',
            { class: getComponentOption('paginationClass') },
            [
                renderPrevPage(),
                renderBetweenPages(),
                renderNextPage(),
            ],
        );
    },
});

export default Pagination;
