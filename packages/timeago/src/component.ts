import type { PropType } from 'vue';
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
import { injectLocale } from './locale';
import { injectLocales } from './locales';
import type { Converter, ConverterOptions } from './type';
import { convert, injectConverter } from './converter';

export const VCTimeago = defineComponent({
    props: {
        datetime: {
            type: [Object, Number, String] as PropType<Date | number | string>,
            required: true,
        },
        title: {
            type: [String, Boolean],
        },
        locale: {
            type: String,
        },
        autoUpdate: {
            type: [Number, Boolean],
            default: true,
        },
        converter: {
            type: Function as PropType<Converter>,
        },
        converterOptions: {
            type: Object as PropType<ConverterOptions>,
        },
    },
    setup(props) {
        const dateTimeProp = toRef(props, 'datetime');
        const localeProp = toRef(props, 'locale');
        const titleProp = toRef(props, 'title');
        const autoUpdateProp = toRef(props, 'autoUpdate');

        const locale = injectLocale();
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
                attrs: {
                    datetime: new Date(dateTimeProp.value).toISOString(),
                    title: typeof titleProp.value === 'string' ?
                        titleProp.value :
                        time.value,
                },
            },
            [time.value],
        );
    },
});
