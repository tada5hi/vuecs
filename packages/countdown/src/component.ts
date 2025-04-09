import type { SlotsType } from 'vue';
import { defineComponent, h } from 'vue';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
const MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR;
const EVENT_VISIBILITY_CHANGE = 'visibilitychange';

export const VCCountdown = defineComponent({

    props: {
        /**
         * Starts the countdown automatically when initialized.
         */
        autoStart: {
            type: Boolean,
            default: true,
        },

        /**
         * Emits the countdown events.
         */
        emitEvents: {
            type: Boolean,
            default: true,
        },

        /**
         * The interval time (in milliseconds) of the countdown progress.
         */
        interval: {
            type: Number,
            default: 1000,
            validator: (value: number) => value >= 0,
        },

        /**
         * Generate the current time of a specific time zone.
         */
        now: {
            type: Function,
            default: () => Date.now(),
        },

        /**
         * The tag name of the component's root element.
         */
        tag: {
            type: String,
            default: 'span',
        },

        /**
         * The time (in milliseconds) to count down from.
         */
        time: {
            type: Number,
            default: 0,
            validator: (value: number) => value >= 0,
        },
    },
    slots: Object as SlotsType<{
        default: {
            days: number,
            hours: number,
            minutes: number,
            seconds: number,
            milliseconds: number,
            totalDays: number,
            totalHours: number,
            totalMinutes: number,
            totalSeconds: number,
            totalMilliseconds: number,
        }
    }>,

    data() : {
        counting: boolean,
        totalMilliseconds: number,
        requestId?: number,
        endTime: number,
        timeoutId?: ReturnType<typeof setTimeout> } {
        return {
            /**
             * It is counting down.
             * @type {boolean}
             */
            counting: false,

            /**
             * The absolute end time.
             * @type {number}
             */
            endTime: 0,

            /**
             * The remaining milliseconds.
             * @type {number}
             */
            totalMilliseconds: 0,

            /**
             * @type {number}
             */
            requestId: undefined,
            /**
             * @type {ReturnType<typeof setTimeout>}
             */
            timeoutId: undefined,
        };
    },

    computed: {
        /**
         * Remaining days.
         * @returns {number} The computed value.
         */
        days() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_DAY);
        },

        /**
         * Remaining hours.
         * @returns {number} The computed value.
         */
        hours() {
            return Math.floor((this.totalMilliseconds % MILLISECONDS_DAY) / MILLISECONDS_HOUR);
        },

        /**
         * Remaining minutes.
         * @returns {number} The computed value.
         */
        minutes() {
            return Math.floor((this.totalMilliseconds % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE);
        },

        /**
         * Remaining seconds.
         * @returns {number} The computed value.
         */
        seconds() {
            return Math.floor((this.totalMilliseconds % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND);
        },

        /**
         * Remaining milliseconds.
         * @returns {number} The computed value.
         */
        milliseconds() {
            return Math.floor(this.totalMilliseconds % MILLISECONDS_SECOND);
        },

        /**
         * Total remaining days.
         * @returns {number} The computed value.
         */
        totalDays() {
            return this.days;
        },

        /**
         * Total remaining hours.
         * @returns {number} The computed value.
         */
        totalHours() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_HOUR);
        },

        /**
         * Total remaining minutes.
         * @returns {number} The computed value.
         */
        totalMinutes() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_MINUTE);
        },

        /**
         * Total remaining seconds.
         * @returns {number} The computed value.
         */
        totalSeconds() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_SECOND);
        },
    },

    watch: {
        $props: {
            deep: true,
            immediate: true,

            /**
             * Update the countdown when props changed.
             */
            handler() {
                this.totalMilliseconds = this.time;
                this.endTime = this.now() + this.time;

                if (this.autoStart) {
                    this.start();
                }
            },
        },
    },

    mounted() {
        if (typeof document === 'undefined') return;
        document.addEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
    },

    beforeUnmount() {
        if (typeof document === 'undefined') return;
        document.removeEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
        this.pause();
    },

    methods: {
        /**
         * Starts to countdown.
         * @public
         * @emits VCCountdown#start
         */
        start() {
            if (this.counting) {
                return;
            }

            this.counting = true;

            if (this.emitEvents) {
                /**
                 * Countdown start event.
                 * @event VCCountdown#start
                 */
                this.$emit('start');
            }

            if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                this.continue();
            }
        },

        /**
         * Continues the countdown.
         * @private
         */
        continue() {
            if (!this.counting) {
                return;
            }

            const delay = Math.min(this.totalMilliseconds, this.interval);

            if (delay > 0) {
                if (typeof window.requestAnimationFrame !== 'undefined') {
                    let init : number;
                    let prev : number;
                    const step = (now: number) => {
                        if (!init) {
                            init = now;
                        }

                        if (!prev) {
                            prev = now;
                        }

                        const range = now - init;

                        if (
                            range >= delay ||

                            // Avoid losing time about one second per minute (now - prev ≈ 16ms) (#43)
                            range + ((now - prev) / 2) >= delay
                        ) {
                            this.progress();
                        } else {
                            this.requestId = requestAnimationFrame(step);
                        }

                        prev = now;
                    };

                    this.requestId = requestAnimationFrame(step);
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this.timeoutId = setTimeout(() => {
                        this.progress();
                    }, delay);
                }
            } else {
                this.end();
            }
        },

        /**
         * Pauses the countdown.
         * @private
         */
        pause() {
            if (
                typeof window.requestAnimationFrame !== 'undefined' &&
                typeof this.requestId !== 'undefined'
            ) {
                cancelAnimationFrame(this.requestId);
            } else if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
        },

        /**
         * Progresses to countdown.
         * @private
         * @emits VCCountdown#progress
         */
        progress() {
            if (!this.counting) {
                return;
            }

            this.totalMilliseconds -= this.interval;

            if (this.emitEvents && this.totalMilliseconds > 0) {
                /**
                 * Countdown progress event.
                 * @event VCCountdown#progress
                 */
                this.$emit('progress', {
                    days: this.days,
                    hours: this.hours,
                    minutes: this.minutes,
                    seconds: this.seconds,
                    milliseconds: this.milliseconds,
                    totalDays: this.totalDays,
                    totalHours: this.totalHours,
                    totalMinutes: this.totalMinutes,
                    totalSeconds: this.totalSeconds,
                    totalMilliseconds: this.totalMilliseconds,
                });
            }

            this.continue();
        },

        /**
         * Aborts the countdown.
         * @public
         * @emits VCCountdown#abort
         */
        abort() {
            if (!this.counting) {
                return;
            }

            this.pause();
            this.counting = false;

            if (this.emitEvents) {
                /**
                 * Countdown abort event.
                 * @event VCCountdown#abort
                 */
                this.$emit('abort');
            }
        },

        /**
         * Ends the countdown.
         * @public
         * @emits VCCountdown#end
         */
        end() {
            if (!this.counting) {
                return;
            }

            this.pause();
            this.totalMilliseconds = 0;
            this.counting = false;

            if (this.emitEvents) {
                /**
                 * Countdown end event.
                 * @event VCCountdown#end
                 */
                this.$emit('end');
            }
        },

        /**
         * Updates the count.
         * @private
         */
        update() {
            if (this.counting) {
                this.totalMilliseconds = Math.max(0, this.endTime - this.now());
            }
        },

        /**
         * visibility change event handler.
         * @private
         */
        handleVisibilityChange() {
            if (typeof document === 'undefined') return;

            switch (document.visibilityState) {
                case 'visible':
                    this.update();
                    this.continue();
                    break;

                case 'hidden':
                    this.pause();
                    break;

                default:
            }
        },
    },

    render() {
        return h(this.tag, this.$slots.default ? [
            this.$slots.default({
                days: this.days,
                hours: this.hours,
                minutes: this.minutes,
                seconds: this.seconds,
                milliseconds: this.milliseconds,
                totalDays: this.totalDays,
                totalHours: this.totalHours,
                totalMinutes: this.totalMinutes,
                totalSeconds: this.totalSeconds,
                totalMilliseconds: this.totalMilliseconds,
            }),
        ] : this.$slots.default);
    },
});

export default VCCountdown;
