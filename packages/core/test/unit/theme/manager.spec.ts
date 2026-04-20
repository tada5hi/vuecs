import { describe, expect, it } from 'vitest';
import { ThemeManager } from '../../../src/theme/manager';
import { extend } from '../../../src/theme/extend';
import type { Theme } from '../../../src/theme/types';

describe('ThemeManager', () => {
    it('should resolve with defaults only', () => {
        const manager = new ThemeManager();
        const defaults = { root: 'vc-btn', icon: 'vc-btn-icon' };
        const result = manager.resolve('button', defaults);
        expect(result).toEqual(defaults);
    });

    it('should resolve with themes and overrides', () => {
        const theme: Theme = { elements: { button: { root: 'btn btn-primary' } } };
        const manager = new ThemeManager({
            themes: [theme],
            overrides: { elements: { button: { icon: extend('fa fa-check') } } },
        });
        const defaults = { root: 'vc-btn', icon: 'vc-btn-icon' };
        const result = manager.resolve('button', defaults);
        expect(result.root).toBe('btn btn-primary');
        expect(result.icon).toBe('vc-btn-icon fa fa-check');
    });

    it('should resolve with instance override', () => {
        const manager = new ThemeManager();
        const defaults = { root: 'vc-btn' };
        const result = manager.resolve('button', defaults, { root: 'custom' });
        expect(result.root).toBe('custom');
    });

    it('should use classesMergeFn from overrides', () => {
        const dedupMerge = (a: string, b: string) => `${a} ${b}`.trim()
            .split(/\s+/)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .join(' ');

        const manager = new ThemeManager({ overrides: { elements: {}, classesMergeFn: dedupMerge } });
        const defaults = { root: 'a b' };
        const result = manager.resolve('button', defaults, { root: extend('b c') });
        expect(result.root).toBe('a b c');
    });

    it('should use classesMergeFn from theme when overrides has none', () => {
        const pipeMerge = (a: string, b: string) => `${a}|${b}`;
        const theme: Theme = {
            elements: { button: { root: 'base' } },
            classesMergeFn: pipeMerge,
        };
        const manager = new ThemeManager({ themes: [theme] });
        const defaults = { root: 'default' };
        const result = manager.resolve('button', defaults, { root: extend('extra') });
        expect(result.root).toBe('base|extra');
    });
});
