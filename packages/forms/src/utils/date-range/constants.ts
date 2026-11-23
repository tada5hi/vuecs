/** Keys of the built-in presets, in render order. */
export const DATE_RANGE_PRESET_KEYS = ['last7Days', 'thisMonth', 'thisYear'] as const;

/** English fallback labels of the built-in presets — the single source for the helpers and `<VCFormDateRange>`'s behavioral defaults. */
export const DATE_RANGE_PRESET_LABELS = {
    last7Days: 'Last 7 days',
    thisMonth: 'This month',
    thisYear: 'This year',
} as const satisfies Record<typeof DATE_RANGE_PRESET_KEYS[number], string>;
