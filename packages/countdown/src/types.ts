import type { CoreOptions } from '@vuecs/core';

import type { countdownProps } from './props';
import type { ExtractPublicPropTypes } from 'vue';

export type Options = CoreOptions;

export type CountdownThemeClasses = {
    root: string;
};

export type CountdownSlotProps = {
    isCounting: boolean;
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

export type CountdownProps = ExtractPublicPropTypes<typeof countdownProps>;
