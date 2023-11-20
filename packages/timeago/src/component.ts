/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import {
    computed,
    defineComponent,
    getCurrentInstance,
    h,
    inject,
    isRef,
    ref,
    toRefs,
    watch,
} from 'vue';
import { InjectionKey } from './constants';
import type { Converter, ConverterOptions, InjectionContext } from './type';
import { convert } from './converter';

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
        },
        converter: {
            type: Function as PropType<Converter>,
        },
        converterOptions: {
            type: Object as PropType<ConverterOptions>,
        },
    },
    setup(props, ctx) {
        const refs = toRefs(props);

        const context = inject<InjectionContext>(InjectionKey);

        const getContextProperty = <K extends keyof InjectionContext>(key: K) : InjectionContext[K] | undefined => {
            if (!context) {
                return undefined;
            }

            return context[key];
        };

        const locales = getContextProperty('locales') || {};

        const instance = getCurrentInstance();
        const instanceLocale = computed(() => {
            if (!instance) {
                return 'en';
            }

            const value = instance.appContext.config.globalProperties.$timeagoLocale;
            if (!value) {
                return 'en';
            }

            return isRef(value) ? value.value : value;
        });

        const time = ref('');
        const calculate = (dateTime?: number | Date) => {
            let converter = refs.converter.value;
            if (
                !converter &&
                context &&
                context.converter
            ) {
                converter = context.converter;
            }

            if (!converter) {
                converter = convert;
            }

            if (!dateTime) {
                if (typeof refs.datetime.value === 'string') {
                    dateTime = new Date(refs.datetime.value);
                } else {
                    dateTime = refs.datetime.value;
                }
            }

            time.value = converter(
                dateTime,
                locales[refs.locale.value || instanceLocale.value],
                refs.converterOptions.value || {},
            );
        };

        calculate();

        let updater : any;

        const startUpdater = () => {
            if (refs.autoUpdate.value) {
                const autoUpdate = refs.autoUpdate.value === true ? 60 : refs.autoUpdate.value;
                updater = setInterval(() => {
                    calculate();
                }, autoUpdate * 1000);
            }
        };

        const stopUpdater = () => {
            if (updater) {
                clearInterval(updater);
                updater = null;
            }
        };

        watch(refs.autoUpdate, (val) => {
            stopUpdater();

            if (val) {
                startUpdater();
            }
        });

        watch(refs.datetime, () => {
            calculate();
        });

        watch(refs.locale, () => {
            calculate();
        });

        watch(refs.converter, () => {
            calculate();
        });

        watch(refs.converterOptions, () => {
            calculate();
        }, { deep: true });

        watch(instanceLocale, () => {
            calculate();
        });

        return () => h(
            'time',
            {
                attrs: {
                    datetime: new Date(refs.datetime.value).toISOString(),
                    title: typeof refs.title.value === 'string' ?
                        refs.title.value :
                        time.value,
                },
            },
            [time.value],
        );
    },
});
