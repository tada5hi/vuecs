import { computed, watch } from 'vue';
import type { Ref } from 'vue';
import { applyColorPaletteCss } from './apply';
import type { BindColorPaletteOptions, UseColorPaletteReturn } from './types';

/**
 * Wire any reactive `Ref<T>` into the palette runtime: render the
 * current value via the theme-supplied `render` function, apply it via
 * `applyColorPaletteCss`, and re-apply on every change.
 *
 * Generic: each theme defines its own palette shape `T` and renderer.
 * `@vuecs/theme-tailwind` wraps this with its `ColorPaletteConfig` and
 * `renderColorPaletteStyles`; community themes can do the same with their
 * own shapes — including custom merge semantics via `options.extend`.
 */
export function bindColorPalette<T>(
    source: Ref<T>,
    options: BindColorPaletteOptions<T>,
): UseColorPaletteReturn<T> {
    const {
        render,
        extend,
        document = globalThis.document,
        nonce,
    } = options;

    const resolveNonce: () => string | undefined = typeof nonce === 'function' ?
        nonce :
        () => nonce;

    if (document) {
        applyColorPaletteCss(render(source.value), document, resolveNonce());
    }
    /*
     * Watch both the palette source AND the resolved nonce. The nonce
     * getter form (e.g. `() => useConfig('nonce').value`) reads a
     * reactive ref, so a nonce-only rotation (CSP policy update via
     * `setConfig({ nonce })`) re-applies the `<style>` element's
     * attribute without needing a palette mutation. Static nonce
     * strings return the same primitive on every call → the nonce
     * lane of the watcher is silently inert.
     */
    watch(
        [source, () => resolveNonce()] as const,
        () => {
            applyColorPaletteCss(render(source.value), document, resolveNonce());
        },
        { deep: true },
    );

    return {
        current: computed(() => source.value),
        set(palette) {
            source.value = palette;
        },
        extend(partial) {
            source.value = extend(source.value, partial);
        },
    };
}
