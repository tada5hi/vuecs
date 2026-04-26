# Timeago

Renders a timestamp as a relative time string ("3 minutes ago", "yesterday", etc.) with locale support.

```bash
npm install @vuecs/timeago
```

## Basic usage

<Demo name="timeago">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCTimeago } from '@vuecs/timeago';
const tenSecondsAgo = Date.now() - 10_000;
const oneHourAgo = Date.now() - 60 * 60 * 1000;
</script>

<template>
    <VCTimeago :datetime="tenSecondsAgo" />
    <VCTimeago :datetime="oneHourAgo" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Locale switching

```ts
import { injectLocale } from '@vuecs/timeago';
const locale = injectLocale();
locale.value = 'de';
```

The locale ref is provided by `@vuecs/timeago` at app install time. Mutate it to change the language for every `<VCTimeago>` instance reactively.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `datetime` | `number \| string \| Date` | — | The timestamp to render relative to now |

## See also

- [Theme System](/guide/theme-system)
