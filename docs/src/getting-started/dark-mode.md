# Dark Mode

Dark mode in vuecs is class-based: toggle `.dark` on `<html>` (or any ancestor of your component tree), and the design-system tokens in `@vuecs/design` flip automatically.

## How it works

In `assets/index.css`:

```css
:root {
    --vc-color-bg:           var(--color-white);
    --vc-color-fg:           var(--vc-color-neutral-900);
    --vc-color-border:       var(--vc-color-neutral-200);
    /* ... */
}

.dark {
    --vc-color-bg:           var(--vc-color-neutral-900);
    --vc-color-fg:           var(--vc-color-neutral-200);
    --vc-color-border:       var(--vc-color-neutral-800);
    /* ... */
}
```

Only the **semantic aliases** flip. The numeric scales (`--vc-color-primary-500`, etc.) stay the same — your primary blue is the same blue in both modes.

Components use `bg-bg`, `text-fg`, `border-border` (and their tokenized equivalents in non-Tailwind themes), so they all flip together.

## Configuring the variant

In your stylesheet, add the `dark` variant if you want to author dark-specific overrides:

```css
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

This makes `dark:bg-primary-700` and friends work in your own classes. (Component packages don't need it — they read tokens, which flip on their own.)

## Toggle in vanilla Vue

Roll your own toggle, or use [`@vueuse/core`](https://vueuse.org)'s `useDark`:

```vue
<script setup>
import { useDark } from '@vueuse/core';
const isDark = useDark();
</script>

<template>
    <button @click="isDark = !isDark">
        {{ isDark ? '🌞' : '🌙' }}
    </button>
</template>
```

`useDark` adds/removes the `.dark` class on `<html>` automatically.

## Toggle in Nuxt

`@vuecs/nuxt` ships its own `useColorMode()` composable, SSR-safe and cookie-backed:

```vue
<script setup>
const { mode, resolved, isDark, toggle } = useColorMode();
</script>

<template>
    <button @click="toggle">{{ resolved === 'dark' ? '🌞' : '🌙' }}</button>
</template>
```

The composable is auto-imported. The `vc-color-mode` cookie persists the user's choice; the SSR plugin reads it and emits `class="dark"` on `<html>` before first paint, so there's no FOUC.

If you'd rather use [`@nuxtjs/color-mode`](https://github.com/nuxt-modules/color-mode), set `vuecs: { colorMode: false }` in `nuxt.config.ts` to opt out and wire it yourself.

See [`useColorMode`](/nuxt/use-color-mode) for the full API.

## Custom palettes in dark mode

The `.dark` flip only changes semantic aliases. To repalette the whole UI in dark mode (e.g. cooler blues, warmer accents), call `setPalette()` after `<html>` gains the `.dark` class:

```ts
import { setPalette } from '@vuecs/design';
import { watch } from 'vue';

watch(isDark, (dark) => {
    setPalette({
        primary: dark ? 'cyan' : 'blue',
    });
});
```

## Next steps

- [Theme System guide](/guide/theme-system) — full resolution rules
- [Design Tokens guide](/guide/design-tokens) — token chain, runtime palette switching
- [`useColorMode`](/nuxt/use-color-mode) — Nuxt composable reference
