/**
 * Locale composables, re-exported for Nuxt auto-import.
 *
 * - `useLocale()` (from `@vuecs/core`) — read-only `ComputedRef<string>`
 *   of the active BCP-47 locale. What components consume.
 * - `useLocaleManager()` (from `@vuecs/locale`) — the control surface
 *   (`set` / `reset` / `source` / `resolved` / `isAuto`). The cookie-backed
 *   source + Config bridge are wired by this module's `locale` plugin, so
 *   the handles returned here are SSR-safe.
 */
export { useLocale } from '@vuecs/core';
export { useLocaleManager } from '@vuecs/locale';
export type { LocaleSource, UseLocaleReturn } from '@vuecs/locale';
