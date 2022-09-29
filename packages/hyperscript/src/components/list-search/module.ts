/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, mergeProps } from 'vue';
import { Component } from '../constants';
import { buildListBaseOptions } from '../list-base';
import {
    ListSearchBuildOptions,
    ListSearchBuildOptionsInput,
} from './type';
import { buildFormInput } from '../form-input';

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
        options.tag,
        mergeProps({ class: options.class }, options.props),
        [
            buildFormInput({
                value: options.value,
                onChange: options.change,
                label: false,
                groupPrepend: true,
                groupPrependContent: h('i', {
                    class: 'fa fa-search',
                }),
            }),
        ],
    );
}
