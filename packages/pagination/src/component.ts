/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { buildPagination } from './module';
import type { PaginationMetaInput } from './type';

export const VCPagination = defineComponent({
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
        },
        busy: {
            type: Boolean,
            default: false,
        },
        meta: {
            type: Object as PropType<PaginationMetaInput>,
            default: undefined,
        },
    },
    emits: ['load'],
    setup(props, { emit }) {
        return () => buildPagination({
            total: props.meta?.total ?? props.total,
            limit: props.meta?.limit ?? props.limit,
            offset: props.meta?.offset ?? props.offset,
            busy: props.meta?.busy ?? props.busy,
            load: (data) => emit('load', data),
        });
    },
});

export default VCPagination;
