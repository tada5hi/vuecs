import { computed, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/**
 * DOM id used for the runtime palette `<style>` block. Themes that
 * implement palette switching should write into a `<style>` element
 * with this id (via `applyColorPaletteCss()`); SSR plugins use the same
 * id so client hydration replaces the server-rendered block atomically.
 */
export const COLOR_PALETTE_STYLE_ELEMENT_ID = 'vc-color-palette';

/**
 * Apply an arbitrary CSS string as a `<style id="vc-color-palette">` block
 * (client-side only). Idempotent — subsequent calls replace the
 * element's content.
 *
 * Theme-agnostic: accepts whatever CSS string the caller wants. Themes
 * that ship palette switching compose this with their own renderer
 * (e.g. `@vuecs/theme-tailwind`'s `renderColorPaletteStyles()`); other
 * tooling can call it directly with custom CSS.
 *
 * On the server (`document` undefined) this is a no-op; SSR pre-render
 * paths should serialize the renderer's output into the response head
 * directly, then let the client take over on hydration.
 */
export function applyColorPaletteCss(css: string, doc: Document | undefined = globalThis.document): void {
    if (!doc) return;

    let style = doc.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!style) {
        style = doc.createElement('style');
        style.id = COLOR_PALETTE_STYLE_ELEMENT_ID;
        doc.head.appendChild(style);
    }
    style.textContent = css;
}

export interface UseColorPaletteReturn<T> {
    /** Read-only view of the current palette. */
    current: ComputedRef<T>;
    /**
     * Replace the entire palette. Themes typically pass an empty config
     * to reset to defaults (the meaning of "empty" is theme-defined).
     */
    set(palette: T): void;
    /**
     * Add or override individual scale assignments — shallow-merges
     * `partial` over the current value when both are objects. Themes
     * with non-object palette shapes can override this behavior in
     * their own composable wrapper.
     */
    extend(partial: Partial<T>): void;
}

/**
 * Wire any reactive `Ref<T>` into the palette runtime: render the
 * current value via the theme-supplied `render` function, apply it via
 * `applyColorPaletteCss`, and re-apply on every change.
 *
 * Generic: each theme defines its own palette shape `T` and renderer.
 * `@vuecs/theme-tailwind` wraps this with its `ColorPaletteConfig` and
 * `renderColorPaletteStyles`; community themes can do the same with their
 * own shapes.
 *
 * Server-side (no `document`): the watcher is still installed but
 * `applyColorPaletteCss` is a no-op. The first reactive read on the client
 * triggers a re-paint.
 */
export function bindColorPalette<T>(
    source: Ref<T>,
    render: (value: T) => string,
): UseColorPaletteReturn<T> {
    if (typeof document !== 'undefined') {
        applyColorPaletteCss(render(source.value));
    }
    watch(
        source,
        (next) => {
            applyColorPaletteCss(render(next));
        },
        { deep: true },
    );

    return {
        current: computed(() => source.value),
        set(palette) {
            source.value = palette;
        },
        extend(partial) {
            const current = source.value;
            if (current && typeof current === 'object' && !Array.isArray(current)) {
                source.value = { ...current, ...partial } as T;
            } else {
                // Non-object palettes — extend semantics aren't well-defined,
                // so fall through to replace. Themes with structured non-
                // object palettes should override `extend` in their wrapper.
                source.value = partial as T;
            }
        },
    };
}
