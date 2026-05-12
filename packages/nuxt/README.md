# @vuecs/nuxt

[![npm version](https://badge.fury.io/js/@vuecs%2Fnuxt.svg)](https://badge.fury.io/js/@vuecs%2Fnuxt)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Theme-agnostic Nuxt 4 module for vuecs — auto-injects `@vuecs/design`
design tokens and ships SSR-safe color-mode + palette handling
(`useColorMode` and `useColorPalette` auto-imports + matching SSR
plugins). The runtime dispatches through whichever themes the consumer
installs, so the same module covers Tailwind, Bulma, and any
palette-aware community theme.

Full documentation:

- [Module reference](https://vuecs.dev/nuxt/)
- [`useColorMode`](https://vuecs.dev/nuxt/use-color-mode)
- [`useColorPalette`](https://vuecs.dev/nuxt/use-palette)

```bash
npm install @vuecs/nuxt @vuecs/design @vuecs/theme-tailwind
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        themes: ['@vuecs/theme-tailwind'],
        colorMode: { value: 'system' },
        colorPalette: { value: { primary: 'green' } },
    },
});
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
