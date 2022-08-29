/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { VNode, VNodeArrayChildren, h } from 'vue';
import {
    ListActionRefreshBuildOptions,
    ListActionRefreshBuildOptionsInput,
} from './type';
import { unrefWithDefault } from '../../../utils';
import { buildListBaseOptions } from '../utils';

export function buildListActionRefreshOptions(
    input: ListActionRefreshBuildOptionsInput,
) : ListActionRefreshBuildOptions {
    const options = buildListBaseOptions(input, {
        type: 'button',
        props: {
            class: 'btn btn-xs btn-dark',
        },
    });

    return {
        ...options,

        load: unrefWithDefault(options.load, () => Promise.resolve()),
        busy: unrefWithDefault(options.busy, false),

        text: unrefWithDefault(options.text, true),
        textContent: unrefWithDefault(options.textContent, 'refresh'),

        icon: unrefWithDefault(options.icon, true),
        iconProps: unrefWithDefault(options.iconProps, {
            class: 'fa fa-refresh',
        }),
    };
}

export function buildListActionRefresh<T extends Record<string, any>>(
    input: ListActionRefreshBuildOptionsInput,
) : VNode | VNode[] {
    const options = buildListActionRefreshOptions(input);

    const refreshActionChildren : VNodeArrayChildren = [];
    if (options.icon) {
        refreshActionChildren.push(h('i', options.iconProps));
    }

    if (options.text) {
        if (
            options.icon &&
            typeof options.textContent === 'string'
        ) {
            refreshActionChildren.push(' ');
        }

        refreshActionChildren.push(options.textContent);
    }

    // todo: remove div wrapper ?
    return h(
        options.type,
        {
            ...(options.type === 'button' ? { type: options.type } : {}),
            disabled: options.busy,
            onClick($event: any) {
                $event.preventDefault();

                return options.load.apply(null);
            },
            ...options.props,
        },
        refreshActionChildren,
    );
}
