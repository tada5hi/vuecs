/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, mergeProps } from 'vue';
import {
    ListSearchBuildOptions,
    ListSearchBuildOptionsInput,
} from './type';
import { buildFormInput } from '../form-input';
import { buildListBaseOptions } from '../utils';
import { Component } from '../../options';

export function buildListSearchOptions(
    input: ListSearchBuildOptionsInput,
) : ListSearchBuildOptions {
    const options = buildListBaseOptions(input, Component.ListSearch, {
        class: {
            alt: 'list-search',
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
        mergeProps({ class: options.class }, options.props),
        [
            buildFormInput({
                value: options.value,
                change: options.change,
                label: false,
                groupPrepend: true,
                groupPrependTextContent: h('i', {
                    class: 'fa fa-search',
                }),
            }),
        ],
    );
}
