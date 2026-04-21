import { describe, expect, it } from 'vitest';
import { extractVariantConfig, resolveVariantClasses } from '../../../src/theme/variant';
import type {
    ComponentThemeDefinition,
    Theme,
    ThemeElementDefinition,
    VariantConfig,
} from '../../../src/theme/types';

describe('resolveVariantClasses', () => {
    it('should resolve a single variant', () => {
        const config: VariantConfig = {
            variants: {
                size: {
                    sm: { root: 'py-1' },
                    lg: { root: 'py-3' },
                },
            },
            compoundVariants: [],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, { size: 'sm' });
        expect(result.root).toBe('py-1');
    });

    it('should resolve multiple variants across multiple slots', () => {
        const config: VariantConfig = {
            variants: {
                size: {
                    sm: { root: 'py-1', icon: 'size-4' },
                    lg: { root: 'py-3', icon: 'size-6' },
                },
                busy: { true: { root: 'opacity-50' } },
            },
            compoundVariants: [],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, { size: 'lg', busy: true });
        expect(result.root).toBe('py-3 opacity-50');
        expect(result.icon).toBe('size-6');
    });

    it('should handle boolean variant with true', () => {
        const config: VariantConfig = {
            variants: {
                active: {
                    true: { root: 'bg-primary' },
                    false: { root: 'bg-gray' },
                },
            },
            compoundVariants: [],
            defaultVariants: {},
        };

        expect(resolveVariantClasses(config, { active: true }).root).toBe('bg-primary');
        expect(resolveVariantClasses(config, { active: false }).root).toBe('bg-gray');
    });

    it('should use defaultVariants when value is not provided', () => {
        const config: VariantConfig = {
            variants: {
                size: {
                    sm: { root: 'py-1' },
                    md: { root: 'py-2' },
                },
            },
            compoundVariants: [],
            defaultVariants: { size: 'md' },
        };

        const result = resolveVariantClasses(config, {});
        expect(result.root).toBe('py-2');
    });

    it('should skip variant when value is undefined and no default', () => {
        const config: VariantConfig = {
            variants: { size: { sm: { root: 'py-1' } } },
            compoundVariants: [],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, {});
        expect(result).toEqual({});
    });

    it('should skip variant when value does not match any definition', () => {
        const config: VariantConfig = {
            variants: { size: { sm: { root: 'py-1' } } },
            compoundVariants: [],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, { size: 'xl' });
        expect(result).toEqual({});
    });

    it('should apply compound variants when all conditions match', () => {
        const config: VariantConfig = {
            variants: {
                busy: { true: { root: 'opacity-50' } },
                size: { lg: { root: 'py-3' } },
            },
            compoundVariants: [
                { variants: { busy: true, size: 'lg' }, class: { root: 'cursor-wait' } },
            ],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, { busy: true, size: 'lg' });
        expect(result.root).toBe('opacity-50 py-3 cursor-wait');
    });

    it('should not apply compound variants when conditions do not match', () => {
        const config: VariantConfig = {
            variants: {
                busy: { true: { root: 'opacity-50' } },
                size: { lg: { root: 'py-3' } },
            },
            compoundVariants: [
                { variants: { busy: true, size: 'lg' }, class: { root: 'cursor-wait' } },
            ],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, { busy: true, size: 'sm' });
        expect(result.root).toBe('opacity-50');
    });

    it('should apply multiple matching compound variants in order', () => {
        const config: VariantConfig = {
            variants: {},
            compoundVariants: [
                { variants: { a: 'x' }, class: { root: 'first' } },
                { variants: { a: 'x' }, class: { root: 'second' } },
            ],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, { a: 'x' });
        expect(result.root).toBe('first second');
    });

    it('should use custom mergeFn', () => {
        const config: VariantConfig = {
            variants: {
                a: { x: { root: 'cls-a' } },
                b: { y: { root: 'cls-b' } },
            },
            compoundVariants: [],
            defaultVariants: {},
        };

        const pipeMerge = (a: string, b: string) => {
            if (!a) return b;
            if (!b) return a;
            return `${a}|${b}`;
        };
        const result = resolveVariantClasses(config, { a: 'x', b: 'y' }, pipeMerge);
        expect(result.root).toBe('cls-a|cls-b');
    });

    it('should return empty object when no variants defined', () => {
        const config: VariantConfig = {
            variants: {},
            compoundVariants: [],
            defaultVariants: {},
        };

        const result = resolveVariantClasses(config, { size: 'sm' });
        expect(result).toEqual({});
    });
});

describe('extractVariantConfig', () => {
    it('should extract variant config from defaults only', () => {
        const defaults: ComponentThemeDefinition = {
            classes: { root: 'vc-btn' },
            variants: { size: { sm: { root: 'btn-sm' }, lg: { root: 'btn-lg' } } },
            defaultVariants: { size: 'sm' },
        };

        const config = extractVariantConfig('button', defaults, [], undefined);

        expect(config.variants.size.sm).toEqual({ root: 'btn-sm' });
        expect(config.variants.size.lg).toEqual({ root: 'btn-lg' });
        expect(config.defaultVariants.size).toBe('sm');
    });

    it('should deep merge theme variants with defaults at variant-value level', () => {
        const defaults: ComponentThemeDefinition = {
            classes: { root: 'vc-btn' },
            variants: {
                size: {
                    sm: { root: 'default-sm' },
                    md: { root: 'default-md' },
                    lg: { root: 'default-lg' },
                },
            },
        };

        const theme: Theme = {
            elements: {
                button: {
                    classes: { root: 'btn' },
                    variants: { size: { sm: { root: 'theme-sm' } } },
                },
            },
        };

        const config = extractVariantConfig('button', defaults, [theme], undefined);

        // sm overridden by theme
        expect(config.variants.size.sm).toEqual({ root: 'theme-sm' });
        // md and lg kept from defaults
        expect(config.variants.size.md).toEqual({ root: 'default-md' });
        expect(config.variants.size.lg).toEqual({ root: 'default-lg' });
    });

    it('should add new variant names from themes', () => {
        const defaults: ComponentThemeDefinition = {
            classes: { root: 'vc-btn' },
            variants: { size: { sm: { root: 'sm' } } },
        };

        const theme: Theme = { elements: { button: { variants: { color: { primary: { root: 'bg-primary' } } } } } };

        const config = extractVariantConfig('button', defaults, [theme], undefined);

        expect(config.variants.size).toBeDefined();
        expect(config.variants.color).toBeDefined();
        expect(config.variants.color.primary).toEqual({ root: 'bg-primary' });
    });

    it('should concatenate compound variants from all layers', () => {
        const defaults: ComponentThemeDefinition = {
            classes: { root: '' },
            compoundVariants: [
                { variants: { a: 'x' }, class: { root: 'from-defaults' } },
            ],
        };

        const theme: Theme = {
            elements: {
                comp: {
                    compoundVariants: [
                        { variants: { b: 'y' }, class: { root: 'from-theme' } },
                    ],
                },
            },
        };

        const overrides: Record<string, ThemeElementDefinition> = {
            comp: {
                compoundVariants: [
                    { variants: { c: 'z' }, class: { root: 'from-overrides' } },
                ],
            },
        };

        const config = extractVariantConfig('comp', defaults, [theme], overrides);

        expect(config.compoundVariants).toHaveLength(3);
        expect(config.compoundVariants[0].class.root).toBe('from-defaults');
        expect(config.compoundVariants[1].class.root).toBe('from-theme');
        expect(config.compoundVariants[2].class.root).toBe('from-overrides');
    });

    it('should shallow merge defaultVariants (later wins)', () => {
        const defaults: ComponentThemeDefinition = {
            classes: { root: '' },
            defaultVariants: { size: 'sm', color: 'primary' },
        };

        const theme: Theme = { elements: { comp: { defaultVariants: { size: 'lg' } } } };

        const config = extractVariantConfig('comp', defaults, [theme], undefined);

        expect(config.defaultVariants.size).toBe('lg');
        expect(config.defaultVariants.color).toBe('primary');
    });

    it('should handle empty variant config gracefully', () => {
        const defaults: ComponentThemeDefinition = { classes: { root: 'vc-btn' } };

        const config = extractVariantConfig('button', defaults, [], undefined);

        expect(config.variants).toEqual({});
        expect(config.compoundVariants).toEqual([]);
        expect(config.defaultVariants).toEqual({});
    });

    it('should ignore entries for other components', () => {
        const defaults: ComponentThemeDefinition = { classes: { root: '' } };

        const theme: Theme = { elements: { otherComponent: { variants: { size: { sm: { root: 'other-sm' } } } } } };

        const config = extractVariantConfig('button', defaults, [theme], undefined);

        expect(config.variants).toEqual({});
    });

    it('should merge across multiple themes in order', () => {
        const defaults: ComponentThemeDefinition = {
            classes: { root: '' },
            variants: { size: { sm: { root: 'default-sm' } } },
        };

        const theme1: Theme = { elements: { comp: { variants: { size: { sm: { root: 'theme1-sm' } } } } } };

        const theme2: Theme = { elements: { comp: { variants: { size: { sm: { root: 'theme2-sm' } } } } } };

        const config = extractVariantConfig('comp', defaults, [theme1, theme2], undefined);

        // theme2 wins over theme1
        expect(config.variants.size.sm).toEqual({ root: 'theme2-sm' });
    });
});
