import { formatDistanceToNow } from 'date-fns';
import type { Converter, ConverterOptions, Locale } from './type';

export const convert : Converter = (date: Date | number, locale?: Locale, converterOptions?: ConverterOptions) => {
    const { includeSeconds, addSuffix = true } = converterOptions || {};

    return formatDistanceToNow(date, {
        locale,
        includeSeconds,
        addSuffix,
    });
};
