import { describe, expect, it } from 'vitest';
import {
    DATE_RANGE_PRESET_KEYS,
    createDateRangePresets,
    fromDateInput,
    resolveDateRangePreset,
    toDateInput,
} from '../../src/utils/date-range';
import type { DateRangePreset } from '../../src/utils/date-range';

const findPreset = (key: string): DateRangePreset => {
    const preset = createDateRangePresets().find((item) => item.key === key);

    if (!preset) {
        throw new Error(`missing preset ${key}`);
    }

    return preset;
};

describe('date-range helpers', () => {
    it('runs under the pinned Europe/Berlin timezone', () => {
        // CET in winter (UTC+1 → offset -60), CEST in summer (UTC+2 → -120).
        expect(new Date(2026, 0, 15).getTimezoneOffset()).toBe(-60);
        expect(new Date(2026, 6, 15).getTimezoneOffset()).toBe(-120);
    });

    describe('toDateInput', () => {
        it('formats the local calendar day as YYYY-MM-DD', () => {
            expect(toDateInput(new Date(2026, 0, 5))).toBe('2026-01-05');
            expect(toDateInput(new Date(2026, 11, 31, 23, 59, 59, 999))).toBe('2026-12-31');
        });

        it('uses the local day, not the UTC day', () => {
            // 00:30 local on Jan 1 is still Dec 31 in UTC.
            expect(toDateInput(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
        });
    });

    describe('fromDateInput', () => {
        it('returns the UTC instant of local start-of-day', () => {
            expect(fromDateInput('2026-01-05', 'start')).toBe(new Date(2026, 0, 5).toISOString());
            expect(fromDateInput('2026-01-05', 'start')).toBe('2026-01-04T23:00:00.000Z');
        });

        it('returns the UTC instant of local end-of-day', () => {
            const value = fromDateInput('2026-01-05', 'end');

            expect(value).toBe('2026-01-05T22:59:59.999Z');

            const local = new Date(value!);

            expect([local.getHours(), local.getMinutes(), local.getSeconds(), local.getMilliseconds()])
                .toEqual([23, 59, 59, 999]);
        });

        it('handles the spring-forward DST day', () => {
            // 2026-03-29: Berlin switches CET (+1) -> CEST (+2) at 02:00.
            expect(fromDateInput('2026-03-29', 'start')).toBe(new Date(2026, 2, 29).toISOString());
            expect(fromDateInput('2026-03-29', 'start')).toBe('2026-03-28T23:00:00.000Z');

            const end = fromDateInput('2026-03-29', 'end');

            expect(end).toBe('2026-03-29T21:59:59.999Z');
            expect(end!.endsWith('.999Z')).toBe(true);
            expect(new Date(end!).getHours()).toBe(23);
        });

        it('includes a repeated final hour (fall-back at midnight) in the end bound', () => {
            // America/Santiago falls back at 2026-04-05 00:00 (-03 -> -04):
            // 23:00-23:59 on 2026-04-04 happens twice, so the day ends at
            // 2026-04-05T03:59:59.999Z, not at the first 23:59:59.999.
            // Synchronous on purpose: Node re-reads `TZ` on assignment, and
            // nothing else runs in this worker while it is switched.
            const previous = process.env.TZ;

            process.env.TZ = 'America/Santiago';

            try {
                expect(new Date(2026, 3, 4, 12).getTimezoneOffset()).toBe(180);
                expect(fromDateInput('2026-04-04', 'start')).toBe('2026-04-04T03:00:00.000Z');
                expect(fromDateInput('2026-04-04', 'end')).toBe('2026-04-05T03:59:59.999Z');
                // ordinary day after the switch
                expect(fromDateInput('2026-04-06', 'end')).toBe('2026-04-07T03:59:59.999Z');
                expect(fromDateInput('2026-02-30', 'end')).toBeUndefined();
            } finally {
                process.env.TZ = previous;
            }

            expect(new Date(2026, 0, 15).getTimezoneOffset()).toBe(-60);
        });

        it('handles the fall-back DST day', () => {
            // 2026-10-25: CEST (+2) -> CET (+1) at 03:00.
            expect(fromDateInput('2026-10-25', 'start')).toBe('2026-10-24T22:00:00.000Z');
            expect(fromDateInput('2026-10-25', 'end')).toBe('2026-10-25T22:59:59.999Z');
        });

        it('returns undefined for non-existent dates', () => {
            expect(fromDateInput('2026-02-30', 'start')).toBeUndefined();
            expect(fromDateInput('2026-02-29', 'end')).toBeUndefined();
            expect(fromDateInput('2026-13-01', 'start')).toBeUndefined();
            expect(fromDateInput('2026-00-10', 'start')).toBeUndefined();
            expect(fromDateInput('2026-04-31', 'start')).toBeUndefined();
        });

        it('accepts leap days in leap years', () => {
            expect(fromDateInput('2028-02-29', 'start')).toBe(new Date(2028, 1, 29).toISOString());
        });

        it('returns undefined for empty or malformed input', () => {
            expect(fromDateInput('', 'start')).toBeUndefined();
            expect(fromDateInput(undefined, 'end')).toBeUndefined();
            expect(fromDateInput('x', 'start')).toBeUndefined();
            expect(fromDateInput('2026-1-5', 'start')).toBeUndefined();
            expect(fromDateInput('2026-01-05T00:00', 'start')).toBeUndefined();
            expect(fromDateInput(' 2026-01-05', 'start')).toBeUndefined();
        });

        it('keeps four-digit years below 100 literal', () => {
            expect(fromDateInput('0050-06-01', 'start')).toBe(new Date('0050-06-01T00:00:00').toISOString());
        });
    });

    describe('presets', () => {
        it('exposes the default preset keys in order', () => {
            expect(createDateRangePresets().map((preset) => preset.key)).toEqual([...DATE_RANGE_PRESET_KEYS]);
            expect(DATE_RANGE_PRESET_KEYS).toEqual(['last7Days', 'thisMonth', 'thisYear']);
        });

        it('uses English labels by default and accepts overrides', () => {
            expect(createDateRangePresets().map((preset) => preset.label))
                .toEqual(['Last 7 days', 'This month', 'This year']);
            expect(createDateRangePresets({ thisMonth: 'Dieser Monat' })[1]!.label).toBe('Dieser Monat');
        });

        it('last7Days includes today and crosses the year boundary', () => {
            expect(resolveDateRangePreset(findPreset('last7Days'), new Date(2026, 0, 3, 15)))
                .toEqual({ from: '2025-12-28', to: '2026-01-03' });
        });

        it('last7Days spans a DST switch without drifting', () => {
            expect(resolveDateRangePreset(findPreset('last7Days'), new Date(2026, 2, 31, 0, 30)))
                .toEqual({ from: '2026-03-25', to: '2026-03-31' });
        });

        it('thisMonth on the last day of a 31-day month', () => {
            expect(resolveDateRangePreset(findPreset('thisMonth'), new Date(2026, 0, 31, 23, 59)))
                .toEqual({ from: '2026-01-01', to: '2026-01-31' });
        });

        it('thisMonth handles February and Dec 31', () => {
            expect(resolveDateRangePreset(findPreset('thisMonth'), new Date(2028, 1, 10)))
                .toEqual({ from: '2028-02-01', to: '2028-02-29' });
            expect(resolveDateRangePreset(findPreset('thisMonth'), new Date(2026, 11, 31, 23, 59)))
                .toEqual({ from: '2026-12-01', to: '2026-12-31' });
        });

        it('thisYear on Dec 31', () => {
            expect(resolveDateRangePreset(findPreset('thisYear'), new Date(2026, 11, 31, 23, 59)))
                .toEqual({ from: '2026-01-01', to: '2026-12-31' });
        });

        it('resolveDateRangePreset delegates to a custom resolver', () => {
            const preset: DateRangePreset = {
                key: 'today',
                label: 'Today',
                resolve: (now) => ({ from: toDateInput(now), to: toDateInput(now) }),
            };

            expect(resolveDateRangePreset(preset, new Date(2026, 4, 2)))
                .toEqual({ from: '2026-05-02', to: '2026-05-02' });
        });
    });
});
