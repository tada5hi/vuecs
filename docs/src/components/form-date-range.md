# FormDateRange

A from / to date filter: two native `<input type="date">` fields (rendered
through [FormInput](/components/form-input)) plus optional preset buttons.
Ships pure, Vue-free helpers that turn the picked calendar days into query
bounds.

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-date-range">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormDateRange } from '@vuecs/forms';
import type { DateRangeValue } from '@vuecs/forms';
import { ref } from 'vue';

const range = ref<DateRangeValue>({});
</script>

<template>
    <VCFormDateRange v-model="range" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/* Structural layout (fields side by side, preset row). */
@import "@vuecs/forms";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Value contract

The model is `{ from?: string, to?: string }` with **local calendar days** as
`YYYY-MM-DD` — the native date-input format.

- Every user action emits **one** `update:modelValue`. A preset sets both keys
  at once; editing a field emits `{ ...modelValue, [field]: value }`, built
  from the current prop (not a local copy).
- A cleared field **removes its key** — the component never emits `''`.
- The `from` input gets `max = to`, the `to` input gets `min = from`.

## Presets

By default three presets render below the fields: **Last 7 days** (today and
the six days before), **This month** (1st to last day) and **This year**
(Jan 1 to Dec 31). They resolve against `now` (default: the current time, read on each render — the
highlight does not move at midnight on its own; pass a reactive `now` if that matters).
The preset matching the model gets `aria-pressed="true"` and the
`presetActive` theme class. Pass `:presets="[]"` to hide the group.

::: tip SSR
Without `now`, the server and the browser can disagree on which preset matches
(different clocks or time zones), and hydration does not repair mismatched
attributes. So without `now` the highlight is computed only **after mount**:
the server renders every preset with `aria-pressed="false"`, and the matching
one lights up once the component mounts in the browser. To highlight during
SSR, pass a `now` that is identical on server and client (e.g. a timestamp
carried in the SSR payload) — an explicit `now` is highlighted immediately.
:::

Custom presets implement `DateRangePreset`:

```ts
import type { DateRangePreset } from '@vuecs/forms';
import { toDateInput } from '@vuecs/forms';

const today: DateRangePreset = {
    key: 'today',
    label: 'Today',
    resolve: (now) => ({ from: toDateInput(now), to: toDateInput(now) }),
};
```

`createDateRangePresets(labels?)` returns the built-in list (keys
`DATE_RANGE_PRESET_KEYS` = `last7Days`, `thisMonth`, `thisYear`), so you can
extend it: `[...createDateRangePresets(), today]`.

## Helpers

All helpers are pure functions exported from `@vuecs/forms`. They work in the
runtime's **local timezone**.

| Helper | Returns |
|--------|---------|
| `toDateInput(date)` | The local calendar day of `date` as `YYYY-MM-DD` |
| `fromDateInput(day, 'start' \| 'end')` | The **UTC ISO-8601 instant** (`…Z`) of the local start (`00:00:00.000`) or end (`23:59:59.999`) of `day`; `undefined` for empty, malformed or non-existent days (e.g. `2026-02-30`) |
| `resolveDateRangePreset(preset, now)` | `{ from, to }` of a preset for `now` |
| `createDateRangePresets(labels?)` | The built-in presets, optionally relabelled |

### The UTC `Z` contract

`fromDateInput()` returns `Date#toISOString()` output: a UTC timestamp ending
in `Z`. It is the **same instant** as the local midnight / end of day, written
in the conventional, unambiguous wire format. In `Europe/Berlin` (UTC+1 in
winter):

```ts
fromDateInput('2026-01-05', 'start'); // '2026-01-04T23:00:00.000Z'
fromDateInput('2026-01-05', 'end');   // '2026-01-05T22:59:59.999Z'
```

DST days are handled by the platform: on `2026-03-29` (Berlin switches to
UTC+2) the start is `2026-03-28T23:00:00.000Z` and the end is
`2026-03-29T21:59:59.999Z`. Compare against `Z` timestamps on the server; do
not strip the `Z` and treat the value as local time.

### Query-builder example

```ts
import { fromDateInput } from '@vuecs/forms';
import type { DateRangeValue } from '@vuecs/forms';
import { computed, ref } from 'vue';

const range = ref<DateRangeValue>({});

const query = computed(() => {
    const filters: Record<string, string> = {};

    const gte = fromDateInput(range.value.from, 'start');
    const lte = fromDateInput(range.value.to, 'end');

    if (gte) filters['created_at[gte]'] = gte;
    if (lte) filters['created_at[lte]'] = lte;

    return filters;
});
// range = { from: '2026-01-01', to: '2026-01-31' } in Europe/Berlin →
// { 'created_at[gte]': '2025-12-31T23:00:00.000Z',
//   'created_at[lte]': '2026-01-31T22:59:59.999Z' }
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `DateRangeValue` | `{}` | `{ from?, to? }` as `YYYY-MM-DD` |
| `presets` | `DateRangePreset[]` | built-in list | Preset buttons; `[]` hides the group |
| `now` | `Date \| (() => Date)` | current time | Reference instant presets resolve against. Without it the preset highlight renders only after mount (see [SSR](#presets)) |
| `fromLabel` | `string` | `'From'` | Label of the start field |
| `toLabel` | `string` | `'To'` | Label of the end field |
| `presetsLabel` | `string` | `'Presets'` | `aria-label` of the preset group |
| `disabled` | `boolean` | `false` | Disables both inputs and every preset |
| `themeClass` | `ThemeClassesOverride` | — | Per-instance class overrides |
| `themeVariant` | `VariantValues` | — | Per-instance variant values |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `DateRangeValue` | One atomic update per user action |

## Behavioral defaults

Labels resolve prop → global default → English fallback, so they can be
localized once via `app.use(vuecs, { defaults: { formDateRange: { … } } })`:

| Key | Fallback |
|-----|----------|
| `fromLabel` | `'From'` |
| `toLabel` | `'To'` |
| `presetsLabel` | `'Presets'` |
| `last7DaysLabel` | `'Last 7 days'` |
| `thisMonthLabel` | `'This month'` |
| `thisYearLabel` | `'This year'` |

The three preset labels apply to the built-in presets only; custom presets
carry their own `label`.

## Theme slots

| Slot | Element |
|------|---------|
| `root` | Outer wrapper |
| `fields` | Wrapper around both fields |
| `field` | One label + input pair |
| `label` | Field `<label>` |
| `presets` | The `role="group"` preset wrapper |
| `preset` | Each preset `<button>` |
| `presetActive` | Added to the preset whose range equals the model |

The inputs themselves use the `formInput` theme element.
