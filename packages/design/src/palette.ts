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
 * The optional `nonce` parameter wires CSP nonce attribution: when set,
 * the created `<style>` element carries `nonce="..."` so it survives a
 * strict Content-Security-Policy. Subsequent calls update the
 * attribute when the value changes, and clear it when the new value is
 * undefined (so consumers can revoke a stale nonce on policy update).
 * Consumers typically read this via
 * `useConfig('nonce')` (from `@vuecs/core`, augmented by
 * `@vuecs/theme-tailwind`); the per-theme `useColorPalette` wrappers
 * already do this.
 *
 * On the server (`document` undefined) this is a no-op; SSR pre-render
 * paths should serialize the renderer's output into the response head
 * directly (with the nonce wired through framework-specific head
 * APIs), then let the client take over on hydration.
 */
export function applyColorPaletteCss(
    css: string,
    doc: Document | undefined = globalThis.document,
    nonce?: string,
): void {
    if (!doc) return;

    let style = doc.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!style) {
        style = doc.createElement('style');
        style.id = COLOR_PALETTE_STYLE_ELEMENT_ID;
        if (nonce) style.setAttribute('nonce', nonce);
        doc.head.appendChild(style);
    } else if (nonce) {
        if (style.getAttribute('nonce') !== nonce) {
            style.setAttribute('nonce', nonce);
        }
    } else if (style.hasAttribute('nonce')) {
        style.removeAttribute('nonce');
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
     * Merge `partial` over the current value via the theme's `extend`
     * implementation. Default semantics: shallow object spread. Themes
     * with non-object palette shapes pass their own via `BindColorPaletteOptions.extend`.
     */
    extend(partial: Partial<T>): void;
}

export interface BindColorPaletteOptions<T> {
    /** Render the palette value as a CSS string applied to `<style id="vc-color-palette">`. */
    render: (value: T) => string;
    /**
     * Override the default shallow-merge semantics of `extend()`. The
     * default works for any `Record`-shaped palette; themes with
     * structured non-object shapes (deep-merge, replace-on-conflict,
     * etc.) supply their own here.
     */
    extend: (current: T, partial: Partial<T>) => T;
    /**
     * Target a non-global Document (iframes, test environments).
     * Defaults to `globalThis.document`; on the server (`undefined`)
     * the watcher is still installed but `applyColorPaletteCss` is a
     * no-op — the first reactive read on the client triggers a re-paint.
     */
    document?: Document;
    /**
     * CSP nonce written to the `<style id="vc-color-palette">` element.
     * Accepts a string (resolved once) or a getter `() => string | undefined`
     * (called on every re-apply, so reactive nonce changes propagate).
     */
    nonce?: string | (() => string | undefined);
}

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
