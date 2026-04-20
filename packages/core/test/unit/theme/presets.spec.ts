import { describe, expect, it } from 'vitest';
import bootstrapV5Theme from '../../../../preset-bootstrap-v5/src/index';
import bootstrapV4Theme from '../../../../preset-bootstrap-v4/src/index';
import fontAwesomeTheme from '../../../../preset-font-awesome/src/index';
import { isExtendValue } from '../../../src/theme/extend';
import { resolveComponentTheme } from '../../../src/theme/resolve';

describe('bootstrapV5Theme', () => {
    const preset = bootstrapV5Theme();

    it('should return an object with theme property', () => {
        expect(preset).toHaveProperty('elements');
        expect(typeof preset.elements).toBe('object');
    });

    it('should define formGroup with root, label, validationError, validationWarning', () => {
        expect(preset.elements.formGroup).toBeDefined();
        expect(preset.elements.formGroup!.root).toBe('form-group');
        expect(preset.elements.formGroup!.label).toBe('form-label');
        expect(preset.elements.formGroup!.validationError).toBe('form-group-error');
        expect(preset.elements.formGroup!.validationWarning).toBe('form-group-warning');
    });

    it('should define formInput with Bootstrap classes', () => {
        expect(preset.elements.formInput).toBeDefined();
        expect(preset.elements.formInput!.root).toBe('form-control');
        expect(preset.elements.formInput!.group).toBe('input-group');
    });

    it('should define pagination root', () => {
        expect(preset.elements.pagination).toBeDefined();
        expect(preset.elements.pagination!.root).toContain('pagination');
    });

    it('should define list and listItem classes', () => {
        expect(preset.elements.list!.root).toContain('d-flex');
        expect(preset.elements.listItem!.root).toContain('d-flex');
        expect(preset.elements.listItem!.actionsWrapper).toBe('ms-auto');
    });

    it('should define navigation group and link', () => {
        expect(preset.elements.navigation!.group).toBe('nav-items');
        expect(preset.elements.navigation!.link).toBe('nav-link');
    });
});

describe('bootstrapV4Theme', () => {
    const preset = bootstrapV4Theme();

    it('should return an object with theme property', () => {
        expect(preset).toHaveProperty('elements');
    });

    it('should use ml-auto for listItem actions (v4 utility)', () => {
        expect(preset.elements.listItem!.actionsWrapper).toBe('ml-auto');
    });

    it('should use form-control for formSelect (v4 has no form-select)', () => {
        expect(preset.elements.formSelect!.root).toBe('form-control');
    });
});

describe('fontAwesomeTheme', () => {
    const preset = fontAwesomeTheme();

    it('should return an object with theme property', () => {
        expect(preset).toHaveProperty('elements');
    });

    it('should use extend() for all values', () => {
        const { elements } = preset;
        for (const componentKey of Object.keys(elements)) {
            const component = elements[componentKey];
            for (const slotKey of Object.keys(component!)) {
                const value = component![slotKey];
                expect(isExtendValue(value)).toBe(true);
            }
        }
    });

    it('should define formSubmit icon classes', () => {
        expect(isExtendValue(preset.elements.formSubmit!.createIcon)).toBe(true);
        expect(isExtendValue(preset.elements.formSubmit!.updateIcon)).toBe(true);
    });

    it('should define pagination icon classes', () => {
        expect(isExtendValue(preset.elements.pagination!.prevIcon)).toBe(true);
        expect(isExtendValue(preset.elements.pagination!.nextIcon)).toBe(true);
    });
});

describe('preset integration', () => {
    it('should resolve bootstrap + font-awesome presets together', () => {
        const presets = [bootstrapV5Theme(), fontAwesomeTheme()];
        const defaults = {
            root: 'vc-list-item',
            icon: '',
        };

        const result = resolveComponentTheme('listItem', defaults, presets, undefined, undefined);

        // Bootstrap replaces root
        expect(result.root).toContain('d-flex');
        // Font Awesome extends icon
        expect(result.icon).toContain('fa fa-bars');
    });

    it('should allow user theme to override preset values', () => {
        const presets = [bootstrapV5Theme()];
        const userTheme = { formGroup: { root: 'my-custom-group' } };
        const defaults = {
            root: '', 
            label: '', 
            validationError: '', 
            validationWarning: '', 
            hint: '', 
        };

        const result = resolveComponentTheme('formGroup', defaults, presets, userTheme, undefined);

        expect(result.root).toBe('my-custom-group');
        // label from preset should still apply
        expect(result.label).toBe('form-label');
    });
});
