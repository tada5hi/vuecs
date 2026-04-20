import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, VNodeArrayChildren, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
    toRef,
} from 'vue';
import type { PaginationMeta, PaginationMetaInput } from './type';
import { calculateOffset, calculatePage, calculatePagesTotal } from './utils';

export type PaginationThemeClasses = {
    root: string;
    item: string;
    link: string;
    linkActive: string;
    prevIcon: string;
    nextIcon: string;
    firstIcon: string;
    lastIcon: string;
};

const themeDefaults: PaginationThemeClasses = {
    root: 'vc-pagination',
    item: 'vc-pagination-item',
    link: 'vc-pagination-link',
    linkActive: 'active',
    prevIcon: '',
    nextIcon: '',
    firstIcon: '',
    lastIcon: '',
};

export const VCPagination = defineComponent({
    name: 'VCPagination',
    props: {
        total: { type: Number, default: 0 },
        limit: { type: Number, default: 0 },
        offset: { type: Number, default: undefined },
        busy: { type: Boolean, default: false },
        meta: { type: Object as PropType<PaginationMetaInput>, default: undefined },
        tag: { type: String, default: 'ul' },
        itemTag: { type: String, default: 'li' },
        iconTag: { type: String, default: 'i' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<PaginationThemeClasses>>, default: undefined },
    },
    emits: ['load'],
    setup(props, { emit }) {
        const theme = useComponentTheme('pagination', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const resolved = theme.value;

            const total = props.meta?.total ?? props.total;
            const limit = props.meta?.limit ?? props.limit;
            const isBusy = props.meta?.busy ?? props.busy;
            const inputOffset = props.meta?.offset ?? props.offset;

            let offset: number;
            if (typeof inputOffset === 'undefined') {
                offset = 0;
            } else {
                offset = inputOffset;
            }

            let pagesTotal = 1;
            let pageCurrent = 1;

            if (total && limit) {
                pagesTotal = calculatePagesTotal({ limit, total });
                pageCurrent = calculatePage({ limit, offset });
            }

            const pagesBetween: number[] = [];
            for (let i = pageCurrent - 2; i < (pageCurrent + 2); i++) {
                if (i > 0 && i <= pagesTotal) {
                    pagesBetween.push(i);
                }
            }

            const load = (page: number) => {
                if (isBusy || page === pageCurrent) return;

                const data: PaginationMeta = {
                    page,
                    offset: calculateOffset({ page, limit }),
                    limit,
                    total: pagesTotal,
                };

                emit('load', data);
            };

            const renderPage = (page: number, content: VNodeChild) => h(
                props.itemTag,
                { class: resolved.item || undefined },
                [
                    h('button', {
                        ...mergeProps(
                            page === pageCurrent ? { class: resolved.linkActive } : {},
                            { class: resolved.link || undefined },
                        ),
                        disabled: isBusy,
                        onClick($event: any) {
                            $event.preventDefault();
                            return load(page);
                        },
                    }, [content]),
                ],
            );

            const renderFirstPage = () => {
                if (pageCurrent < 3) return [];

                if (resolved.firstIcon) {
                    return renderPage(1, h(props.iconTag, { class: resolved.firstIcon }));
                }
                if (resolved.prevIcon) {
                    return renderPage(1, [
                        h(props.iconTag, { class: resolved.prevIcon }),
                        h(props.iconTag, { class: resolved.prevIcon }),
                    ]);
                }
                return renderPage(1, ['<<']);
            };

            const renderPreviousPage = () => {
                if (pageCurrent < 2) return [];

                if (resolved.prevIcon) {
                    return renderPage(pageCurrent - 1, h(props.iconTag, { class: resolved.prevIcon }));
                }
                return renderPage(pageCurrent - 1, ['<']);
            };

            const renderBetweenPages = () => {
                const children: VNodeArrayChildren = [];
                for (const page of pagesBetween) {
                    children.push(renderPage(page, page));
                }
                return children;
            };

            const renderNextPage = () => {
                if (pageCurrent === pagesTotal) return [];

                if (resolved.nextIcon) {
                    return renderPage(pageCurrent + 1, h(props.iconTag, { class: resolved.nextIcon }));
                }
                return renderPage(pageCurrent + 1, ['>']);
            };

            const renderLastPage = () => {
                if (pageCurrent >= (pagesTotal - 1)) return [];

                if (resolved.lastIcon) {
                    return renderPage(pagesTotal, h(props.iconTag, { class: resolved.lastIcon }));
                }
                if (resolved.nextIcon) {
                    return renderPage(pagesTotal, [
                        h(props.iconTag, { class: resolved.nextIcon }),
                        h(props.iconTag, { class: resolved.nextIcon }),
                    ]);
                }
                return renderPage(pagesTotal, ['>>']);
            };

            return h(
                props.tag,
                { class: resolved.root || undefined },
                [
                    renderFirstPage(),
                    renderPreviousPage(),
                    renderBetweenPages(),
                    renderNextPage(),
                    renderLastPage(),
                ],
            );
        };
    },
});
