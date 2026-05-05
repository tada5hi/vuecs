# Nuxt integration

vuecs ships **two sibling Nuxt modules** by concern (plan 017):

- **`@vuecs/nuxt`** — theme-agnostic. Auto-injects design tokens, ships SSR-safe color-mode handling. Install for every vuecs Nuxt app.
- **`@vuecs/theme-tailwind-nuxt`** — Tailwind-specific. Ships SSR-safe runtime palette switching. Install only when using `@vuecs/theme-tailwind`.

Bootstrap- and Bulma-only Nuxt apps install **only** `@vuecs/nuxt`; they don't need (or get) palette switching.

```bash
# Tailwind app
npm install @vuecs/nuxt @vuecs/design @vuecs/theme-tailwind @vuecs/theme-tailwind-nuxt

# Bootstrap app
npm install @vuecs/nuxt @vuecs/design @vuecs/theme-bootstrap
```

## Setup (Tailwind app)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: [
        '@vuecs/nuxt',
        '@vuecs/theme-tailwind-nuxt',
    ],
    vuecs: {
        // Theme-agnostic options live here
        // colorMode: true (default) ships the in-house useColorMode().
        // Set false to disable and use @nuxtjs/color-mode yourself.
    },
    vuecsTailwind: {
        // Initial palette (applied via SSR <style>)
        colorPalette: { primary: 'green', neutral: 'zinc' },
    },
});
```

## Setup (Bootstrap / Bulma app)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        // tokens injection + color mode
    },
});
```

No palette config — those frameworks don't ship runtime palette switching.

## What you get

- **Auto-imported composables** — `useColorMode()` from `@vuecs/nuxt`; `useColorPalette()` from `@vuecs/theme-tailwind-nuxt` (when installed). No explicit imports.
- **SSR plugins** — emit the palette `<style>` block and `<html class="dark">` before first paint.
- **Auto CSS injection** — `@vuecs/design`'s `assets/index.css` is registered as a Nuxt CSS source by `@vuecs/nuxt`.
- **Cookie-backed state** — `vc-color-mode` and `vc-color-palette` cookies persist user choices; the server reads them for SSR.

## `@vuecs/nuxt` module options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `injectTokens` | `boolean` | `true` | Auto-import `@vuecs/design`'s `assets/index.css` |
| `colorMode` | `boolean \| object` | `true` | Enable the bundled color-mode composable + SSR plugin |
| `colorMode.cookieName` | `string` | `'vc-color-mode'` | Cookie name used to persist the mode |
| `colorMode.preference` | `'light' \| 'dark' \| 'system'` | `'system'` | Default mode for first-time visitors |
| `cookie` | `CookieOptions` | `{ maxAge: 1y, sameSite: 'lax', path: '/' }` | Cookie attributes for the color-mode cookie |

## `@vuecs/theme-tailwind-nuxt` module options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colorPalette` | `ColorPaletteConfig \| false` | `{}` | Initial palette assignment, applied via SSR. Set `false` to skip the SSR plugin while keeping the auto-import. |
| `cookie` | `CookieOptions` | `{ maxAge: 1y, sameSite: 'lax', path: '/' }` | Cookie attributes for the `vc-color-palette` cookie |

### Cookie configuration

Each module owns its own cookie configuration (color-mode under `vuecs.cookie`, palette under `vuecsTailwind.cookie`). Configure `domain`, `secure`, `sameSite`, etc. for cross-subdomain or strict-SSO setups:

```ts
vuecs: {
    cookie: {
        maxAge: 60 * 60 * 24 * 30,   // 30 days
        sameSite: 'strict',
        domain: '.example.com',
        secure: true,
    },
},
vuecsTailwind: {
    cookie: {
        maxAge: 60 * 60 * 24 * 365,  // 1 year — palette changes less often
        domain: '.example.com',
    },
},
```

For divergent semantics, wire the cookies yourself with `bindColorPalette()` from `@vuecs/design` (composed with `renderColorPaletteStyles()` from `@vuecs/theme-tailwind`) and `bindColorMode()` from `@vuecs/design` plus a custom `useCookie` call.

## Composables

- [`useColorPalette`](/nuxt/use-palette) — runtime palette switching (from `@vuecs/theme-tailwind-nuxt`)
- [`useColorMode`](/nuxt/use-color-mode) — SSR-safe dark/light/system toggle (from `@vuecs/nuxt`)

## Why not @nuxtjs/color-mode?

`@nuxtjs/color-mode` is great but optional. The bundled `useColorMode()` is built on `@vueuse/core`'s `usePreferredDark` plus a Nuxt cookie — fewer dependencies, simpler API surface, same SSR guarantees. If you'd rather use `@nuxtjs/color-mode` for its richer features (separate `system` resolution helpers, etc.), set `vuecs: { colorMode: false }` and add it yourself. The two don't conflict.

## See also

- [`useColorPalette`](/nuxt/use-palette)
- [`useColorMode`](/nuxt/use-color-mode)
- [Design Tokens](/guide/design-tokens) — what the palette switcher operates on
