<script setup>
import Countdown from '../.vitepress/theme/demos/Countdown.vue';
</script>

# Countdown

Counts down from a target time, exposing `hours`, `minutes`, `seconds`, and `days` via slot props.

```bash
npm install @vuecs/countdown
```

## Basic usage

<Demo>
  <Countdown />

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCCountdown } from '@vuecs/countdown';
const time = 3600 * 1000;
</script>

<template>
    <VCCountdown :time="time">
        <template #default="props">
            <span class="font-medium">
                {{ props.hours }}h
                {{ props.minutes }}m
                {{ props.seconds }}s
            </span>
            remaining
        </template>
    </VCCountdown>
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `time` | `number` | — | Time in milliseconds to count down |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `CountdownSlotProps` | `{ days, hours, minutes, seconds }` |

## See also

- [Theme System](/guide/theme-system)
- [Behavioral Defaults](/guide/behavioral-defaults)
