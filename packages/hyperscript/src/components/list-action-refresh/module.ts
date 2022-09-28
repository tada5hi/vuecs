/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import {
    VNode, VNodeArrayChildren, h, mergeProps, unref,
} from 'vue';
import {
    Preset, createOptionValueBuilder, isPromise, setMaybeRefValue, unrefWithDefault,
} from '@vue-layout/core';
import { Component } from '../constants';
import { ListActionRefreshBuildOptions, ListActionRefreshBuildOptionsInput } from './type';
import { buildListBaseOptions } from '../list-base';

export function buildListActionRefreshOptions(
    input: ListActionRefreshBuildOptionsInput,
) : ListActionRefreshBuildOptions {
    const options = buildListBaseOptions(input, Component.ListActionRefresh, {
        tag: {
            alt: 'button',
        },
        class: {
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'btn btn-xs btn-dark',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'btn btn-xs btn-dark',
                },
            },
        },
    });

    const { buildOrFail } = createOptionValueBuilder<ListActionRefreshBuildOptions>(
        Component.ListActionRefresh,
    );

    return {
        ...options,

        load: unrefWithDefault(options.load, () => Promise.resolve()),
        busy: options.busy ?? false,

        text: buildOrFail({
            key: 'text',
            value: unref(options.text),
            alt: true,
        }),
        textContent: buildOrFail({
            key: 'textContent',
            value: unref(options.textContent),
            alt: 'refresh',
        }),

        icon: buildOrFail({
            key: 'icon',
            value: unref(options.icon),
            alt: true,
        }),
        iconClass: buildOrFail({
            key: 'iconClass',
            value: unref(options.iconClass),
            alt: [],
            preset: {
                [Preset.FONT_AWESOME]: {
                    value: 'fa fa-refresh',
                },
            },
        }),
        iconContent: buildOrFail({
            key: 'iconContent',
            value: unref(options.iconContent),
            alt: [],
        }),
        iconProps: unrefWithDefault(options.iconProps, {}),
    };
}

export function buildListActionRefresh<T extends Record<string, any>>(
    input: ListActionRefreshBuildOptionsInput,
) : VNode | VNode[] {
    const options = buildListActionRefreshOptions(input);

    const refreshActionChildren : VNodeArrayChildren = [];
    if (options.icon) {
        refreshActionChildren.push(h(
            'i',
            mergeProps({ class: options.iconClass }, options.iconProps),
            [options.iconContent],
        ));
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

    return h(
        options.tag,
        mergeProps(
            {
                ...(options.tag === 'button' ? { type: options.tag } : {}),
                disabled: unref(options.busy),
                onClick($event: any) {
                    $event.preventDefault();

                    setMaybeRefValue(options.busy, true);

                    const promise = options.load.apply(null);

                    if (isPromise(promise)) {
                        promise
                            .then(() => setMaybeRefValue(options.busy, false))
                            .catch((e) => {
                                setMaybeRefValue(options.busy, false);
                                throw (e);
                            });
                    }

                    return promise;
                },
                class: options.class,
            },
            options.props,
        ),
        refreshActionChildren,
    );
}
