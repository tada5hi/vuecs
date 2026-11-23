import { describe, expect, it } from 'vitest';
import { ThemeManager } from '@vuecs/core';
import { formRadioGroupThemeDefaults } from '@vuecs/forms';
import bootstrapTheme from '../../src';

// Non-segmented resolution must stay as before the segmented bar was added:
// the stacked layout lives in `classes.root`, so an override / themeClass
// replacement removes it completely (no variant re-appends it).
describe('formRadioGroup', () => {
    it('should resolve the stacked root for non-segmented groups', () => {
        const manager = new ThemeManager({ themes: [bootstrapTheme()] });
        const resolved = manager.resolve('formRadioGroup', formRadioGroupThemeDefaults);

        expect(resolved.root).toBe('vc-form-radio-group d-flex flex-column gap-2');
        expect(resolved.segmented).toBe('vc-form-radio-group btn-group');
    });

    it('should let an override replace the root without re-adding stacked classes', () => {
        const manager = new ThemeManager({
            themes: [bootstrapTheme()],
            overrides: { elements: { formRadioGroup: { classes: { root: 'my-row' } } } },
        });

        expect(manager.resolve('formRadioGroup', formRadioGroupThemeDefaults).root).toBe('my-row');
    });

    it('should let themeClass replace the root without re-adding stacked classes', () => {
        const manager = new ThemeManager({ themes: [bootstrapTheme()] });

        expect(manager.resolve('formRadioGroup', formRadioGroupThemeDefaults, { root: 'my-row' }).root).toBe('my-row');
    });
});
