import { describe, expect, it } from 'vitest';
import tailwindTheme, { merge } from '../../../../theme-tailwind/src/index';
import { resolveComponentTheme } from '../../../src/theme/resolve';
import type { ThemeElementDefinition } from '../../../src/theme/types';

describe('tailwindTheme', () => {
    const theme = tailwindTheme();

    it('should return an object with elements property', () => {
        expect(theme).toHaveProperty('elements');
        expect(typeof theme.elements).toBe('object');
    });

    it('should pre-wire classesMergeFn with the exported merge helper', () => {
        expect(theme.classesMergeFn).toBe(merge);
    });

    it('should define formInput group addon classes with matching radii', () => {
        const entry = theme.elements.formInput as ThemeElementDefinition;
        expect(entry).toBeDefined();
        expect(entry.classes!.groupPrepend).toContain('rounded-l-md');
        expect(entry.classes!.groupAppend).toContain('rounded-r-md');
    });

    it('should define a switch variant for formInputCheckbox', () => {
        const entry = theme.elements.formInputCheckbox as ThemeElementDefinition;
        expect(entry.variants).toBeDefined();
        expect(entry.variants!.variant.switch.root).toBe('vc-form-input-checkbox--switch');
        expect(entry.defaultVariants).toEqual({ variant: 'checkbox' });
    });

    it('should define pagination with active state using Tailwind `!` modifier to beat base link classes', () => {
        const entry = theme.elements.pagination as ThemeElementDefinition;
        expect(entry.classes!.linkActive).toContain('!bg-blue-600');
        expect(entry.classes!.linkActive).toContain('!text-white');
    });

    it('should define navigation slots without rounded corners (flat by default)', () => {
        const entry = theme.elements.navigation as ThemeElementDefinition;
        expect(entry.classes!.link).not.toContain(' rounded ');
        expect(entry.classes!.group).toContain('list-none');
    });

    it('should define list slots', () => {
        const list = theme.elements.list as ThemeElementDefinition;
        const listItem = theme.elements.listItem as ThemeElementDefinition;
        expect(list.classes!.root).toContain('flex');
        expect(listItem.classes!.root).toContain('flex-row');
    });
});

describe('merge helper', () => {
    it('should conform to the ClassesMergeFn (base, override) => string signature', () => {
        const result = merge('px-2 py-1', 'px-4');
        expect(typeof result).toBe('string');
        expect(result).toContain('px-4');
        // twMerge resolves the px conflict, preserving py-1 from base.
        expect(result).toContain('py-1');
        expect(result).not.toContain('px-2');
    });
});

describe('tailwind theme + resolveComponentTheme', () => {
    const theme = tailwindTheme();

    it('should merge tailwind classes with component defaults', () => {
        const defaults = {
            classes: {
                root: 'vc-list-item',
                icon: '',
                iconWrapper: '',
                textWrapper: '',
                actionsWrapper: '',
                actionsExtraWrapper: '',
            },
        };

        const result = resolveComponentTheme(
            'listItem',
            defaults,
            [theme],
            undefined,
            undefined,
        );

        expect(result.root).toContain('vc-list-item');
        expect(result.root).toContain('flex flex-row');
    });
});
