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
- [usePalette()](#usevuecspalette)
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

## Dark Mode

This module does not ship a dark-mode strategy — pair it with a
color-mode library of your choice. For `@nuxtjs/color-mode`:

```ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt', '@nuxtjs/color-mode'],
    colorMode: { classSuffix: '' }, // emit `class="dark"` (what @vuecs/design expects)
});
```

The `@vuecs/design` tokens flip under `.dark` automatically — no
per-component overrides needed.

## Requirements

- **Nuxt 4+**
- **Tailwind CSS v4+** (set up via `@tailwindcss/vite` or your preferred
  v4 integration — see the example app at `examples/nuxt/` for a working
  config)

## License

Made with 💚

Published under [MIT License](./LICENSE).
