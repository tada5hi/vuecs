import { describe, expect, it } from 'vitest';
import { extend } from '../../../src/theme/extend';
import { resolveComponentTheme } from '../../../src/theme/resolve';
import type { 
    ComponentThemeDefinition, 
    Theme, 
    ThemeClassesOverride, 
    ThemeElementDefinition, 
} from '../../../src/theme/types';

describe('resolveComponentTheme', () => {
    const defaults: ComponentThemeDefinition = {
        classes: {
            root: 'vc-list-item',
            icon: 'vc-list-item-icon',
            actions: 'vc-list-item-actions',
        },
    };

    it('should return defaults when no overrides', () => {
        const result = resolveComponentTheme('listItem', defaults, [], undefined, undefined);
        expect(result).toEqual(defaults.classes);
    });

    it('should merge theme value with defaults', () => {
        const preset: Theme = { elements: { listItem: { classes: { root: 'flex items-center' } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], undefined, undefined);
        expect(result.root).toBe('vc-list-item flex items-center');
        expect(result.icon).toBe('vc-list-item-icon');
    });

    it('should extend slot value from preset with extend()', () => {
        const preset: Theme = { elements: { listItem: { classes: { root: extend('extra-class') } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], undefined, undefined);
        expect(result.root).toBe('vc-list-item extra-class');
    });

    it('should apply presets in array order, later replaces earlier but keeps defaults', () => {
        const preset1: Theme = { elements: { listItem: { classes: { root: 'from-preset-1' } } } };
        const preset2: Theme = { elements: { listItem: { classes: { root: 'from-preset-2' } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset1, preset2], undefined, undefined);
        expect(result.root).toBe('vc-list-item from-preset-2');
    });

    it('should extend across multiple presets, keeping defaults', () => {
        const preset1: Theme = { elements: { listItem: { classes: { root: 'base-class' } } } };
        const preset2: Theme = { elements: { listItem: { classes: { root: extend('added-class') } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset1, preset2], undefined, undefined);
        expect(result.root).toBe('vc-list-item base-class added-class');
    });

    it('should apply user override replacing everything including defaults', () => {
        const preset: Theme = { elements: { listItem: { classes: { root: 'preset-class' } } } };
        const overrides: Record<string, ThemeElementDefinition> = { listItem: { classes: { root: 'user-class' } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], overrides, undefined);
        expect(result.root).toBe('user-class');
    });

    it('should extend user theme over preset+defaults', () => {
        const preset: Theme = { elements: { listItem: { classes: { root: 'preset-class' } } } };
        const overrides: Record<string, ThemeElementDefinition> = { listItem: { classes: { root: extend('user-extra') } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], overrides, undefined);
        expect(result.root).toBe('vc-list-item preset-class user-extra');
    });

    it('should apply instance theme as highest priority, replacing everything', () => {
        const preset: Theme = { elements: { listItem: { classes: { root: 'preset-class' } } } };
        const overrides: Record<string, ThemeElementDefinition> = { listItem: { classes: { root: 'user-class' } } };
        const instanceTheme: ThemeClassesOverride = { root: 'instance-class' };
        const result = resolveComponentTheme('listItem', defaults, [preset], overrides, instanceTheme);
        expect(result.root).toBe('instance-class');
    });

    it('should extend instance theme over user theme', () => {
        const overrides: Record<string, ThemeElementDefinition> = { listItem: { classes: { root: 'user-class' } } };
        const instanceTheme: ThemeClassesOverride = { root: extend('instance-extra') };
        const result = resolveComponentTheme('listItem', defaults, [], overrides, instanceTheme);
        expect(result.root).toBe('user-class instance-extra');
    });

    it('should use custom mergeFn for theme layer', () => {
        const customMerge = (a: string, b: string) => `${a}|${b}`;
        const preset: Theme = { elements: { listItem: { classes: { root: 'extra' } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], undefined, undefined, customMerge);
        expect(result.root).toBe('vc-list-item|extra');
    });

    it('should add new slot keys from presets', () => {
        const preset: Theme = { elements: { listItem: { classes: { newSlot: 'new-class' } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], undefined, undefined);
        expect((result as Record<string, string>).newSlot).toBe('new-class');
    });

    it('should ignore unrelated component themes', () => {
        const preset: Theme = { elements: { otherComponent: { classes: { root: 'other-class' } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], undefined, undefined);
        expect(result).toEqual(defaults.classes);
    });

    it('should ignore theme entries without classes', () => {
        const preset: Theme = { elements: { listItem: { variants: { size: { sm: { root: 'py-1' } } } } } };
        const result = resolveComponentTheme('listItem', defaults, [preset], undefined, undefined);
        expect(result).toEqual(defaults.classes);
    });

    it('should handle extend on empty default string', () => {
        const result = resolveComponentTheme(
            'comp',
            { classes: { root: '' } },
            [{ elements: { comp: { classes: { root: extend('added') } } } }],
            undefined,
            undefined,
        );
        expect(result.root).toBe('added');
    });

    it('should handle theme with empty extend value', () => {
        const result = resolveComponentTheme(
            'comp',
            { classes: { root: 'base' } },
            [{ elements: { comp: { classes: { root: extend('') } } } }],
            undefined,
            undefined,
        );
        expect(result.root).toBe('base');
    });

    it('should not call mergeFn for replace in override layer', () => {
        let mergeCalled = false;
        const mergeFn = (a: string, b: string) => {
            mergeCalled = true;
            return `${a} ${b}`;
        };
        resolveComponentTheme(
            'comp',
            { classes: { root: 'default' } },
            [],
            { comp: { classes: { root: 'replaced' } } },
            undefined,
            mergeFn,
        );
        expect(mergeCalled).toBe(false);
    });

    it('should not mutate the defaults object', () => {
        const myDefaults = { classes: { root: 'original' } };
        const result = resolveComponentTheme(
            'comp',
            myDefaults,
            [{ elements: { comp: { classes: { root: 'added' } } } }],
            undefined,
            undefined,
        );
        expect(myDefaults.classes.root).toBe('original');
        expect(result.root).toBe('original added');
    });
});
