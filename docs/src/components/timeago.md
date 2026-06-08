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

`<VCTimeago>` reads the active locale from `@vuecs/core`'s cross-cutting
config via `useLocale()`. Set it once, globally, and every instance reacts:

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import timeago from '@vuecs/timeago';

const app = createApp(App);
app.use(vuecs, { config: { locale: 'de-DE' } });
app.use(timeago, { locales: { 'de-DE': /* date-fns Locale */ } });
```

Change it at runtime with `setConfig`, or override per instance with the
`:locale` prop:

```vue
<VCTimeago :datetime="ts" locale="fr-FR" />
```

For browser-language detection plus a user override with a reset path, add
[`@vuecs/locale`](/components/locale):

```ts
import { useLocaleManager } from '@vuecs/locale';
const { set, reset } = useLocaleManager();
set('de-DE'); // apply a saved preference
reset();      // back to the browser language
```

> The `locale` value is a key into the `locales` map you register with
> `@vuecs/timeago` (mapping a tag to a `date-fns` `Locale`). Unmapped tags
> fall back to `date-fns`'s default English output.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `datetime` | `number \| string \| Date` | — | The timestamp to render relative to now |
| `locale` | `string` | config `locale` | Per-instance override of the active locale tag |
| `title` | `string \| boolean` | — | Tooltip text; `true` uses the rendered relative string |
| `autoUpdate` | `number \| boolean` | `true` | Refresh interval in seconds (`true` = 60s, `false` = off) |
| `converter` | `Converter` | built-in | Custom relative-time formatter |
| `converterOptions` | `ConverterOptions` | — | `{ includeSeconds, addSuffix }` for the built-in converter |

## See also

- [Theme System](/guide/theme-system)
