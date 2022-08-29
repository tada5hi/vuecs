/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, unref } from 'vue';
import {
    ListSearchBuildOptions,
    ListSearchBuildOptionsInput,
} from './type';
import { buildListBaseOptions } from '../utils';
import {buildFormInput} from "../../form";

export function buildListSearchOptions(
    input: ListSearchBuildOptionsInput,
) : ListSearchBuildOptions {
    const options = buildListBaseOptions(input, {
        props: {
            class: 'list-search',
        },
    });

    return {
        ...options,
    };
}

export function buildListSearch(input?: ListSearchBuildOptionsInput) {
    input = input || {};
    const options = buildListSearchOptions(input);

    return h(
        options.type,
        options.props,
        [
            buildFormInput({
                value: options.value,
                change: options.change,
                prepend: true,
                prependTextContent: h('i', {
                    class: 'fa fa-search',
                })
            }),
        ],
    );
}
