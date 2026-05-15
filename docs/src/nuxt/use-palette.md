# useColorPalette

SSR-safe palette switching. Auto-imported by **`@vuecs/nuxt`**. The
composable reads the active palette and lets you swap any of the six
semantic scales at runtime — and persists the user's choice via a Nuxt
cookie so the server can paint the correct palette on first load.

The dispatch is theme-agnostic: the composable walks every installed
theme's `palette.handle` hook (Tailwind, Bulma, or any community
palette-aware theme) and concatenates the rendered CSS. The same
composable drives every theme, no per-theme Nuxt module needed.

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

Same return shape as the SPA `useColorPalette()` from `@vuecs/design`.
Quick recap:

```ts
interface UseColorPaletteReturn<NuxtColorPaletteConfig> {
    current: ComputedRef<NuxtColorPaletteConfig>;
    set(palette: NuxtColorPaletteConfig): void;       // replace
    extend(partial: NuxtColorPaletteConfig): void;    // merge
}
```

`NuxtColorPaletteConfig` is `Partial<Record<SemanticScaleName, ColorPaletteName>>`
using the design-system catalog (22 palette names × 6 semantic scales).
Community themes that extend the catalog via `ExtraColorPaletteNames`
widen the type automatically.

## How SSR works

On the server, `@vuecs/nuxt`'s `colorPalette.server.ts` plugin reads the
`vc-color-palette` cookie (or the `nuxt.config.ts` default) and walks
installed themes' `palette.handle` hooks via
`renderColorPaletteFromThemes()`, concatenating outputs into a
`<style id="vc-color-palette">` block emitted into `<head>` via
`useHead`. On the client, `set()` writes the cookie via `useCookie` and
re-renders via `useColorPaletteUnshared()` — idempotently updating the
same `<style>` element — no flash on hydration.

The composable is a thin wrapper over `useColorPaletteUnshared()` from
`@vuecs/design`, passing a cookie-backed `Ref<T>` as the `source`
option. Theme swaps via `setThemes()` mid-session are reactive — the
underlying `watchEffect` reads `manager.themes` on every render.

## Persistence

User palette choices persist automatically via the `vc-color-palette`
cookie. Defaults: 1-year `maxAge`, `sameSite='lax'`, `path='/'`. The
module's SSR plugin reads the same cookie at request time, so a
returning visitor sees their preferred palette before any client JS
runs. To clear the cookie, call `set({})`.

### Configuring cookie attributes

The palette cookie inherits attributes from `vuecs.cookie` (the
color-mode cookie config) by default — most apps want consistent
retention across UI-state cookies. Override per-key via
`vuecs.paletteCookie` if you need divergent retention:

```ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
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
});
```

If you need fully custom semantics, compose `useColorPaletteUnshared()`
from `@vuecs/design` directly with your own `useCookie` call as the
`source` option.

## See also

- [`useColorMode`](/nuxt/use-color-mode) — the SSR pattern is identical
- [Design Tokens — Vue composables](/guide/design-tokens#vue-composables) — the SPA `useColorPalette()` from `@vuecs/design` (localStorage-backed)
- [`setColorPalette()`](/guide/design-tokens#runtime-palette-switching) — pure DOM API
