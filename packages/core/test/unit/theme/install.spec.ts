import { describe, expect, it } from 'vitest';
import { createApp, h } from 'vue';
import { injectThemeManager, installThemeManager } from '../../../src/theme/install';
import { ThemeManager } from '../../../src/theme/manager';
import type { Theme } from '../../../src/theme/types';

describe('installThemeManager', () => {
    it('should create and provide a ThemeManager', () => {
        const app = createApp({ render: () => h('div') });
        const manager = installThemeManager(app);

        expect(manager).toBeInstanceOf(ThemeManager);
    });

    it('should return the same manager on second call (idempotent)', () => {
        const app = createApp({ render: () => h('div') });
        const first = installThemeManager(app);
        const second = installThemeManager(app, { themes: [{ elements: { x: { root: 'y' } } }] });

        expect(first).toBe(second);
    });

    it('should store themes from options', () => {
        const app = createApp({ render: () => h('div') });
        const theme: Theme = { elements: { button: { root: 'btn' } } };
        const manager = installThemeManager(app, { themes: [theme] });

        expect(manager.themes).toHaveLength(1);
        expect(manager.themes[0]).toBe(theme);
    });

    it('should store override classes from options', () => {
        const app = createApp({ render: () => h('div') });
        const manager = installThemeManager(app, { overrides: { elements: { button: { root: 'custom' } } } });

        expect(manager.overrides?.elements).toEqual({ button: { root: 'custom' } });
    });

    it('should store classesMergeFn from overrides', () => {
        const app = createApp({ render: () => h('div') });
        const fn = (a: string, b: string) => `${a}|${b}`;
        const manager = installThemeManager(app, { overrides: { elements: {}, classesMergeFn: fn } });

        expect(manager.overrides?.classesMergeFn).toBe(fn);
    });
});

describe('injectThemeManager', () => {
    it('should return undefined when no manager is installed', () => {
        const result = injectThemeManager();
        expect(result).toBeUndefined();
    });

    it('should return the manager when injected from app context', () => {
        const app = createApp({ render: () => h('div') });
        const installed = installThemeManager(app);
        const injected = injectThemeManager(app);

        expect(injected).toBe(installed);
    });
});
