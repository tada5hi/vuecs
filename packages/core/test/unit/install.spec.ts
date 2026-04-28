import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import vuecs, { injectDefaultsManager } from '../../src';
import type { ComponentDefaultValues, Icon } from '../../src';

// Test-local augmentation so we exercise typed defaults without casting.
type TestPaginationDefaults = {
    prevIcon: string;
    nextIcon: string;
    prevLabel: string;
};

declare module '../../src/defaults/types' {
    interface ComponentDefaults {
        __testPagination?: ComponentDefaultValues<TestPaginationDefaults>;
    }
}

describe('install — icons option', () => {
    it('merges a single icon preset into defaults', () => {
        const lucide: Icon = {
            defaults: {
                __testPagination: {
                    prevIcon: 'lucide:chevron-left',
                    nextIcon: 'lucide:chevron-right',
                },
            },
        };

        const app = createApp({ render: () => null });
        app.use(vuecs, { icons: [lucide] });
        const manager = injectDefaultsManager(app)!;
        expect(manager.get('__testPagination')).toEqual({
            prevIcon: 'lucide:chevron-left',
            nextIcon: 'lucide:chevron-right',
        });
    });

    it('merges multiple presets in array order — later preset wins per key', () => {
        const lucide: Icon = { defaults: { __testPagination: { prevIcon: 'lucide:chevron-left' } } };
        const fa: Icon = { defaults: { __testPagination: { prevIcon: 'fa6-solid:chevron-left' } } };

        const app = createApp({ render: () => null });
        app.use(vuecs, { icons: [lucide, fa] });
        const manager = injectDefaultsManager(app)!;
        expect(manager.get('__testPagination')).toEqual({ prevIcon: 'fa6-solid:chevron-left' });
    });

    it('consumer-supplied defaults win over icon presets', () => {
        const lucide: Icon = {
            defaults: {
                __testPagination: {
                    prevIcon: 'lucide:chevron-left',
                    prevLabel: 'Previous',
                },
            },
        };

        const app = createApp({ render: () => null });
        app.use(vuecs, {
            icons: [lucide],
            defaults: { __testPagination: { prevLabel: 'Zurück' } },
        });
        const manager = injectDefaultsManager(app)!;
        expect(manager.get('__testPagination')).toEqual({
            prevIcon: 'lucide:chevron-left',
            prevLabel: 'Zurück',
        });
    });

    it('different presets contributing different keys merge cleanly', () => {
        const iconsOnly: Icon = {
            defaults: {
                __testPagination: {
                    prevIcon: 'lucide:chevron-left',
                    nextIcon: 'lucide:chevron-right',
                },
            },
        };
        const labelsOnly: Icon = { defaults: { __testPagination: { prevLabel: 'Vorherige' } } };

        const app = createApp({ render: () => null });
        app.use(vuecs, { icons: [iconsOnly, labelsOnly] });
        const manager = injectDefaultsManager(app)!;
        expect(manager.get('__testPagination')).toEqual({
            prevIcon: 'lucide:chevron-left',
            nextIcon: 'lucide:chevron-right',
            prevLabel: 'Vorherige',
        });
    });

    it('falls through to consumer defaults when icons option is omitted', () => {
        const app = createApp({ render: () => null });
        app.use(vuecs, { defaults: { __testPagination: { prevLabel: 'Previous' } } });
        const manager = injectDefaultsManager(app)!;
        expect(manager.get('__testPagination')).toEqual({ prevLabel: 'Previous' });
    });

    it('handles icon presets without defaults (extensibility door)', () => {
        const noopPreset: Icon = {};

        const app = createApp({ render: () => null });
        app.use(vuecs, {
            icons: [noopPreset],
            defaults: { __testPagination: { prevLabel: 'Previous' } },
        });
        const manager = injectDefaultsManager(app)!;
        expect(manager.get('__testPagination')).toEqual({ prevLabel: 'Previous' });
    });
});
