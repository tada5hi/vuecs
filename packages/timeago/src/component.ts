import { useComponentTheme, useLocale } from '@vuecs/core';
import type {
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    computed,
    defineComponent,
    h,
    onMounted,
    onUnmounted,
    ref,
    toRef,
    watch,
} from 'vue';
import { injectLocales } from './locales';
import type { Converter, ConverterOptions } from './type';
import { convert, injectConverter } from './converter';

export type TimeagoThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        timeago?: ThemeElementDefinition<TimeagoThemeClasses>;
    }
}

export const timeagoThemeDefaults: ComponentThemeDefinition<TimeagoThemeClasses> = { classes: { root: '' } };

const timeagoProps = {
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

export type TimeagoProps = ExtractPublicPropTypes<typeof timeagoProps>;

export const VCTimeago = defineComponent({
    name: 'VCTimeago',
    props: timeagoProps,
    setup(props) {
        const theme = useComponentTheme('timeago', props, timeagoThemeDefaults);

        const dateTimeProp = toRef(props, 'datetime');
        const localeProp = toRef(props, 'locale');
        const titleProp = toRef(props, 'title');
        const autoUpdateProp = toRef(props, 'autoUpdate');

        const locale = useLocale();
        const locales = injectLocales() || {};

        let converter = injectConverter();
        if (props.converter) {
            converter = props.converter;
        }
        if (!converter) {
            converter = convert;
        }

        const dateTime = computed(() => {
            let value : Date;
            if (typeof dateTimeProp.value === 'string') {
                value = new Date(dateTimeProp.value);
            } else if (typeof dateTimeProp.value === 'number') {
                value = new Date(dateTimeProp.value);
            } else {
                value = dateTimeProp.value;
            }

            return value;
        });

        const time = ref('');

        const calculate = () => {
            time.value = converter(
                dateTime.value,
                locales[localeProp.value || locale.value],
                props.converterOptions,
            );
        };

        calculate();

        let updater : ReturnType<typeof setInterval> | undefined;

        const startUpdater = () => {
            if (!autoUpdateProp.value) return;

            stopUpdater();

            const autoUpdate = autoUpdateProp.value === true ?
                60 :
                autoUpdateProp.value;

            updater = setInterval(() => {
                calculate();
            }, autoUpdate * 1000);
        };

        const stopUpdater = () => {
            if (!updater) return;

            clearInterval(updater);
            updater = undefined;
        };

        onMounted(() => startUpdater());
        onUnmounted(() => stopUpdater());

        watch(autoUpdateProp, (val) => {
            stopUpdater();

            if (val) {
                startUpdater();
            }
        });

        watch(dateTimeProp, () => {
            calculate();
        });

        watch(localeProp, () => {
            calculate();
        });

        watch(locale, () => {
            calculate();
        });

        return () => h(
            'time',
            {
                // Vue 3 forwards HTML attributes flat on the props
                // object — there's no `attrs:` sub-key (that was a
                // Vue 2 render-fn shape). The previous form silently
                // dropped `datetime` + `title`.
                class: theme.value.root || undefined,
                datetime: new Date(dateTimeProp.value).toISOString(),
                title: typeof titleProp.value === 'string' ?
                    titleProp.value :
                    time.value,
            },
            [time.value],
        );
    },
});
