import type {
    DateInputEdge,
    DateRangeBounds,
    DateRangePreset,
    DateRangePresetKey,
    DateRangePresetLabels,
} from './types';
import { DATE_RANGE_PRESET_KEYS, DATE_RANGE_PRESET_LABELS } from './constants';

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value: number, length = 2): string => String(value).padStart(length, '0');

/**
 * Build a local `Date` at the start (00:00:00.000, or the first existing
 * instant when midnight is skipped by a DST jump) of a calendar day.
 * `setFullYear` keeps years below 100 literal (the `Date` constructor maps
 * them onto 1900+).
 */
const createLocalDate = (
    year: number,
    monthIndex: number,
    day: number,
): Date => {
    const date = new Date(0);

    date.setFullYear(year, monthIndex, day);
    date.setHours(0, 0, 0, 0);

    return date;
};

/**
 * Format the **local** calendar day of `date` as `YYYY-MM-DD` — the value
 * format of a native `<input type="date">`.
 */
export function toDateInput(date: Date): string {
    return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Convert a `YYYY-MM-DD` local calendar day into the UTC ISO-8601 instant
 * (`…Z`, via `Date#toISOString()`) of its local start (00:00:00.000) or
 * end (its last millisecond, 23:59:59.999 — after any final hour a DST
 * fall-back repeats). Use it to turn a date-range filter into query bounds:
 * `gte = fromDateInput(from, 'start')`, `lte = fromDateInput(to, 'end')`.
 *
 * Returns `undefined` for empty, malformed, or non-existent days
 * (e.g. `2026-02-30`).
 */
export function fromDateInput(day: string | undefined, edge: DateInputEdge): string | undefined {
    if (!day) {
        return undefined;
    }

    const match = DATE_INPUT_PATTERN.exec(day);

    if (!match) {
        return undefined;
    }

    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const dayOfMonth = Number(match[3]);

    const date = createLocalDate(year, monthIndex, dayOfMonth);

    // Round-trip check: `Date` silently rolls over out-of-range parts
    // (Feb 30 -> Mar 2), so reject anything that doesn't map back.
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== monthIndex ||
        date.getDate() !== dayOfMonth
    ) {
        return undefined;
    }

    if (edge === 'end') {
        // The day ends 1ms before the NEXT local day starts — not at
        // `setHours(23, 59, 59, 999)`, which picks the first occurrence of
        // a final hour repeated by a fall-back DST switch at midnight.
        const next = createLocalDate(year, monthIndex, dayOfMonth + 1);

        return new Date(next.getTime() - 1).toISOString();
    }

    return date.toISOString();
}

/** Resolve a preset against the reference instant `now`. */
export function resolveDateRangePreset(preset: DateRangePreset, now: Date): DateRangeBounds {
    const { from, to } = preset.resolve(now);

    return { from, to };
}

const DATE_RANGE_PRESET_RESOLVERS: Record<DateRangePresetKey, DateRangePreset['resolve']> = {
    last7Days: (now) => ({
        // Calendar arithmetic on local parts — never `now - 6 * 86400000`,
        // which drifts by an hour across a DST switch.
        from: toDateInput(createLocalDate(now.getFullYear(), now.getMonth(), now.getDate() - 6)),
        to: toDateInput(now),
    }),
    thisMonth: (now) => ({
        from: toDateInput(createLocalDate(now.getFullYear(), now.getMonth(), 1)),
        // Day 0 of the next month is the last day of this one.
        to: toDateInput(createLocalDate(now.getFullYear(), now.getMonth() + 1, 0)),
    }),
    thisYear: (now) => ({
        from: toDateInput(createLocalDate(now.getFullYear(), 0, 1)),
        to: toDateInput(createLocalDate(now.getFullYear(), 11, 31)),
    }),
};

/**
 * Build the built-in presets (Last 7 days, This month, This year).
 * Pass `labels` to localize them.
 */
export function createDateRangePresets(labels: Partial<DateRangePresetLabels> = {}): DateRangePreset[] {
    return DATE_RANGE_PRESET_KEYS.map((key) => ({
        key,
        label: labels[key] ?? DATE_RANGE_PRESET_LABELS[key],
        resolve: DATE_RANGE_PRESET_RESOLVERS[key],
    }));
}
