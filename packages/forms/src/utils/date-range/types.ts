import type { DATE_RANGE_PRESET_KEYS } from './constants';

/**
 * Value bound by `<VCFormDateRange v-model>`: local calendar days as
 * `YYYY-MM-DD` strings. A cleared side is an absent key, never `''`.
 */
export type DateRangeValue = {
    from?: string;
    to?: string;
};

/** A fully resolved range — both sides set, `YYYY-MM-DD`. */
export type DateRangeBounds = {
    from: string;
    to: string;
};

/** A named shortcut that resolves to a range relative to `now`. */
export type DateRangePreset = {
    /** Stable identifier (used as the render key). */
    key: string;
    /** Button text. */
    label: string;
    /** Resolve the range for the given reference instant. */
    resolve: (now: Date) => DateRangeBounds;
};

/** Which end of the local day `fromDateInput()` resolves to. */
export type DateInputEdge = 'start' | 'end';

/** Keys of the built-in presets. */
export type DateRangePresetKey = typeof DATE_RANGE_PRESET_KEYS[number];

/** Labels for the built-in presets, keyed by preset key. */
export type DateRangePresetLabels = Record<DateRangePresetKey, string>;
