# usePalette

SSR-safe palette switching. The composable reads the active palette and lets you swap any of the six semantic scales at runtime.

## Basic usage

```vue
<script setup lang="ts">
const { current, setPalette } = usePalette();

const goGreen = () => {
    setPalette({ primary: 'green' });
};
</script>

<template>
    <button @click="goGreen">Go green</button>
    <p>Current primary: {{ current.primary ?? 'blue' }}</p>
</template>
```

## API

```ts
interface UsePaletteReturn {
    /** Current palette assignment (reactive) */
    current: ComputedRef<PaletteConfig>;
    /** Update one or more scales — merges with current */
    setPalette: (palette: PaletteConfig) => void;
}
```

## How SSR works

On the server, the Nuxt module's `palette.server.ts` plugin emits a `<style id="vc-palette">` block into `<head>` containing the initial palette (configured in `nuxt.config.ts`). On the client, `setPalette()` updates the same element idempotently — no flash on hydration.

## Persisting changes

The composable doesn't persist palette choices by itself — it just updates the live state. If you want user-selected palettes to survive page reloads, save the choice to a cookie or localStorage and restore it on app mount:

```vue
<script setup lang="ts">
const { current, setPalette } = usePalette();
const palette = useCookie('user-palette', { default: () => ({}) });

// Restore on mount
if (palette.value.primary) setPalette(palette.value);

watch(current, (next) => {
    palette.value = next;
});
</script>
```

## See also

- [`useColorMode`](/nuxt/use-color-mode) — the SSR pattern is identical
- [Design Tokens](/guide/design-tokens) — the layer below the composable
- [`setPalette()`](/guide/design-tokens#runtime-palette-switching) — pure DOM API
