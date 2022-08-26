/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ExpectFormbaseBuildOptions, FormBaseBuildOptions, FormBaseBuildOptionsInput } from './type';
import { unrefWithDefault } from '../../utils';

export function buildFormBaseOptions<T extends FormBaseBuildOptionsInput>(
    options: T,
) : ExpectFormbaseBuildOptions<T> & FormBaseBuildOptions {
    return {
        ...options,

        props: options.props || {},

        label: unrefWithDefault(options.label, true),
        labelContent: options.labelContent || 'Input',

        validationMessages: unrefWithDefault(options.validationMessages, {}),
        validationRules: options.validationRules || {},
    };
}
