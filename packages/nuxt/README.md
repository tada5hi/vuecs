# @vuecs/nuxt

[![npm version](https://badge.fury.io/js/@vuecs%2Fnuxt.svg)](https://badge.fury.io/js/@vuecs%2Fnuxt)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Theme-agnostic Nuxt 4 module for vuecs — auto-injects `@vuecs/design` design
tokens, ships SSR-safe color-mode handling (`useColorMode` auto-import +
`<html class="dark|light">` SSR plugin).

For runtime palette switching, install [`@vuecs/theme-tailwind-nuxt`](../../themes/tailwind-nuxt)
alongside this module — palette concerns live there because they're
Tailwind-specific. BS / Bulma-only Nuxt apps install only `@vuecs/nuxt` and
skip palette switching entirely.

Full documentation:

- [Module reference](https://vuecs.dev/nuxt/)
- [`useColorMode`](https://vuecs.dev/nuxt/use-color-mode)

```bash
npm install @vuecs/nuxt @vuecs/design
# add @vuecs/theme-tailwind @vuecs/theme-tailwind-nuxt for Tailwind palette runtime
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: [
        '@vuecs/nuxt',
        // '@vuecs/theme-tailwind-nuxt',  // optional, for palette switching
    ],
    vuecs: {
        // colorMode: true (default) ships the bundled useColorMode().
    },
});
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
