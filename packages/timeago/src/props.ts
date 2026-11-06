import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { PropType } from 'vue';
import type { Converter, ConverterOptions, TimeagoThemeClasses  } from './types';

export const timeagoProps = {
    themeClass: { type: Object as PropType<ThemeClassesOverride<TimeagoThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    datetime: {
        type: [Object, Number, String] as PropType<Date | number | string>,
        required: true,
    },
    title: { type: [String, Boolean] },
    locale: { type: String },
    autoUpdate: {
        type: [Number, Boolean],
        default: true,
    },
    converter: { type: Function as PropType<Converter> },
    converterOptions: { type: Object as PropType<ConverterOptions> },
};
