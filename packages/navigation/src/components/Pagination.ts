/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    defineComponent,
} from 'vue';
import { buildPagination } from '@vue-layout/utils';

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
    },
    emits: ['load'],
    setup(props, { emit }) {
        return () => buildPagination({
            total: props.total,
            limit: props.limit,
            offset: props.offset,
            load: (data) => emit('load', data),
        });
    },
});

export default Pagination;
