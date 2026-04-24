import { describe, expect, it } from 'vitest';
import bootstrapV5Theme from '../../../../theme-bootstrap-v5/src/index';
import bootstrapV4Theme from '../../../../theme-bootstrap-v4/src/index';
import fontAwesomeTheme from '../../../../theme-font-awesome/src/index';
import { isExtendValue } from '../../../src/theme/extend';
import { resolveComponentTheme } from '../../../src/theme/resolve';
import type { ThemeElementDefinition } from '../../../src/theme/types';

describe('bootstrapV5Theme', () => {
    const preset = bootstrapV5Theme();

    it('should return an object with elements property', () => {
        expect(preset).toHaveProperty('elements');
        expect(typeof preset.elements).toBe('object');
    });

    it('should define formGroup with root, label, validationError, validationWarning', () => {
        const entry = preset.elements.formGroup as ThemeElementDefinition;
        expect(entry).toBeDefined();
        expect(entry.classes!.root).toBe('form-group');
        expect(entry.classes!.label).toBe('form-label');
        expect(entry.classes!.validationError).toBe('form-group-error');
        expect(entry.classes!.validationWarning).toBe('form-group-warning');
    });

    it('should define formInput with Bootstrap classes', () => {
        const entry = preset.elements.formInput as ThemeElementDefinition;
        expect(entry).toBeDefined();
        expect(entry.classes!.root).toBe('form-control');
        expect(entry.classes!.group).toBe('input-group');
    });

    it('should define pagination root', () => {
        const entry = preset.elements.pagination as ThemeElementDefinition;
        expect(entry).toBeDefined();
        expect(entry.classes!.root).toContain('pagination');
    });

    it('should define list and listItem classes', () => {
        const list = preset.elements.list as ThemeElementDefinition;
        const listItem = preset.elements.listItem as ThemeElementDefinition;
        expect(list.classes!.root).toContain('d-flex');
        expect(listItem.classes!.root).toContain('d-flex');
        expect(listItem.classes!.actionsWrapper).toBe('ms-auto');
    });

    it('should define navigation group and link', () => {
        const entry = preset.elements.navigation as ThemeElementDefinition;
        expect(entry.classes!.group).toBe('nav-items');
        expect(entry.classes!.link).toBe('nav-link');
    });
});

describe('bootstrapV4Theme', () => {
    const preset = bootstrapV4Theme();

    it('should return an object with elements property', () => {
        expect(preset).toHaveProperty('elements');
    });

    it('should use ml-auto for listItem actions (v4 utility)', () => {
        const entry = preset.elements.listItem as ThemeElementDefinition;
        expect(entry.classes!.actionsWrapper).toBe('ml-auto');
    });

    it('should use form-control for formSelect (v4 has no form-select)', () => {
        const entry = preset.elements.formSelect as ThemeElementDefinition;
        expect(entry.classes!.root).toBe('form-control');
    });
});

describe('fontAwesomeTheme', () => {
    const preset = fontAwesomeTheme();

    it('should return an object with elements property', () => {
        expect(preset).toHaveProperty('elements');
    });

    it('should use extend() for all class values', () => {
        const { elements } = preset;
        for (const componentKey of Object.keys(elements)) {
            const component = elements[componentKey] as ThemeElementDefinition;
            const classes = component.classes!;
            for (const slotKey of Object.keys(classes)) {
                const value = classes[slotKey];
                expect(isExtendValue(value)).toBe(true);
            }
        }
    });

    it('should define formSubmit icon classes', () => {
        const entry = (preset.elements.formSubmit as ThemeElementDefinition).classes!;
        expect(isExtendValue(entry.createIcon)).toBe(true);
        expect(isExtendValue(entry.updateIcon)).toBe(true);
    });

    it('should define pagination icon classes', () => {
        const entry = (preset.elements.pagination as ThemeElementDefinition).classes!;
        expect(isExtendValue(entry.prevIcon)).toBe(true);
        expect(isExtendValue(entry.nextIcon)).toBe(true);
    });
});

describe('preset integration', () => {
    it('should resolve bootstrap + font-awesome presets together', () => {
        const presets = [bootstrapV5Theme(), fontAwesomeTheme()];
        const defaults = {
            classes: {
                root: 'vc-list-item',
                icon: '',
            },
        };

        const result = resolveComponentTheme('listItem', defaults, presets, undefined, undefined);

        // Bootstrap replaces root
        expect(result.root).toContain('d-flex');
        // Font Awesome extends icon
        expect(result.icon).toContain('fa fa-bars');
    });

    it('should allow user theme to override preset values', () => {
        const presets = [bootstrapV5Theme()];
        const overrides: Record<string, ThemeElementDefinition> = { formGroup: { classes: { root: 'my-custom-group' } } };
        const defaults = {
            classes: {
                root: '',
                label: '',
                validationError: '',
                validationWarning: '',
                hint: '',
            },
        };

        const result = resolveComponentTheme('formGroup', defaults, presets, overrides, undefined);

        expect(result.root).toBe('my-custom-group');
        // label from preset should still apply
        expect(result.label).toBe('form-label');
    });
});
