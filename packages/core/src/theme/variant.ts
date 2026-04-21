import type {
    ClassesMergeFn,
    ComponentThemeDefinition,
    CompoundVariantDefinition,
    DefaultVariants,
    Theme,
    ThemeElementDefinition,
    VariantConfig,
    VariantDefinitions,
    VariantValues,
} from './types';
import { defaultClassesMergeFn } from './resolve';

export function extractVariantConfig(
    componentName: string,
    defaults: ComponentThemeDefinition,
    themes: Theme[],
    overrideElements: Record<string, ThemeElementDefinition> | undefined,
): VariantConfig {
    const variants: VariantDefinitions = {};
    const compoundVariants: CompoundVariantDefinition[] = [];
    const defaultVariants: DefaultVariants = {};

    // Helper: deep merge variant definitions (variant-name → variant-value level)
    function mergeVariants(source: VariantDefinitions | undefined) {
        if (!source) return;
        const names = Object.keys(source);
        for (const name of names) {
            if (!variants[name]) {
                variants[name] = {};
            }
            const def = source[name];
            const values = Object.keys(def);
            for (const value of values) {
                variants[name][value] = { ...def[value] };
            }
        }
    }

    function mergeDefaults(source: DefaultVariants | undefined) {
        if (!source) return;
        Object.assign(defaultVariants, source);
    }

    function mergeCompounds(source: CompoundVariantDefinition[] | undefined) {
        if (!source) return;
        for (const compound of source) {
            compoundVariants.push(compound);
        }
    }

    // Layer 1: Component defaults
    mergeVariants(defaults.variants);
    mergeCompounds(defaults.compoundVariants);
    mergeDefaults(defaults.defaultVariants);

    // Layer 2: Themes (in array order)
    for (const theme of themes) {
        const elements = theme.elements as Record<string, ThemeElementDefinition>;
        const entry = elements[componentName];
        if (!entry) continue;

        mergeVariants(entry.variants);
        mergeCompounds(entry.compoundVariants);
        mergeDefaults(entry.defaultVariants);
    }

    // Layer 3: Overrides
    if (overrideElements) {
        const entry = overrideElements[componentName];
        if (entry) {
            mergeVariants(entry.variants);
            mergeCompounds(entry.compoundVariants);
            mergeDefaults(entry.defaultVariants);
        }
    }

    return {
        variants, 
        compoundVariants, 
        defaultVariants, 
    };
}

export function resolveVariantClasses(
    config: VariantConfig,
    values: VariantValues,
    mergeFn?: ClassesMergeFn,
): Record<string, string> {
    const merge = mergeFn || defaultClassesMergeFn;
    const result: Record<string, string> = {};

    const {
        variants, 
        compoundVariants, 
        defaultVariants, 
    } = config;

    // Build resolved values from explicit values + defaultVariants
    const resolvedValues: Record<string, string> = {};
    const allNames = new Set([...Object.keys(variants), ...Object.keys(values), ...Object.keys(defaultVariants)]);
    for (const name of allNames) {
        let value = values[name];

        // Fall back to defaultVariants
        if (value === undefined) {
            value = defaultVariants[name];
        }

        // Still undefined — skip
        if (value === undefined) continue;

        resolvedValues[name] = String(value);
    }

    // Apply variant definitions
    const variantNames = Object.keys(variants);
    for (const name of variantNames) {
        const key = resolvedValues[name];
        if (key === undefined) continue;

        const definition = variants[name];
        const slotClasses = definition[key];
        if (!slotClasses) continue;

        const slots = Object.keys(slotClasses);
        for (const slot of slots) {
            const cls = slotClasses[slot];
            if (!cls) continue;
            result[slot] = merge(result[slot] || '', cls);
        }
    }

    // Evaluate compound variants
    for (const compound of compoundVariants) {
        const conditions = compound.variants;
        let match = true;

        const conditionKeys = Object.keys(conditions);
        for (const condKey of conditionKeys) {
            if (resolvedValues[condKey] !== String(conditions[condKey])) {
                match = false;
                break;
            }
        }

        if (!match) continue;

        const slots = Object.keys(compound.class);
        for (const slot of slots) {
            const cls = compound.class[slot];
            if (!cls) continue;
            result[slot] = merge(result[slot] || '', cls);
        }
    }

    return result;
}
