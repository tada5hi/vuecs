# @vuecs/nuxt

[![npm version](https://badge.fury.io/js/@vuecs%2Fnuxt.svg)](https://badge.fury.io/js/@vuecs%2Fnuxt)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Nuxt 4 module for vuecs — SSR-safe palette switching, dark/light/system color mode, design-token auto-import, and auto-imported composables (`usePalette`, `useColorMode`).

Full documentation:

- [Module reference](https://vuecs.dev/nuxt/)
- [`usePalette`](https://vuecs.dev/nuxt/use-palette)
- [`useColorMode`](https://vuecs.dev/nuxt/use-color-mode)

```bash
npm install @vuecs/nuxt @vuecs/design
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        palette: { primary: 'green' },
    },
});
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
