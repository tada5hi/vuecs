import { isExtendValue } from './extend';
import type {
    ClassesMergeFn,
    CompoundVariantDefinition,
    DefaultVariants,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantDefinitions,
} from './types';

export function mergeClasses(
    chain: (ThemeClassesOverride | undefined)[],
    mergeFn: ClassesMergeFn,
): ThemeClassesOverride {
    const accumulator: Record<string, string> = {};

    for (const layer of chain) {
        if (!layer) continue;
        const keys = Object.keys(layer);
        for (const key of keys) {
            const value = layer[key];
            if (value === undefined) continue;

            if (isExtendValue(value)) {
                accumulator[key] = mergeFn(accumulator[key] || '', value.value);
            } else {
                accumulator[key] = value;
            }
        }
    }

    return accumulator as ThemeClassesOverride;
}

export function mergeVariants(
    chain: (VariantDefinitions | undefined)[],
): VariantDefinitions | undefined {
    const merged: VariantDefinitions = {};
    let touched = false;

    for (const layer of chain) {
        if (!layer) continue;
        touched = true;
        const names = Object.keys(layer);
        for (const name of names) {
            if (!merged[name]) merged[name] = {};
            const def = layer[name];
            const values = Object.keys(def);
            for (const value of values) {
                merged[name][value] = { ...def[value] };
            }
        }
    }

    return touched ? merged : undefined;
}

export function mergeCompoundVariants(
    chain: (CompoundVariantDefinition[] | undefined)[],
): CompoundVariantDefinition[] | undefined {
    const merged: CompoundVariantDefinition[] = [];
    let touched = false;

    for (const layer of chain) {
        if (!layer) continue;
        touched = true;
        for (const compound of layer) {
            merged.push(compound);
        }
    }

    return touched ? merged : undefined;
}

export function mergeDefaultVariants(
    chain: (DefaultVariants | undefined)[],
): DefaultVariants | undefined {
    const merged: DefaultVariants = {};
    let touched = false;

    for (const layer of chain) {
        if (!layer) continue;
        touched = true;
        Object.assign(merged, layer);
    }

    return touched ? merged : undefined;
}

export function mergeElement(
    chain: ThemeElementDefinition[],
    mergeFn: ClassesMergeFn,
): ThemeElementDefinition {
    const result: ThemeElementDefinition = {};

    const classesChain = chain.map((entry) => entry.classes);
    if (classesChain.some((c) => c !== undefined)) {
        result.classes = mergeClasses(classesChain, mergeFn);
    }

    const variants = mergeVariants(chain.map((entry) => entry.variants));
    if (variants) result.variants = variants;

    const compoundVariants = mergeCompoundVariants(chain.map((entry) => entry.compoundVariants));
    if (compoundVariants) result.compoundVariants = compoundVariants;

    const defaultVariants = mergeDefaultVariants(chain.map((entry) => entry.defaultVariants));
    if (defaultVariants) result.defaultVariants = defaultVariants;

    return result;
}
