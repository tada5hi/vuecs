/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { setMaybeRefValue } from '../utils';
import { ExpectFormBaseBuildOptions, FormBaseBuildOptions, FormBaseBuildOptionsInput } from './type';
import { unrefWithDefault } from '../../utils';

export function buildFormBaseOptions<T extends FormBaseBuildOptionsInput>(
    options: T,
) : ExpectFormBaseBuildOptions<T> & FormBaseBuildOptions {
    return {
        ...options,

        props: unrefWithDefault(options.props, {}),

        label: unrefWithDefault(options.label, true),
        labelContent: unrefWithDefault(options.labelContent, 'Input'),

        validationMessages: unrefWithDefault(options.validationMessages, {}),
        validationRulesResult: unrefWithDefault(options.validationRulesResult, {}),
    };
}

export function handleFormValueChanged(options: FormBaseBuildOptions, value: unknown) {
    if (typeof options.value !== 'undefined') {
        setMaybeRefValue(options.value, value);
    }

    if (typeof options.validationRulesResult.$model !== 'undefined') {
        setMaybeRefValue(options.validationRulesResult.$model, value);
    }

    if (options.change) {
        options.change.call(null, value);
    }

    return options;
}
