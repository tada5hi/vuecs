# useColorMode

SSR-safe dark/light/system color mode. Cookie-backed, hydrates without FOUC.

## Basic usage

```vue
<script setup lang="ts">
const { mode, resolved, isDark, toggle } = useColorMode();
</script>

<template>
    <button @click="toggle">
        {{ resolved === 'dark' ? '🌞 Light' : '🌙 Dark' }}
    </button>
    <p>Selected: {{ mode }} (resolves to {{ resolved }})</p>
</template>
```

## API

```ts
type ColorMode = 'light' | 'dark' | 'system';

interface UseColorModeReturn {
    /** Selected mode — may be 'system' to defer to OS preference */
    mode: WritableComputedRef<ColorMode>;

    /** Effective mode — always 'light' or 'dark', resolves system to OS */
    resolved: ComputedRef<'light' | 'dark'>;

    /**
     * Convenience boolean. Writable:
     *   isDark.value = true  → mode='dark'
     *   isDark.value = false → mode='light'
     */
    isDark: WritableComputedRef<boolean>;

    /** Flip light ↔ dark explicitly. Leaves 'system' unless re-selected via mode. */
    toggle: () => void;
}
```

## SSR semantics

The mode is persisted in a cookie (`vc-color-mode` by default). On the server:

- If the cookie is set to `'light'` or `'dark'`, the SSR plugin emits `class="light"` or `class="dark"` on `<html>` immediately — no FOUC.
- If the cookie is set to `'system'` (or unset), the server **cannot** resolve the OS preference — there's no `prefers-color-scheme` available pre-hydration. The class is omitted; the client applies it on first render.

Once on the client, `usePreferredDark` from `@vueuse/core` watches the OS preference and `mode` resolves accordingly.

## Configuration

In `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        colorMode: {
            cookieName: 'my-app-color-mode',
            preference: 'dark',  // default for first-time visitors
        },
    },
});
```

## Use without Nuxt

In a non-Nuxt app, use [`@vueuse/core`'s `useDark`](https://vueuse.org/core/useDark/) directly — it provides the same toggle pattern. The bundled `useColorMode()` is just `useDark` + Nuxt cookie + SSR plugin glue.

## See also

- [Dark Mode getting-started guide](/getting-started/dark-mode)
- [`usePalette`](/nuxt/use-palette) — palette switching
