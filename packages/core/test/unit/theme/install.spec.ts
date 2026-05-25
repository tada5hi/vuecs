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

    // #1591 — per-package install() runs first with no themes, then top-level
    // app.use(vuecs, { themes: [...] }) must still apply.
    it('should merge themes from a second call into the existing manager', () => {
        const app = createApp({ render: () => h('div') });
        // First call: simulates a per-package install with no themes.
        installThemeManager(app);
        // Second call: simulates app.use(vuecs, { themes: [...] }) afterwards.
        const tailwind: Theme = { elements: { button: { classes: { root: 'btn-tailwind' } } } };
        const manager = installThemeManager(app, { themes: [tailwind] });

        expect(manager.themes).toHaveLength(1);
        expect(manager.themes[0]).toBe(tailwind);
    });

    it('should append themes when both calls supply themes', () => {
        const app = createApp({ render: () => h('div') });
        const a: Theme = { elements: { button: { classes: { root: 'btn-a' } } } };
        const b: Theme = { elements: { button: { classes: { root: 'btn-b' } } } };
        installThemeManager(app, { themes: [a] });
        const manager = installThemeManager(app, { themes: [b] });

        expect(manager.themes).toEqual([a, b]);
    });

    it('should apply overrides from a second call to the existing manager', () => {
        const app = createApp({ render: () => h('div') });
        installThemeManager(app);
        const overrides: Theme = { elements: { button: { classes: { root: 'custom' } } } };
        const manager = installThemeManager(app, { overrides });

        expect(manager.overrides).toBe(overrides);
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
