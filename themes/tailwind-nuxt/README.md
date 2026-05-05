# @vuecs/theme-tailwind-nuxt

Nuxt module that ships SSR-safe runtime palette switching for
[`@vuecs/theme-tailwind`](https://www.npmjs.com/package/@vuecs/theme-tailwind).

Install alongside `@vuecs/nuxt` (which handles tokens + color mode):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: [
        '@vuecs/nuxt',
        '@vuecs/theme-tailwind-nuxt',
    ],
    vuecsTailwind: {
        colorPalette: { primary: 'green', neutral: 'zinc' },
    },
});
```

See [vuecs.dev](https://vuecs.dev) for full documentation.
