import { mergeThemes, resolveExtends } from './merge-themes';
import type { Theme, ThemeConfig } from './types';

/**
 * Author a Theme. Config-object form mirroring `tsconfig`'s `extends` /
 * Vue's `defineComponent` doctrine.
 *
 * @example
 * ```ts
 * import tailwindTheme from '@vuecs/theme-tailwind';
 * import { defineTheme, extend } from '@vuecs/core';
 *
 * export const acmeTheme = () => defineTheme({
 *     extends: tailwindTheme(),
 *     elements: {
 *         button: { classes: { root: extend('shadow-2xl') } },
 *     },
 * });
 * ```
 *
 * Multiple bases compose left-to-right (rightmost wins):
 * `extends: [a, b, c]` matches `themes: [a, b, c]` install-time semantics.
 */
export function defineTheme(config: ThemeConfig): Theme {
    const bases = resolveExtends(config.extends);

    const ownTheme: Theme = { elements: config.elements ?? {} };
    if (config.classesMergeFn) ownTheme.classesMergeFn = config.classesMergeFn;
    if (config.colorMode) ownTheme.colorMode = config.colorMode;
    if (config.palette) ownTheme.palette = config.palette;

    return mergeThemes([...bases, ownTheme]);
}
