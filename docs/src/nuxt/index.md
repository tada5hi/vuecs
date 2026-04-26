# @vuecs/nuxt

A Nuxt 4 module that wires up the design tokens, palette switching, and color-mode handling — SSR-safe, with no FOUC on first paint.

```bash
npm install @vuecs/nuxt @vuecs/design
```

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        // Initial palette (applied via SSR <style>)
        palette: { primary: 'green', neutral: 'zinc' },
        // colorMode: true (default) ships the in-house useColorMode().
        // Set false to disable and use @nuxtjs/color-mode yourself.
    },
});
```

## What you get

- **Auto-imported composables** — `useColorMode()`, `usePalette()`. No explicit imports.
- **SSR plugins** — emit the palette `<style>` block and `<html class="dark">` before first paint.
- **Auto CSS injection** — `@vuecs/design`'s `assets/index.css` is registered as a Nuxt CSS source.
- **Cookie-backed mode** — `vc-color-mode` cookie persists `light` / `dark` / `system`; the server reads it for SSR.

## Module options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `palette` | `PaletteConfig` | `{}` | Initial palette assignment, applied via SSR |
| `injectTokens` | `boolean` | `true` | Auto-import `@vuecs/design`'s `assets/index.css` |
| `colorMode` | `boolean \| object` | `true` | Enable the bundled color-mode composable + SSR plugin |
| `colorMode.cookieName` | `string` | `'vc-color-mode'` | Cookie name used to persist the mode |
| `colorMode.preference` | `'light' \| 'dark' \| 'system'` | `'system'` | Default mode for first-time visitors |
| `cookie` | `CookieOptions` | `{ maxAge: 1y, sameSite: 'lax', path: '/' }` | Shared cookie attributes for both vuecs cookies (palette + color-mode). Configure `domain`, `secure`, `sameSite`, etc. for cross-subdomain or strict-SSO setups. |

### Cookie configuration

Both the `vc-palette` and the color-mode cookie use the same options. Override via `vuecs.cookie` in `nuxt.config.ts`:

```ts
vuecs: {
    cookie: {
        maxAge: 60 * 60 * 24 * 30,   // 30 days
        sameSite: 'strict',          // or 'none' (with secure: true)
        domain: '.example.com',      // subdomain sharing
        secure: true,                 // required when sameSite='none'
        path: '/',
    },
},
```

If you need divergent semantics between the two cookies, wire them yourself with `bindPalette()` / `bindColorMode()` from `@vuecs/design` plus a custom `useCookie` call.

## Composables

- [`usePalette`](/nuxt/use-palette) — runtime palette switching
- [`useColorMode`](/nuxt/use-color-mode) — SSR-safe dark/light/system toggle

## Why not @nuxtjs/color-mode?

`@nuxtjs/color-mode` is great but optional. The bundled `useColorMode()` is built on `@vueuse/core`'s `usePreferredDark` plus a Nuxt cookie — fewer dependencies, simpler API surface, same SSR guarantees. If you'd rather use `@nuxtjs/color-mode` for its richer features (separate `system` resolution helpers, etc.), set `vuecs: { colorMode: false }` and add it yourself. The two don't conflict.

## See also

- [`usePalette`](/nuxt/use-palette)
- [`useColorMode`](/nuxt/use-color-mode)
- [Design Tokens](/guide/design-tokens) — what the palette switcher operates on
