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
        expect(entry.classes!.linkActive).toContain('!bg-primary-600');
        expect(entry.classes!.linkActive).toContain('!text-on-primary');
    });

    it('should reference only semantic color tokens (no raw Tailwind palette names)', () => {
        // The design-token layer requires every color class to go through a
        // semantic Tailwind color (primary, neutral, success, warning, error,
        // info, bg, fg, border, ring, on-*) so runtime palette switches
        // propagate. Any literal `bg-blue-600` / `text-gray-500` etc. in the
        // resolved class strings would bypass `--vc-color-*` and must be
        // flagged by this guard.
        const RAW_PALETTES = [
            'slate', 
            'gray', 
            'zinc', 
            'stone',
            'red', 
            'orange', 
            'amber', 
            'yellow', 
            'lime',
            'green', 
            'emerald', 
            'teal', 
            'cyan', 
            'sky',
            'blue', 
            'indigo', 
            'violet', 
            'purple', 
            'fuchsia',
            'pink', 
            'rose',
            // Note: 'neutral' is both a raw Tailwind palette AND a vuecs semantic
            // scale; the matcher below checks for `-{shade}` to distinguish
            // `bg-neutral-500` (semantic) from prefixes like `text-neutral-foo`.
        ];
        // Match only palette + shade (50..950) — avoids false positives on
        // utility classes like `border-l-0` or `text-sm`.
        const pattern = new RegExp(
            `\\b(?:[a-z-]+:)*(?:bg|text|border|ring|outline|fill|stroke|from|to|via|decoration|placeholder|accent|caret|divide|shadow)-(?:${RAW_PALETTES.join('|')})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`,
        );

        for (const [name, entry] of Object.entries(theme.elements)) {
            const element = entry as ThemeElementDefinition;
            for (const [slot, value] of Object.entries(element.classes || {})) {
                const match = pattern.exec(typeof value === 'string' ? value : '');
                if (match) {
                    throw new Error(
                        `theme.elements.${name}.classes.${slot} contains raw palette class "${match[0]}" — use semantic tokens (primary-/neutral-/success-/etc.)`,
                    );
                }
            }
        }
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
