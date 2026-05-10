import { describe, expect, it } from 'vitest';
import {
    auditTheme,
    formatAuditResult,
    isAuditClean,
} from '../../../src/theme/audit';
import type { ExpectedThemeCatalog } from '../../../src/theme/audit';
import { extend } from '../../../src/theme/extend';
import type { Theme } from '../../../src/theme/types';

const expected: ExpectedThemeCatalog = {
    button: {
        classes: {
            root: 'vc-button',
            icon: 'vc-button-icon',
        },
    },
    badge: { classes: { root: 'vc-badge' } },
};

describe('auditTheme', () => {
    it('returns a clean report for a fully-covered theme', () => {
        const theme: Theme = {
            elements: {
                button: { classes: { root: 'btn-primary', icon: 'h-4 w-4' } },
                badge: { classes: { root: 'inline-flex rounded-full' } },
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        expect(isAuditClean(result)).toBe(true);
    });

    it('flags missing elements (component name not in theme)', () => {
        const theme: Theme = { elements: { button: { classes: { root: 'btn', icon: 'h-4' } } } as Theme['elements'] };

        const result = auditTheme(theme, expected);
        expect(result.missingElements).toEqual(['badge']);
        expect(isAuditClean(result)).toBe(false);
    });

    it('flags unknown elements (theme has component name not in expected)', () => {
        const theme: Theme = {
            elements: {
                button: { classes: { root: 'btn', icon: 'h-4' } },
                badge: { classes: { root: 'tag' } },
                mystery: { classes: { root: 'unknown' } },
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        expect(result.unknownElements).toEqual(['mystery']);
        expect(isAuditClean(result)).toBe(false);
    });

    it('flags missing slots per element', () => {
        const theme: Theme = {
            elements: {
                button: { classes: { root: 'btn' } },
                badge: { classes: { root: 'tag' } },
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        expect(result.missingSlots).toEqual({ button: ['icon'] });
        expect(isAuditClean(result)).toBe(false);
    });

    it('flags unknown slots per element', () => {
        const theme: Theme = {
            elements: {
                button: {
                    classes: {
                        root: 'btn', 
                        icon: 'h-4', 
                        extraSlot: 'mystery', 
                    }, 
                },
                badge: { classes: { root: 'tag' } },
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        expect(result.unknownSlots).toEqual({ button: ['extraSlot'] });
        expect(isAuditClean(result)).toBe(false);
    });

    it('flags redundantStructural when theme value === default', () => {
        const theme: Theme = {
            elements: {
                button: { classes: { root: 'vc-button', icon: 'h-4' } }, // root duplicates default
                badge: { classes: { root: 'tag' } },
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        expect(result.redundantStructural).toEqual({ button: ['root'] });
        expect(isAuditClean(result)).toBe(false);
    });

    it('does not flag extend()-marked values as redundantStructural', () => {
        const theme: Theme = {
            elements: {
                button: {
                    classes: {
                        root: extend('vc-button'), // value happens to equal default but is wrapped in extend()
                        icon: 'h-4',
                    },
                },
                badge: { classes: { root: 'tag' } },
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        expect(result.redundantStructural).toEqual({});
        expect(isAuditClean(result)).toBe(true);
    });

    it('skips audit details for elements absent from theme', () => {
        // missingElements is the only field that should fire when an
        // element is wholly absent — no missingSlots noise.
        const theme: Theme = { elements: { button: { classes: { root: 'btn', icon: 'h-4' } } } as Theme['elements'] };

        const result = auditTheme(theme, expected);
        expect(result.missingElements).toEqual(['badge']);
        expect(result.missingSlots).toEqual({});
    });

    it('handles a theme with empty elements gracefully', () => {
        const theme: Theme = { elements: {} };
        const result = auditTheme(theme, expected);
        expect(result.missingElements.sort()).toEqual(['badge', 'button']);
        expect(result.unknownElements).toEqual([]);
        expect(result.missingSlots).toEqual({});
        expect(result.unknownSlots).toEqual({});
        expect(result.redundantStructural).toEqual({});
    });

    it('handles theme entries that omit classes', () => {
        const theme: Theme = {
            elements: {
                button: { variants: { size: { sm: { root: 'sm' } } } } as Theme['elements'][string],
                badge: { classes: { root: 'tag' } },
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        // Theme has no classes for button → both slots missing.
        expect(result.missingSlots).toEqual({ button: ['root', 'icon'] });
    });

    it('aggregates multiple findings across categories', () => {
        const theme: Theme = {
            elements: {
                button: { classes: { root: 'vc-button', extraSlot: 'mystery' } }, // redundant + unknown + missing icon
                mystery: { classes: { root: 'x' } }, // unknown element
                // badge missing → missingElements
            } as Theme['elements'],
        };

        const result = auditTheme(theme, expected);
        expect(result.missingElements).toEqual(['badge']);
        expect(result.unknownElements).toEqual(['mystery']);
        expect(result.missingSlots).toEqual({ button: ['icon'] });
        expect(result.unknownSlots).toEqual({ button: ['extraSlot'] });
        expect(result.redundantStructural).toEqual({ button: ['root'] });
    });
});

describe('isAuditClean', () => {
    it('returns true only when every category is empty', () => {
        expect(isAuditClean({
            missingElements: [],
            unknownElements: [],
            missingSlots: {},
            unknownSlots: {},
            redundantStructural: {},
        })).toBe(true);

        expect(isAuditClean({
            missingElements: ['x'],
            unknownElements: [],
            missingSlots: {},
            unknownSlots: {},
            redundantStructural: {},
        })).toBe(false);

        expect(isAuditClean({
            missingElements: [],
            unknownElements: [],
            missingSlots: { x: ['y'] },
            unknownSlots: {},
            redundantStructural: {},
        })).toBe(false);
    });
});

describe('formatAuditResult', () => {
    it('returns empty string for a clean result', () => {
        const out = formatAuditResult({
            missingElements: [],
            unknownElements: [],
            missingSlots: {},
            unknownSlots: {},
            redundantStructural: {},
        });
        expect(out).toBe('');
    });

    it('renders all five categories with title prefix', () => {
        const out = formatAuditResult({
            missingElements: ['badge'],
            unknownElements: ['mystery'],
            missingSlots: { button: ['icon'] },
            unknownSlots: { button: ['extraSlot'] },
            redundantStructural: { button: ['root'] },
        });

        expect(out).toContain('Theme audit:');
        expect(out).toContain('Missing elements (1)');
        expect(out).toContain('- badge');
        expect(out).toContain('Unknown elements (1)');
        expect(out).toContain('- mystery');
        expect(out).toContain('Missing slots:');
        expect(out).toContain('button: icon');
        expect(out).toContain('Unknown slots:');
        expect(out).toContain('button: extraSlot');
        expect(out).toContain('Redundant structural');
        expect(out).toContain('button: root');
    });

    it('honors custom title', () => {
        const out = formatAuditResult(
            {
                missingElements: ['x'],
                unknownElements: [],
                missingSlots: {},
                unknownSlots: {},
                redundantStructural: {},
            },
            { title: 'theme-tailwind audit' },
        );
        expect(out).toContain('theme-tailwind audit:');
    });

    it('skips suppressed categories', () => {
        const out = formatAuditResult(
            {
                missingElements: ['x'],
                unknownElements: ['y'],
                missingSlots: {},
                unknownSlots: {},
                redundantStructural: { button: ['root'] },
            },
            { skip: ['redundantStructural', 'unknownElements'] },
        );
        expect(out).toContain('Missing elements');
        expect(out).not.toContain('Unknown elements');
        expect(out).not.toContain('Redundant structural');
    });

    it('sorts entries alphabetically for stable output', () => {
        const out = formatAuditResult({
            missingElements: ['zebra', 'alpha', 'mike'],
            unknownElements: [],
            missingSlots: {},
            unknownSlots: {},
            redundantStructural: {},
        });
        const alpha = out.indexOf('alpha');
        const mike = out.indexOf('mike');
        const zebra = out.indexOf('zebra');
        expect(alpha).toBeGreaterThan(0);
        expect(alpha).toBeLessThan(mike);
        expect(mike).toBeLessThan(zebra);
    });
});
