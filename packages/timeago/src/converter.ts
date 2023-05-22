/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { formatDistanceToNow } from 'date-fns';
import type { Converter, ConverterOptions } from './type';

export const convert : Converter = (date: Date | number, locale?: Locale, converterOptions?: ConverterOptions) => {
    const { includeSeconds, addSuffix = true } = converterOptions || {};

    return formatDistanceToNow(date, {
        locale,
        includeSeconds,
        addSuffix,
    });
};
