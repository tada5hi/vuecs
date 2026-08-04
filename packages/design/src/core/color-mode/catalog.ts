/**
 * Canonical color-mode vocabulary for the vuecs design system.
 *
 * Mirrors the `color-palette/catalog.ts` shape: the runtime tuple is
 * the single source of truth and the `ColorMode` union is *derived*
 * from it, so a new mode can never be added to one without the other.
 *
 * Consumers that back `bindColorMode()`'s source ref with persisted
 * state (a cookie, `localStorage`, an SSR hydration payload) hold a
 * `Ref<string>` and must narrow it before it satisfies the signature —
 * without narrowing, a foreign stored value would round-trip into the
 * mode ref and from there onto the `<html>` class. `isColorMode()` is
 * that narrowing step:
 *
 *     const mode = computed<ColorMode>({
 *         get: () => (isColorMode(source.value) ? source.value : 'system'),
 *         set: (value) => { source.value = value; },
 *     });
 *     bindColorMode(mode);
 */

/**
 * The three selectable color modes. `'system'` is the sentinel that
 * defers to the OS preference (`prefers-color-scheme`) — it is never
 * the *resolved* value, which is always `'light'` or `'dark'`.
 */
export const COLOR_MODES = [
    'light',
    'dark',
    'system',
] as const;

export type ColorMode = typeof COLOR_MODES[number];

const COLOR_MODE_SET = new Set<string>(COLOR_MODES);

/**
 * Runtime guard over {@link COLOR_MODES}. Accepts `unknown` so it can
 * be pointed straight at untrusted persisted state without a cast.
 */
export function isColorMode(value: unknown): value is ColorMode {
    return typeof value === 'string' && COLOR_MODE_SET.has(value);
}
