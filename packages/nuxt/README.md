# @vuecs/nuxt 🧩

[![npm version](https://badge.fury.io/js/@vuecs%2Fnuxt.svg)](https://badge.fury.io/js/@vuecs%2Fnuxt)

Nuxt module for the vuecs component library. Wires
`@vuecs/design` into Nuxt with **SSR-safe palette preloading**
(no FOUC on first paint) and a ready-to-use `usePalette()`
composable.

**Table of Contents**

- [Installation](#installation)
- [Setup](#setup)
- [Options](#options)
- [usePalette()](#usepalette)
- [useColorMode()](#usecolormode)
- [Dark Mode](#dark-mode)
- [Requirements](#requirements)
- [License](#license)

## Installation

```bash
npm install @vuecs/nuxt @vuecs/design
```

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        palette: {
            primary: 'green',
            neutral: 'zinc',
        },
    },
});
```

That's all. The module:

- Prepends `@vuecs/design` (the tokens stylesheet) to your CSS stack.
- Registers a server plugin that renders the palette override as
  `<style id="vc-palette">` into the head during SSR — first paint
  matches the configured palette exactly.
- Exposes `usePalette()` as an auto-imported composable.

## Options

```ts
interface ModuleOptions {
    /**
     * Runtime palette override applied before first paint. Each key maps a
     * semantic scale to a Tailwind v4 palette name.
     *
     * Default: {} (@vuecs/design defaults: primary=blue, neutral=neutral,
     *              success=green, warning=amber, error=red, info=sky)
     */
    palette?: PaletteConfig;

    /**
     * Auto-import `@vuecs/design` (tokens stylesheet). Disable when you
     * want to import it manually to control load order relative to your
     * own base CSS.
     *
     * Default: true
     */
    injectTokens?: boolean;

    /**
     * SSR-safe dark-mode integration (cookie-backed, FOUC-free). Set
     * to `false` to skip — useful if you wire `@nuxtjs/color-mode`
     * yourself. Pass an object to tweak `cookieName` / `preference`.
     *
     * Default: true
     */
    colorMode?: boolean | { cookieName?: string; preference?: 'light' | 'dark' | 'system' };
}
```

## usePalette()

```vue
<script setup lang="ts">
const { current, setPalette } = usePalette();

// Current palette (reactive; reflects initial SSR value)
console.log(current.value); // { primary: 'green', neutral: 'zinc' }

// Switch at runtime — updates <style id="vc-palette"> in-place
function enableDemoMode() {
    setPalette({ primary: 'fuchsia', success: 'emerald' });
}
</script>
```

Runtime switches mutate the same `<style>` element the server rendered,
so there's no layout shift and no cascade reshuffle.

## useColorMode()

The module ships an SSR-safe `useColorMode()` composable, auto-imported
alongside `usePalette()`. It's built on `@vueuse/core`'s
`usePreferredDark` plus a Nuxt cookie for persistence — the server reads
the cookie before first paint, applies `class="dark"` (or `light`) to
`<html>`, and the client hydrates against the same class without FOUC.

```vue
<script setup lang="ts">
const { mode, resolved, isDark, toggle } = useColorMode();

// `mode` is 'light' | 'dark' | 'system' (writable)
// `resolved` is 'light' | 'dark' (always concrete)
// `isDark` is a writable boolean
// `toggle()` flips between light and dark
</script>

<template>
    <button @click="toggle">
        {{ resolved === 'dark' ? '☀️ Light' : '🌙 Dark' }}
    </button>
</template>
```

Configure cookie name and default preference via the module's
`colorMode` option:

```ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        colorMode: { cookieName: 'theme', preference: 'dark' },
    },
});
```

Set `colorMode: false` to disable the integration entirely (e.g. if you
prefer to wire `@nuxtjs/color-mode` yourself).

## Dark Mode

The `@vuecs/design` tokens flip under `.dark` automatically — no
per-component overrides needed. Pair the design tokens with the
built-in `useColorMode()` (above) for SSR-safe dark mode out of the
box, or with `@nuxtjs/color-mode` if you prefer:

```ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt', '@nuxtjs/color-mode'],
    vuecs: { colorMode: false },               // disable our integration
    colorMode: { classSuffix: '' },            // emit `class="dark"`
});
```

## Requirements

- **Nuxt 4+**
- **Tailwind CSS v4+** (set up via `@tailwindcss/vite` or your preferred
  v4 integration — see the example app at `examples/nuxt/` for a working
  config)

## License

Made with 💚

Published under [MIT License](./LICENSE).
