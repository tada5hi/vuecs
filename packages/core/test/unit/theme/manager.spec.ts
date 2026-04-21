import { describe, expect, it } from 'vitest';
import { ThemeManager } from '../../../src/theme/manager';
import { extend } from '../../../src/theme/extend';
import type { Theme } from '../../../src/theme/types';

describe('ThemeManager', () => {
    it('should resolve with defaults only', () => {
        const manager = new ThemeManager();
        const defaults = { classes: { root: 'vc-btn', icon: 'vc-btn-icon' } };
        const result = manager.resolve('button', defaults);
        expect(result).toEqual(defaults.classes);
    });

    it('should resolve with themes and overrides', () => {
        const theme: Theme = { elements: { button: { classes: { root: 'btn btn-primary' } } } };
        const manager = new ThemeManager({
            themes: [theme],
            overrides: { elements: { button: { classes: { icon: extend('fa fa-check') } } } },
        });
        const defaults = { classes: { root: 'vc-btn', icon: 'vc-btn-icon' } };
        const result = manager.resolve('button', defaults);
        expect(result.root).toBe('vc-btn btn btn-primary');
        expect(result.icon).toBe('vc-btn-icon fa fa-check');
    });

    it('should resolve with instance override', () => {
        const manager = new ThemeManager();
        const defaults = { classes: { root: 'vc-btn' } };
        const result = manager.resolve('button', defaults, { root: 'custom' });
        expect(result.root).toBe('custom');
    });

    it('should use classesMergeFn from overrides', () => {
        const dedupMerge = (a: string, b: string) => `${a} ${b}`.trim()
            .split(/\s+/)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .join(' ');

        const manager = new ThemeManager({ overrides: { elements: {}, classesMergeFn: dedupMerge } });
        const defaults = { classes: { root: 'a b' } };
        const result = manager.resolve('button', defaults, { root: extend('b c') });
        expect(result.root).toBe('a b c');
    });

    it('should use classesMergeFn from theme when overrides has none', () => {
        const pipeMerge = (a: string, b: string) => `${a}|${b}`;
        const theme: Theme = {
            elements: { button: { classes: { root: 'base' } } },
            classesMergeFn: pipeMerge,
        };
        const manager = new ThemeManager({ themes: [theme] });
        const defaults = { classes: { root: 'default' } };
        const result = manager.resolve('button', defaults, { root: extend('extra') });
        expect(result.root).toBe('default|base|extra');
    });

    it('should update themes via setThemes()', () => {
        const manager = new ThemeManager();
        const defaults = { classes: { root: 'vc-btn' } };

        expect(manager.resolve('button', defaults).root).toBe('vc-btn');

        manager.setThemes([{ elements: { button: { classes: { root: 'btn-primary' } } } }]);
        expect(manager.resolve('button', defaults).root).toBe('vc-btn btn-primary');
    });

    it('should update overrides via setOverrides()', () => {
        const manager = new ThemeManager();
        const defaults = { classes: { root: 'vc-btn' } };

        expect(manager.resolve('button', defaults).root).toBe('vc-btn');

        manager.setOverrides({ elements: { button: { classes: { root: 'custom' } } } });
        expect(manager.resolve('button', defaults).root).toBe('custom');
    });

    it('should clear overrides when set to undefined', () => {
        const manager = new ThemeManager({ overrides: { elements: { button: { classes: { root: 'override' } } } } });
        const defaults = { classes: { root: 'vc-btn' } };

        expect(manager.resolve('button', defaults).root).toBe('override');

        manager.setOverrides(undefined);
        expect(manager.resolve('button', defaults).root).toBe('vc-btn');
    });

    it('should expose themes and overrides via getters', () => {
        const theme: Theme = { elements: { button: { classes: { root: 'btn' } } } };
        const overrides: Theme = { elements: { button: { classes: { root: 'custom' } } } };
        const manager = new ThemeManager({ themes: [theme], overrides });

        expect(manager.themes).toEqual([theme]);
        expect(manager.overrides).toBe(overrides);
    });

    it('should resolve variant classes when variant values provided', () => {
        const manager = new ThemeManager();
        const defaults = {
            classes: { root: 'vc-btn' },
            variants: {
                size: {
                    sm: { root: 'btn-sm' },
                    lg: { root: 'btn-lg' },
                },
            },
            defaultVariants: { size: 'sm' } as Record<string, string | boolean>,
        };

        const result = manager.resolve('button', defaults, undefined, { size: 'lg' });
        expect(result.root).toBe('vc-btn btn-lg');
    });

    it('should apply defaultVariants when no explicit variant value is provided', () => {
        const manager = new ThemeManager();
        const defaults = {
            classes: { root: 'vc-btn' },
            variants: {
                size: {
                    sm: { root: 'btn-sm' },
                    lg: { root: 'btn-lg' },
                },
            },
            defaultVariants: { size: 'sm' } as Record<string, string | boolean>,
        };

        expect(manager.resolve('button', defaults).root).toBe('vc-btn btn-sm');
        expect(manager.resolve('button', defaults, undefined).root).toBe('vc-btn btn-sm');
        expect(manager.resolve('button', defaults, undefined, {}).root).toBe('vc-btn btn-sm');
    });

    it('should merge theme variant definitions with defaults', () => {
        const theme: Theme = {
            elements: {
                button: {
                    classes: { root: 'btn' },
                    variants: { size: { sm: { root: 'theme-sm' } } },
                },
            },
        };
        const manager = new ThemeManager({ themes: [theme] });
        const defaults = {
            classes: { root: 'vc-btn' },
            variants: {
                size: {
                    sm: { root: 'default-sm' },
                    lg: { root: 'default-lg' },
                },
            },
        };

        // sm is overridden by theme, lg kept from defaults
        const resultSm = manager.resolve('button', defaults, undefined, { size: 'sm' });
        expect(resultSm.root).toBe('vc-btn btn theme-sm');

        const resultLg = manager.resolve('button', defaults, undefined, { size: 'lg' });
        expect(resultLg.root).toBe('vc-btn btn default-lg');
    });
});
