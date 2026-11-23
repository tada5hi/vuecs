import { describe, expect, it } from 'vitest';
import { ThemeManager } from '@vuecs/core';
import { formRadioGroupThemeDefaults } from '@vuecs/forms';
import bulmaTheme from '../../src';

// Non-segmented resolution must stay as before the segmented bar was added:
// the stacked layout lives in `classes.root`, so an override / themeClass
// replacement removes it completely (no variant re-appends it).
describe('formRadioGroup', () => {
    it('should resolve the stacked root for non-segmented groups', () => {
        const manager = new ThemeManager({ themes: [bulmaTheme()] });
        const resolved = manager.resolve('formRadioGroup', formRadioGroupThemeDefaults);

        expect(resolved.root).toBe('vc-form-radio-group is-flex is-flex-direction-column');
        expect(resolved.segmented).toBe('vc-form-radio-group buttons has-addons');
    });

    it('should let an override replace the root without re-adding stacked classes', () => {
        const manager = new ThemeManager({
            themes: [bulmaTheme()],
            overrides: { elements: { formRadioGroup: { classes: { root: 'my-row' } } } },
        });

        expect(manager.resolve('formRadioGroup', formRadioGroupThemeDefaults).root).toBe('my-row');
    });

    it('should let themeClass replace the root without re-adding stacked classes', () => {
        const manager = new ThemeManager({ themes: [bulmaTheme()] });

        expect(manager.resolve('formRadioGroup', formRadioGroupThemeDefaults, { root: 'my-row' }).root).toBe('my-row');
    });
});
