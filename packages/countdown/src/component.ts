import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, ThemeElementDefinition, VariantValues } from '@vuecs/core';
import type { PropType, SlotsType } from 'vue';
import {
    computed,
    defineComponent,
    h,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
const MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR;
const EVENT_VISIBILITY_CHANGE = 'visibilitychange';

export type CountdownThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        countdown?: ThemeElementDefinition<CountdownThemeClasses>;
    }
}

const themeDefaults = { classes: { root: '' } };

export type CountdownSlotProps = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    totalMilliseconds: number;
};

export const VCCountdown = defineComponent({
    name: 'VCCountdown',
    props: {
        autoStart: { type: Boolean, default: true },
        emitEvents: { type: Boolean, default: true },
        interval: {
            type: Number, 
            default: 1000, 
            validator: (value: number) => value >= 0, 
        },
        now: { type: Function as PropType<() => number>, default: () => Date.now() },
        tag: { type: String, default: 'span' },
        time: {
            type: Number, 
            default: 0, 
            validator: (value: number) => value >= 0, 
        },
        themeClass: { type: Object as PropType<ThemeClassesOverride<CountdownThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['start', 'progress', 'abort', 'end'],
    slots: Object as SlotsType<{
        default: CountdownSlotProps;
    }>,
    setup(props, {
        emit, 
        expose, 
        slots, 
    }) {
        const theme = useComponentTheme('countdown', props, themeDefaults);

        const counting = ref(false);
        const totalMilliseconds = ref(0);
        const endTime = ref(0);
        let requestId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const days = computed(() => Math.floor(totalMilliseconds.value / MILLISECONDS_DAY));
        const hours = computed(() => Math.floor((totalMilliseconds.value % MILLISECONDS_DAY) / MILLISECONDS_HOUR));
        const minutes = computed(() => Math.floor((totalMilliseconds.value % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE));
        const seconds = computed(() => Math.floor((totalMilliseconds.value % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND));
        const milliseconds = computed(() => Math.floor(totalMilliseconds.value % MILLISECONDS_SECOND));
        const totalDays = computed(() => days.value);
        const totalHours = computed(() => Math.floor(totalMilliseconds.value / MILLISECONDS_HOUR));
        const totalMinutes = computed(() => Math.floor(totalMilliseconds.value / MILLISECONDS_MINUTE));
        const totalSeconds = computed(() => Math.floor(totalMilliseconds.value / MILLISECONDS_SECOND));

        const pause = () => {
            if (typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined' && typeof requestId !== 'undefined') {
                cancelAnimationFrame(requestId);
            } else if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };

        const end = () => {
            if (!counting.value) return;
            pause();
            totalMilliseconds.value = 0;
            counting.value = false;
            if (props.emitEvents) emit('end');
        };

        const progress = () => {
            if (!counting.value) return;

            totalMilliseconds.value -= props.interval;

            if (props.emitEvents && totalMilliseconds.value > 0) {
                emit('progress', {
                    days: days.value,
                    hours: hours.value,
                    minutes: minutes.value,
                    seconds: seconds.value,
                    milliseconds: milliseconds.value,
                    totalDays: totalDays.value,
                    totalHours: totalHours.value,
                    totalMinutes: totalMinutes.value,
                    totalSeconds: totalSeconds.value,
                    totalMilliseconds: totalMilliseconds.value,
                });
            }

            doContinue();
        };

        const doContinue = () => {
            if (!counting.value) return;

            const delay = Math.min(totalMilliseconds.value, props.interval);

            if (delay > 0) {
                if (typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined') {
                    let init: number;
                    let prev: number;
                    const step = (now: number) => {
                        if (!init) init = now;
                        if (!prev) prev = now;

                        const range = now - init;
                        if (range >= delay || range + ((now - prev) / 2) >= delay) {
                            progress();
                        } else {
                            requestId = requestAnimationFrame(step);
                        }
                        prev = now;
                    };
                    requestId = requestAnimationFrame(step);
                } else {
                    timeoutId = setTimeout(() => {
                        progress();
                    }, delay);
                }
            } else {
                end();
            }
        };

        const start = () => {
            if (counting.value) return;
            counting.value = true;
            if (props.emitEvents) emit('start');
            if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                doContinue();
            }
        };

        const abort = () => {
            if (!counting.value) return;
            pause();
            counting.value = false;
            if (props.emitEvents) emit('abort');
        };

        const update = () => {
            if (counting.value) {
                totalMilliseconds.value = Math.max(0, endTime.value - props.now());
            }
        };

        const handleVisibilityChange = () => {
            if (typeof document === 'undefined') return;
            switch (document.visibilityState) {
                case 'visible':
                    update();
                    doContinue();
                    break;
                case 'hidden':
                    pause();
                    break;
                default:
            }
        };

        // Watch props changes
        watch(() => [props.time, props.autoStart, props.now], () => {
            totalMilliseconds.value = props.time;
            endTime.value = props.now() + props.time;
            if (props.autoStart) {
                start();
            }
        }, { immediate: true });

        onMounted(() => {
            if (typeof document === 'undefined') return;
            document.addEventListener(EVENT_VISIBILITY_CHANGE, handleVisibilityChange);
        });

        onBeforeUnmount(() => {
            if (typeof document === 'undefined') return;
            document.removeEventListener(EVENT_VISIBILITY_CHANGE, handleVisibilityChange);
            pause();
        });

        expose({
            start, 
            abort, 
            end, 
        });

        return () => {
            const slotProps: CountdownSlotProps = {
                days: days.value,
                hours: hours.value,
                minutes: minutes.value,
                seconds: seconds.value,
                milliseconds: milliseconds.value,
                totalDays: totalDays.value,
                totalHours: totalHours.value,
                totalMinutes: totalMinutes.value,
                totalSeconds: totalSeconds.value,
                totalMilliseconds: totalMilliseconds.value,
            };

            return h(
                props.tag,
                { class: theme.value.root || undefined },
                slots.default ? slots.default(slotProps) : undefined,
            );
        };
    },
});
