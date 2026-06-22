# Countdown

Counts down from a target time, exposing `hours`, `minutes`, `seconds`, and `days` via slot props.

```bash
npm install @vuecs/countdown
```

## Basic usage

<Demo name="countdown">

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
| `time` | `number` | `0` | Time in milliseconds to count down |
| `autoStart` | `boolean` | `true` | Start the countdown automatically on mount and whenever `time` / `now` change |
| `emitEvents` | `boolean` | `true` | Emit the `start` / `progress` / `abort` / `end` events (set `false` to silence them) |
| `interval` | `number` | `1000` | Update interval in milliseconds between `progress` ticks |
| `now` | `() => number` | `() => Date.now()` | Returns the current timestamp — used to compute the end time and to re-sync after the tab regains visibility |
| `as` | `string \| Component` | `'span'` | Element or component to render as (string tag or `RouterLink` / `NuxtLink`). |
| `tag` | `string \| Component` | — | **Deprecated** — use `as`. Non-breaking alias; takes precedence over `as` when set. |
| `themeClass` | `Partial<CountdownThemeClasses>` | `undefined` | Per-instance theme override |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Events

All events are suppressed when `emitEvents` is `false`.

| Event | Payload | Description |
|-------|---------|-------------|
| `start` | — | Countdown started — via `autoStart` or an explicit `start()` call |
| `progress` | `Omit<CountdownSlotProps, 'isCounting'>` | Fires on every `interval` tick while time remains, with the remaining time broken down (`{ days, hours, minutes, seconds, milliseconds, totalDays, totalHours, totalMinutes, totalSeconds, totalMilliseconds }`) |
| `abort` | — | Countdown stopped early via `abort()` |
| `end` | — | Countdown reached zero (naturally or via `end()`) |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `CountdownSlotProps` | `{ isCounting, days, hours, minutes, seconds, milliseconds, totalDays, totalHours, totalMinutes, totalSeconds, totalMilliseconds }` |

## Exposed

Attach a template ref to inspect running state and drive the timer imperatively.

| Member | Type | Description |
|--------|------|-------------|
| `isCounting` | `Readonly<Ref<boolean>>` | `true` while the countdown is running. Flips to `false` after `abort()` or natural completion (`end`) |
| `start()` | `() => void` | Begin (or restart) the countdown |
| `abort()` | `() => void` | Stop and emit `abort` |
| `end()` | `() => void` | Stop, zero the remaining time, and emit `end` |

## See also

- [Theme System](/guide/theme-system)
- [Behavioral Defaults](/guide/behavioral-defaults)
