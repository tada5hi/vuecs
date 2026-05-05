# useColorPalette

SSR-safe palette switching. Auto-imported by **`@vuecs/theme-tailwind-nuxt`** (a sibling module to `@vuecs/nuxt`). The composable reads the active palette and lets you swap any of the six semantic scales at runtime — and persists the user's choice via a Nuxt cookie so the server can paint the correct palette on first load.

::: tip
This composable ships from `@vuecs/theme-tailwind-nuxt`, not `@vuecs/nuxt`. Install both modules in your `nuxt.config.ts`:

```ts
modules: ['@vuecs/nuxt', '@vuecs/theme-tailwind-nuxt'],
```

Bootstrap- and Bulma-only Nuxt apps don't get `useColorPalette()` — those frameworks don't ship runtime palette switching.
:::

## Basic usage

```vue
<script setup lang="ts">
const { current, extend } = useColorPalette();

const goGreen = () => {
    extend({ primary: 'green' });
};
</script>

<template>
    <button @click="goGreen">Go green</button>
    <p>Current primary: {{ current.primary ?? 'blue' }}</p>
</template>
```

## API

Identical return shape to `@vuecs/theme-tailwind`'s SPA `useColorPalette()`. Quick recap:

```ts
interface UseColorPaletteReturn<ColorPaletteConfig> {
    current: ComputedRef<ColorPaletteConfig>;
    set(palette: ColorPaletteConfig): void;       // replace
    extend(partial: ColorPaletteConfig): void;    // merge
}
```

## How SSR works

On the server, the module's `color-palette.server.ts` plugin reads the `vc-color-palette` cookie (or the `nuxt.config.ts` default) and emits a `<style id="vc-color-palette">` block into `<head>` containing the initial palette. On the client, `set()` writes the cookie via `useCookie` and re-applies via `setColorPalette()`, idempotently updating the same `<style>` element — no flash on hydration.

The composable is a thin wrapper over `bindColorPalette()` from `@vuecs/design` composed with `renderColorPaletteStyles()` from `@vuecs/theme-tailwind`: the cookie ref is the reactive source, `bindColorPalette()` handles the apply-on-init / apply-on-change logic.

## Persistence

User palette choices persist automatically via the `vc-color-palette` cookie. Defaults: 1-year `maxAge`, `sameSite='lax'`, `path='/'`. The module's SSR plugin reads the same cookie at request time, so a returning visitor sees their preferred palette before any client JS runs. To clear the cookie, call `set({})`.

### Configuring cookie attributes

Override the defaults via `vuecsTailwind.cookie` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt', '@vuecs/theme-tailwind-nuxt'],
    vuecsTailwind: {
        cookie: {
            maxAge: 60 * 60 * 24 * 30,   // 30 days
            sameSite: 'strict',
            domain: '.example.com',      // share across subdomains
            secure: true,                 // required when sameSite='none'
            path: '/',
        },
    },
});
```

The color-mode cookie is configured separately under `vuecs.cookie` (in `@vuecs/nuxt`); each module owns its own cookie state.

If you need fully custom semantics, compose `bindColorPalette()` from `@vuecs/design` with `renderColorPaletteStyles()` from `@vuecs/theme-tailwind` and your own `useCookie` call.

## See also

- [`useColorMode`](/nuxt/use-color-mode) — the SSR pattern is identical
- [Design Tokens — Vue composables](/guide/design-tokens#vue-composables) — the SPA `useColorPalette()` from `@vuecs/theme-tailwind` (localStorage-backed)
- [`setColorPalette()`](/guide/design-tokens#runtime-palette-switching) — pure DOM API
