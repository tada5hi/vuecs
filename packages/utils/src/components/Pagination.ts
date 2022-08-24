/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, defineComponent, h } from 'vue';

export type PaginationMeta = {
    limit?: number,
    offset?: number,
    total?: number,
    page?: number
};

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
    computed: {
        totalPages() {
            if (this.limit === 0 || this.total === 0) return 1;

            const pages = Math.ceil(this.total / this.limit);
            return pages >= 1 ? pages : 1;
        },
        currentPage() {
            if (this.limit === 0 || this.total === 0) return 1;

            return Math.floor(this.offset / this.limit) + 1;
        },
        pages() {
            const pages = [];

            for (let i = this.currentPage - 2; i < (this.currentPage + 2); i++) {
                if (i > 0 && i <= this.totalPages) {
                    pages.push(i);
                }
            }

            return pages;
        },
    },
    methods: {
        goTo(page: number) {
            if (this.busy || page === this.currentPage) return;

            const data : PaginationMeta = {
                page,
                offset: (page - 1) * this.limit,
                limit: this.limit,
            };

            this.$emit('load', data);
        },
    },
    render(): VNode {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm = this;

        let prevPage = h('');
        if (vm.currentPage > 1) {
            prevPage = h('li', { class: 'page-item' }, [
                h('button', {
                    class: 'page-link',
                    disabled: vm.busy,
                    onClick($event: any) {
                        $event.preventDefault();

                        // eslint-disable-next-line prefer-rest-params
                        return vm.goTo(vm.currentPage - 1);
                    },
                }, [
                    h('i', { class: 'fa fa-chevron-left' }),
                ]),
            ]);
        }

        const betweenPages = [];

        for (let i = 0; i < vm.pages.length; i++) {
            const node = h('li', { class: 'page-item' }, [
                h('button', {
                    class: {
                        active: vm.pages[i] === vm.currentPage,
                        'page-link': true,
                    },
                    disabled: vm.busy,
                    onClick($event: any) {
                        $event.preventDefault();

                        // eslint-disable-next-line prefer-rest-params
                        return vm.goTo(vm.pages[i]);
                    },
                }, [
                    vm.pages[i],
                ]),
            ]);

            betweenPages.push(node);
        }

        let nextPage = h('');
        if (vm.currentPage < vm.totalPages) {
            nextPage = h('li', { class: 'page-item' }, [
                h('button', {
                    class: 'page-link',
                    disabled: vm.busy,
                    onClick($event: any) {
                        $event.preventDefault();

                        // eslint-disable-next-line prefer-rest-params
                        return vm.goTo(vm.currentPage + 1);
                    },
                }, [
                    h('i', { class: 'fa fa-chevron-right' }),
                ]),
            ]);
        }

        return h('ul', { class: 'pagination justify-content-center' }, [
            prevPage,
            betweenPages,
            nextPage,
        ]);
    },
});

export default Pagination;
