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
