# usePalette

SSR-safe palette switching. The composable reads the active palette and lets you swap any of the six semantic scales at runtime — and persists the user's choice via a Nuxt cookie so the server can paint the correct palette on first load.

## Basic usage

```vue
<script setup lang="ts">
const { current, extend } = usePalette();

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

Identical return shape to `@vuecs/design`'s default `usePalette()` — see the [Composables guide](/guide/composables#usepalette) for the full reference. Quick recap:

```ts
interface UsePaletteReturn {
    current: ComputedRef<PaletteConfig>;
    set(palette: PaletteConfig): void;       // replace
    extend(partial: PaletteConfig): void;    // merge
}
```

## How SSR works

On the server, the Nuxt module's `palette.server.ts` plugin reads the `vc-palette` cookie (or the `nuxt.config.ts` default) and emits a `<style id="vc-palette">` block into `<head>` containing the initial palette. On the client, `set()` writes the cookie via `useCookie` and re-applies via `setPalette()`, idempotently updating the same `<style>` element — no flash on hydration.

The composable is a thin wrapper over `bindPalette()` from `@vuecs/design`: the cookie ref is the reactive source, `bindPalette()` handles the apply-on-init / apply-on-change logic.

## Persistence

User palette choices persist automatically via the `vc-palette` cookie (1-year expiry, `samesite=lax`). The Nuxt module's SSR plugin reads the same cookie at request time, so a returning visitor sees their preferred palette before any client JS runs. To clear the cookie, call `set({})`.

## See also

- [`useColorMode`](/nuxt/use-color-mode) — the SSR pattern is identical
- [Design Tokens — Vue composables](/guide/design-tokens#vue-composables) — the framework-agnostic `usePalette()` from `@vuecs/design` (localStorage-backed)
- [`setPalette()`](/guide/design-tokens#runtime-palette-switching) — pure DOM API
