/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { buildPagination } from './module';
import type { PaginationMeta } from './type';

export const Pagination = defineComponent({
    name: 'Pagination',
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
        meta: {
            type: Object as PropType<PaginationMeta>,
            default: undefined,
        },
    },
    emits: ['load'],
    setup(props, { emit }) {
        const meta = computed<Partial<PaginationMeta>>(() => {
            if (typeof props.meta === 'undefined') {
                return {};
            }

            return props.meta;
        });

        return () => buildPagination({
            total: meta.value.total ?? props.total,
            limit: meta.value.limit ?? props.limit,
            offset: meta.value.offset ?? props.offset,
            busy: meta.value.busy ?? props.busy,
            load: (data) => emit('load', data),
        });
    },
});

export default Pagination;
