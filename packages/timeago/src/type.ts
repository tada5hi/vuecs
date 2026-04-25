import type { CoreOptions } from '@vuecs/core';
import type { Locale } from 'date-fns';

export {
    Locale,
};

export type ConverterOptions = {
    includeSeconds?: boolean | undefined,
    addSuffix?: boolean | undefined,
};

export type Converter = (date: number | Date, locale: Locale, options?: ConverterOptions) => string;

export type Locales = Record<string, Locale>;

export type InjectionContext = {
    locales: Record<string, Locale>,
    converter?: Converter
};

type Options = CoreOptions & {
    /**
     * default: en
     */
    locale?: string,
    /**
     * default: {}
     */
    locales?: Locales,
    converter?: Converter
};

export type {
    Options,
};
