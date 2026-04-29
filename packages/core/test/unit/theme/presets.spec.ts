import { describe, expect, it } from 'vitest';
import bootstrapTheme from '../../../../../themes/bootstrap/src/index';
import { resolveComponentTheme } from '../../../src/theme/resolve';
import type { ThemeElementDefinition } from '../../../src/theme/types';

describe('bootstrapTheme', () => {
    const preset = bootstrapTheme();

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
        expect(listItem.classes!.actionsWrapper).toContain('ms-auto');
    });

    it('should define navigation group and link', () => {
        const entry = preset.elements.navigation as ThemeElementDefinition;
        expect(entry.classes!.group).toBe('nav-items');
        expect(entry.classes!.link).toBe('nav-link');
    });
});

describe('preset integration', () => {
    it('should allow user theme to override preset values', () => {
        const presets = [bootstrapTheme()];
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
