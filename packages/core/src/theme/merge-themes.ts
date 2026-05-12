import { mergeElement } from './merge-element';
import { defaultClassesMergeFn } from './resolve';
import type {
    ClassesMergeFn,
    ColorModeHook,
    PaletteHook,
    Theme,
    ThemeElementDefinition,
    ThemeElements,
} from './types';

export function resolveExtends(value: Theme | Theme[] | undefined): Theme[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
}

function pickClassesMergeFn(themes: Theme[]): ClassesMergeFn | undefined {
    for (let i = themes.length - 1; i >= 0; i -= 1) {
        const fn = themes[i]?.classesMergeFn;
        if (fn) return fn;
    }
    return undefined;
}

function mergeColorMode(themes: Theme[]): ColorModeHook | undefined {
    const hooks = themes.map((t) => t.colorMode).filter((h): h is ColorModeHook => Boolean(h));
    if (hooks.length === 0) return undefined;
    if (hooks.length === 1) return hooks[0];

    return {
        handle(doc, mode) {
            for (const hook of hooks) {
                hook.handle(doc, mode);
            }
        },
    };
}

function mergePalette(themes: Theme[]): PaletteHook | undefined {
    for (let i = themes.length - 1; i >= 0; i -= 1) {
        const palette = themes[i]?.palette;
        if (palette) return palette;
    }
    return undefined;
}

/**
 * Flatten an ordered chain of themes into a single Theme. Left-to-right —
 * later entries override earlier ones, matching the runtime semantics of
 * `themes: [a, b, c]` install-time stacking.
 *
 * Pure function. Used by `defineTheme` to resolve `extends` chains, but
 * also exported as a standalone helper for advanced composition.
 */
export function mergeThemes(themes: Theme[]): Theme {
    if (themes.length === 0) {
        return { elements: {} };
    }
    if (themes.length === 1) {
        return { ...themes[0] };
    }

    const classesMergeFn = pickClassesMergeFn(themes);
    const effectiveMergeFn = classesMergeFn || defaultClassesMergeFn;

    const elementNames = new Set<string>();
    for (const theme of themes) {
        const elements = theme.elements as Record<string, ThemeElementDefinition>;
        for (const name of Object.keys(elements)) {
            elementNames.add(name);
        }
    }

    const mergedElements: Record<string, ThemeElementDefinition> = {};
    for (const name of elementNames) {
        const chain = themes
            .map((theme) => (theme.elements as Record<string, ThemeElementDefinition>)[name])
            .filter((entry): entry is ThemeElementDefinition => Boolean(entry));

        mergedElements[name] = mergeElement(chain, effectiveMergeFn);
    }

    const result: Theme = { elements: mergedElements as Partial<ThemeElements> };

    if (classesMergeFn) result.classesMergeFn = classesMergeFn;

    const colorMode = mergeColorMode(themes);
    if (colorMode) result.colorMode = colorMode;

    const palette = mergePalette(themes);
    if (palette) result.palette = palette;

    return result;
}
