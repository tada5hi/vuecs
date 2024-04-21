import type { App } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import type {
    Converter, ConverterOptions, Locale,
} from './type';
import {
    inject, provide,
} from './utils';

const ConverterSymbol = Symbol.for('TConverter');

export function provideConverter(
    value: Converter,
    app?: App,
) {
    provide(ConverterSymbol, value, app);
}

export function injectConverter() : Converter | undefined {
    return inject<Converter>(ConverterSymbol, undefined);
}

export const convert : Converter = (date: Date | number, locale?: Locale, converterOptions?: ConverterOptions) => {
    const { includeSeconds, addSuffix = true } = converterOptions || {};

    return formatDistanceToNow(date, {
        locale,
        includeSeconds,
        addSuffix,
    });
};
