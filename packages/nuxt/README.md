# @vuecs/nuxt

[![npm version](https://img.shields.io/npm/v/@vuecs/nuxt)](https://www.npmjs.com/package/@vuecs/nuxt)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The Nuxt module for [vuecs](https://github.com/tada5hi/vuecs)** — theme-agnostic, SSR-first. Dark mode, runtime palettes, and locale are rendered into the head **before first paint**, so there's no flash of the wrong theme, ever. One module covers Tailwind, Bootstrap, Bulma, and any palette-aware community theme.

## ✨ What's inside

- 🌗 **SSR-safe color mode** — cookie-backed `useColorMode()` auto-import; the server emits `html.dark` / `html.light` *plus* per-theme attributes (`data-bs-theme`, `data-theme`) via each theme's `colorMode.handle` hook.
- 🎨 **SSR-safe palettes** — cookie-backed `useColorPalette()`; the server renders the `<style id="vc-color-palette">` block by walking installed themes' `palette.handle` renderers. CSP nonce supported.
- 🌍 **SSR-safe locale** — cookie-backed locale plugin: resolves `'auto'` from the request's `Accept-Language` on the server, bridges into `Config['locale']`, emits `<html lang>`; `useLocale()` + `useLocaleManager()` auto-imports.
- 🎛️ **Design tokens auto-injected** — `@vuecs/design`'s CSS ships automatically (opt out via `injectTokens: false`).
- 🔌 **Theme auto-install** — list packages under `vuecs: { themes: [...] }` and the module generates the install plugin for you.
- 🚪 **Everything opt-out** — `colorMode: false`, `colorPalette: false`, `locale: false` for apps that bring their own.

## 📦 Installation

```bash
npm install @vuecs/nuxt @vuecs/design @vuecs/theme-tailwind
```

## ⚡ Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        themes: ['@vuecs/theme-tailwind'],
        colorMode: { value: 'system' },
        colorPalette: { value: { primary: 'green' } },
        cookie: { maxAge: 31536000, sameSite: 'lax' },
    },
});
```

```vue
<script setup>
const { resolved, toggle } = useColorMode();      // auto-imported
const { current, set } = useColorPalette();       // auto-imported
const { set: setLocale, reset } = useLocaleManager();  // auto-imported
</script>
```

## 📚 Documentation

[Module reference](https://vuecs.dev/nuxt/) · [`useColorMode`](https://vuecs.dev/nuxt/use-color-mode) · [`useColorPalette`](https://vuecs.dev/nuxt/use-palette)

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
