import type { Locale } from 'date-fns';

export {
    Locale,
};

export type ConverterOptions = {
    includeSeconds?: boolean | undefined,
    addSuffix?: boolean | undefined,
};

export type Converter = (date: number | Date, locale: Locale, options?: ConverterOptions) => string;

export type InjectionContext = {
    locales: Record<string, Locale>,
    converter?: Converter
};

type Options = {
    /**
     * default: en
     */
    locale?: string,
    /**
     * default: {}
     */
    locales?: Record<string, Locale>
    converter?: Converter
};

export type {
    Options,
};
