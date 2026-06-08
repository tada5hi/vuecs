# Nuxt integration

vuecs ships **one theme-agnostic Nuxt module** — `@vuecs/nuxt` — that
handles tokens, color mode, and palette switching for every theme.
Plan 025 collapsed the previous per-theme split (`@vuecs/theme-tailwind-nuxt`)
once the runtime dispatch became fully theme-agnostic.

- Auto-injects design tokens from `@vuecs/design`.
- Ships SSR-safe color-mode handling (`useColorMode()` auto-import).
- Ships SSR-safe palette handling (`useColorPalette()` auto-import).
- Ships SSR-safe locale handling (`useLocale()` / `useLocaleManager()` auto-imports).
- Optional `themes: string[]` config auto-generates a plugin that
  installs listed theme packages — no user-plugin needed for the
  common case.

```bash
# Tailwind app
npm install @vuecs/nuxt @vuecs/design @vuecs/theme-tailwind

# Bootstrap app
npm install @vuecs/nuxt @vuecs/design @vuecs/theme-bootstrap

# Bulma app
npm install @vuecs/nuxt @vuecs/design @vuecs/theme-bulma
```

## Setup

```ts
// nuxt.config.ts — same shape regardless of theme
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        // Auto-install themes via generated plugin (no user-plugin needed).
        // Themes are imported as default-export no-arg factories.
        // For factory args (e.g. acmeTheme({ variant: 'dark' })), skip
        // this option and install via a user-authored plugin file.
        themes: ['@vuecs/theme-tailwind'],

        // Initial color mode for first-time visitors
        colorMode: { value: 'system' },

        // Initial palette (applied via SSR <style>)
        colorPalette: { value: { primary: 'green', neutral: 'zinc' } },
    },
});
```

## What you get

- **Auto-imported composables** — `useColorMode()`, `useColorPalette()`, `useLocale()` and `useLocaleManager()`. No explicit imports needed.
- **SSR plugins** — emit the palette `<style>` block + `<html class="dark">` + `<html lang>` + any per-theme `data-*` attributes (e.g. `data-bs-theme` from theme-bootstrap) before first paint.
- **Auto CSS injection** — `@vuecs/design`'s `assets/index.css` is registered as a Nuxt CSS source.
- **Cookie-backed state** — `vc-color-mode`, `vc-color-palette` and `vc-locale` cookies persist user choices; the server reads them for SSR.
- **Theme-agnostic dispatch** — the palette + color-mode runtime walks installed themes' `palette.handle` / `colorMode.handle` hooks. Same module, every theme.

## `@vuecs/nuxt` module options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `injectTokens` | `boolean` | `true` | Auto-import `@vuecs/design`'s `assets/index.css` |
| `themes` | `string[]` | `undefined` | Module names to auto-install via a generated plugin. Each is imported as a default no-arg factory. |
| `colorMode` | `boolean \| object` | `true` | Enable the bundled color-mode composable + SSR plugin |
| `colorMode.cookieName` | `string` | `'vc-color-mode'` | Cookie name used to persist the mode |
| `colorMode.value` | `'light' \| 'dark' \| 'system'` | `'system'` | Default mode for first-time visitors |
| `colorPalette` | `boolean \| object` | `true` | Enable the bundled palette composable + SSR plugin |
| `colorPalette.cookieName` | `string` | `'vc-color-palette'` | Cookie name used to persist the palette |
| `colorPalette.value` | `Partial<Record<SemanticScaleName, ColorPaletteName>>` | `{}` | Initial palette assignment, applied via SSR |
| `locale` | `boolean \| object` | `true` | Enable the bundled cookie-backed locale composables + SSR plugin |
| `locale.cookieName` | `string` | `'vc-locale'` | Cookie name used to persist the locale source |
| `locale.value` | `string` | `'auto'` | Initial source; `'auto'` detects via `Accept-Language` (server) / `navigator` (client) |
| `locale.fallback` | `string` | `'en-US'` | Concrete tag when `'auto'` and no browser language is available |
| `cookie` | `CookieOptions` | `{ maxAge: 1y, sameSite: 'lax', path: '/' }` | Cookie attributes for the **color-mode** cookie |
| `paletteCookie` | `CookieOptions` | inherits `cookie` | Cookie attributes for the **palette** cookie (defaults to `cookie` per-key) |
| `localeCookie` | `CookieOptions` | inherits `cookie` | Cookie attributes for the **locale** cookie (defaults to `cookie` per-key) |

### Cookie configuration

Most apps want the same retention / domain / SameSite for both UI-state
cookies — the palette cookie inherits attributes from `cookie` by
default. Override per-key via `paletteCookie` if you need divergent
retention:

```ts
vuecs: {
    cookie: {
        maxAge: 60 * 60 * 24 * 30,   // 30 days — color mode
        sameSite: 'strict',
        domain: '.example.com',
        secure: true,
    },
    paletteCookie: {
        maxAge: 60 * 60 * 24 * 365,  // 1 year — palette changes less often
    },
},
```

For totally custom semantics, wire the cookies yourself with
`bindColorPalette()` from `@vuecs/design` (composed with your
theme's renderer) and `bindColorMode()` from `@vuecs/design` plus a
custom `useCookie` call.

## Theme installation: `themes` config vs. user plugin

Two ways to install themes in a Nuxt app:

**Option A — `themes` config (recommended for the common case)**

```ts
vuecs: {
    themes: ['@vuecs/theme-tailwind'],
}
```

The module generates a plugin that imports each listed package's
default factory and calls `app.use(vuecs, { themes: [tailwindTheme()] })`.
Limited to factories that take no arguments.

**Option B — user plugin (for factory args or extra installs)**

```ts
// plugins/vuecs.ts
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import lucideIcons from '@vuecs/icons-lucide';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vuecs, {
        themes: [tailwindTheme()],
        icons: [lucideIcons()],
    });
});
```

Use this form for icon presets, `app.use(vuecs, { config: { nonce } })`,
or any factory that needs arguments.

## Composables

- [`useColorPalette`](/nuxt/use-palette) — runtime palette switching
- [`useColorMode`](/nuxt/use-color-mode) — SSR-safe dark/light/system toggle
- [`useLocale` / `useLocaleManager`](/components/locale) — SSR-safe locale (read + control)

## Why not @nuxtjs/color-mode?

`@nuxtjs/color-mode` is great but optional. The bundled `useColorMode()`
is built on `@vueuse/core`'s `usePreferredDark` plus a Nuxt cookie —
fewer dependencies, simpler API surface, same SSR guarantees. If you'd
rather use `@nuxtjs/color-mode` for its richer features (separate
`system` resolution helpers, etc.), set `vuecs: { colorMode: false }`
and add it yourself. The two don't conflict.

## See also

- [`useColorPalette`](/nuxt/use-palette)
- [`useColorMode`](/nuxt/use-color-mode)
- [Design Tokens](/guide/design-tokens) — what the palette switcher operates on
