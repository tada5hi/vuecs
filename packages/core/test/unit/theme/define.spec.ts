import { 
    describe, 
    expect, 
    it, 
    vi, 
} from 'vitest';
import { defineTheme } from '../../../src/theme/define';
import { extend } from '../../../src/theme/extend';
import { mergeThemes } from '../../../src/theme/merge-themes';
import { resolveComponentTheme } from '../../../src/theme/resolve';
import type {
    ComponentThemeDefinition,
    Theme,
} from '../../../src/theme/types';

const buttonDefaults: ComponentThemeDefinition = {
    classes: {
        root: 'vc-button',
        icon: 'vc-button-icon',
    },
};

describe('defineTheme', () => {
    describe('leaf themes (no extends)', () => {
        it('returns a Theme with empty elements when config is empty', () => {
            const theme = defineTheme({});
            expect(theme.elements).toEqual({});
        });

        it('returns a Theme carrying its own elements when no extends', () => {
            const theme = defineTheme({ elements: { button: { classes: { root: 'tw-btn' } } } as Partial<Theme['elements']> });
            const elements = theme.elements as Record<string, { classes?: Record<string, string> }>;
            expect(elements.button?.classes).toEqual({ root: 'tw-btn' });
        });
    });

    describe('single base extends', () => {
        it('resolves identically to install-time stacking [base, current]', () => {
            const base: Theme = { elements: { button: { classes: { root: 'base-btn' } } } as Partial<Theme['elements']> };

            const merged = defineTheme({
                extends: base,
                elements: { button: { classes: { root: extend('extra') } } } as Partial<Theme['elements']>,
            });

            const fromMerged = resolveComponentTheme('button', buttonDefaults, [merged], undefined, undefined);
            const fromStack = resolveComponentTheme(
                'button',
                buttonDefaults,
                [base, { elements: { button: { classes: { root: extend('extra') } } } as Partial<Theme['elements']> }],
                undefined,
                undefined,
            );

            expect(fromMerged.root).toBe(fromStack.root);
            expect(fromMerged.root).toBe('vc-button base-btn extra');
        });

        it('current plain values reset earlier extends but keep defaults at runtime', () => {
            const base: Theme = { elements: { button: { classes: { root: extend('base-extend') } } } as Partial<Theme['elements']> };

            const merged = defineTheme({
                extends: base,
                elements: { button: { classes: { root: 'plain-current' } } } as Partial<Theme['elements']>,
            });

            const result = resolveComponentTheme('button', buttonDefaults, [merged], undefined, undefined);
            expect(result.root).toBe('vc-button plain-current');
        });
    });

    describe('multi-base extends array', () => {
        it('resolves left-to-right (rightmost wins)', () => {
            const a: Theme = { elements: { button: { classes: { root: 'from-a' } } } as Partial<Theme['elements']> };
            const b: Theme = { elements: { button: { classes: { root: 'from-b' } } } as Partial<Theme['elements']> };

            const merged = defineTheme({ extends: [a, b] });
            const result = resolveComponentTheme('button', buttonDefaults, [merged], undefined, undefined);

            expect(result.root).toBe('vc-button from-b');
        });

        it('appends current config after all bases', () => {
            const a: Theme = { elements: { button: { classes: { root: 'from-a' } } } as Partial<Theme['elements']> };
            const b: Theme = { elements: { button: { classes: { root: 'from-b' } } } as Partial<Theme['elements']> };

            const merged = defineTheme({
                extends: [a, b],
                elements: { button: { classes: { root: extend('from-current') } } } as Partial<Theme['elements']>,
            });

            const result = resolveComponentTheme('button', buttonDefaults, [merged], undefined, undefined);
            expect(result.root).toBe('vc-button from-b from-current');
        });
    });

    describe('variant merging', () => {
        it('deep-merges variant definitions across the chain (later wins per slot)', () => {
            const base: Theme = {
                elements: {
                    button: {
                        variants: {
                            size: {
                                sm: { root: 'base-sm' },
                                md: { root: 'base-md' },
                            },
                        },
                    },
                } as Partial<Theme['elements']>,
            };

            const merged = defineTheme({
                extends: base,
                elements: { button: { variants: { size: { sm: { root: 'override-sm' } } } } } as Partial<Theme['elements']>,
            });

            const elements = merged.elements as Record<string, { variants?: any }>;
            expect(elements.button?.variants?.size).toEqual({
                sm: { root: 'override-sm' },
                md: { root: 'base-md' },
            });
        });

        it('concatenates compoundVariants from all chain layers', () => {
            const base: Theme = {
                elements: {
                    button: {
                        compoundVariants: [
                            { variants: { size: 'sm' }, class: { root: 'base-compound' } },
                        ],
                    },
                } as Partial<Theme['elements']>,
            };

            const merged = defineTheme({
                extends: base,
                elements: {
                    button: {
                        compoundVariants: [
                            { variants: { size: 'lg' }, class: { root: 'current-compound' } },
                        ],
                    },
                } as Partial<Theme['elements']>,
            });

            const elements = merged.elements as Record<string, { compoundVariants?: any[] }>;
            expect(elements.button?.compoundVariants).toHaveLength(2);
        });

        it('shallow-merges defaultVariants (later wins per key)', () => {
            const base: Theme = { elements: { button: { defaultVariants: { size: 'md', color: 'primary' } } } as Partial<Theme['elements']> };

            const merged = defineTheme({
                extends: base,
                elements: { button: { defaultVariants: { size: 'lg' } } } as Partial<Theme['elements']>,
            });

            const elements = merged.elements as Record<string, { defaultVariants?: any }>;
            expect(elements.button?.defaultVariants).toEqual({ size: 'lg', color: 'primary' });
        });
    });

    describe('classesMergeFn', () => {
        it('picks the last layer that declares one (later wins)', () => {
            const customA = (a: string, b: string) => `${a}|A|${b}`;
            const customB = (a: string, b: string) => `${a}|B|${b}`;

            const merged = defineTheme({
                extends: [
                    { elements: {}, classesMergeFn: customA },
                    { elements: {}, classesMergeFn: customB },
                ],
            });

            expect(merged.classesMergeFn).toBe(customB);
        });

        it('uses current config classesMergeFn over chain', () => {
            const customA = (a: string, b: string) => `${a}|A|${b}`;
            const customCurrent = (a: string, b: string) => `${a}|CURRENT|${b}`;

            const merged = defineTheme({
                extends: [{ elements: {}, classesMergeFn: customA }],
                classesMergeFn: customCurrent,
            });

            expect(merged.classesMergeFn).toBe(customCurrent);
        });

        it('honors custom mergeFn when resolving extend() markers at flatten time', () => {
            const pipeMerge = (a: string, b: string) => (a ? `${a}|${b}` : b);

            const base: Theme = {
                elements: { button: { classes: { root: 'base' } } } as Partial<Theme['elements']>,
                classesMergeFn: pipeMerge,
            };

            const merged = defineTheme({
                extends: base,
                elements: { button: { classes: { root: extend('extra') } } } as Partial<Theme['elements']>,
            });

            const elements = merged.elements as Record<string, { classes?: Record<string, string> }>;
            expect(elements.button?.classes?.root).toBe('base|extra');
        });
    });

    describe('plan-021 forward-compat hooks', () => {
        it('composes colorMode.apply across the chain in order', () => {
            const calls: string[] = [];
            const a: Theme = {
                elements: {},
                colorMode: { apply: () => { calls.push('A'); } },
            };
            const b: Theme = {
                elements: {},
                colorMode: { apply: () => { calls.push('B'); } },
            };

            const merged = defineTheme({ extends: [a, b] });

            merged.colorMode!.apply({} as Document, 'dark');
            expect(calls).toEqual(['A', 'B']);
        });

        it('preserves single colorMode hook reference when only one layer declares it', () => {
            const hook = { apply: vi.fn() };
            const merged = defineTheme({
                extends: { elements: {} },
                colorMode: hook,
            });
            expect(merged.colorMode).toBe(hook);
        });

        it('palette is later-wins across the chain', () => {
            const renderA = () => 'a';
            const renderB = () => 'b';
            const merged = defineTheme({
                extends: [
                    { elements: {}, palette: { render: renderA } },
                    { elements: {}, palette: { render: renderB } },
                ],
            });
            expect(merged.palette?.render).toBe(renderB);
        });

        it('omits hooks when no layer declares them', () => {
            const merged = defineTheme({ elements: {} });
            expect(merged.colorMode).toBeUndefined();
            expect(merged.palette).toBeUndefined();
        });
    });

    describe('mergeThemes (standalone reducer)', () => {
        it('returns empty Theme for empty array', () => {
            expect(mergeThemes([])).toEqual({ elements: {} });
        });

        it('returns the same reference for single-element array', () => {
            const theme: Theme = { elements: {} };
            expect(mergeThemes([theme])).toBe(theme);
        });

        it('produces a result that resolves identically to runtime stacking', () => {
            const a: Theme = { elements: { button: { classes: { root: 'a-class' } } } as Partial<Theme['elements']> };
            const b: Theme = { elements: { button: { classes: { root: extend('b-extra') } } } as Partial<Theme['elements']> };

            const merged = mergeThemes([a, b]);
            const fromMerged = resolveComponentTheme('button', buttonDefaults, [merged], undefined, undefined);
            const fromStack = resolveComponentTheme('button', buttonDefaults, [a, b], undefined, undefined);

            expect(fromMerged.root).toBe(fromStack.root);
        });
    });
});
