/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ExpectListBaseBuildOptions, ListBaseBuildOptionsInput, ListBaseOptions } from './type';
import { unrefWithDefault } from '../../utils';

type ListBaseOptionsDefaults = {
    type?: string,
    props?: Record<string, any>
};

export function buildListBaseOptions<T extends ListBaseBuildOptionsInput>(
    options: T,
    defaults?: ListBaseOptionsDefaults,
) : ExpectListBaseBuildOptions<T> & ListBaseOptions {
    defaults = defaults || {};

    return {
        ...options,

        type: unrefWithDefault(options.type, defaults.type || 'div'),

        slotItems: options.slotItems || {},
        slotProps: unrefWithDefault(options.slotProps, {}),

        props: unrefWithDefault(options.props, defaults.props || {}),
    };
}
