# Placeholder

`@vuecs/placeholder` ships the two **primitive** skeleton components —
the single animated bar and the loading-state wrapper. Composite
skeletons that mirror real components live next to those components:

- [`<VCCardPlaceholder>`](./card.md#card-placeholder-skeleton) in `@vuecs/elements`
- [`<VCTablePlaceholder>`](./table.md#table-placeholder-skeleton) in `@vuecs/table`

<Playground name="placeholder">
  <template #code>

```vue
<script setup>
import { VCPlaceholder, VCPlaceholderWrapper } from '@vuecs/placeholder';
import { VCCardPlaceholder } from '@vuecs/elements';
import { VCTablePlaceholder } from '@vuecs/table';
import { ref } from 'vue';

const loading = ref(true);
</script>

<template>
    <!-- Single bar — the primitive. -->
    <VCPlaceholder width="60%" size="lg" />

    <!-- Circle skeleton — for avatars (paired with a fixed width). -->
    <VCPlaceholder shape="circle" width="40px" />

    <!-- Pill — for buttons / badges. -->
    <VCPlaceholder shape="pill" width="80px" size="lg" />

    <!-- Table-shaped skeleton (composite — @vuecs/table). -->
    <VCTablePlaceholder :rows="5" :columns="4" />

    <!-- Card-shaped skeleton (composite — @vuecs/elements). -->
    <VCCardPlaceholder />

    <!-- Conditional wrapper — swap skeleton vs real content. -->
    <VCPlaceholderWrapper :loading="loading">
        <template #loading>
            <VCTablePlaceholder :rows="3" :columns="4" />
        </template>
        <template #default>
            <RealContent />
        </template>
    </VCPlaceholderWrapper>
</template>
```

  </template>
</Playground>

## Components

### `<VCPlaceholder>`

Single animated bar — the building block.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `string \| number` | `'100%'` | Width — CSS length (`'12rem'`) or number interpreted as percentage (`60` → `'60%'`). Negative numbers clamp to `0`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size tier — drives the bar height via the `size` theme variant. |
| `shape` | `'rect' \| 'pill' \| 'circle'` | `'rect'` | Bar shape. `pill` rounds the ends (button / badge skeletons); `circle` forces 1:1 aspect (avatar skeletons — pair with a fixed `:width`). |
| `animation` | `'wave' \| 'glow' \| 'none'` | `'wave'` | Shimmer animation. `none` disables the animation (e.g. for reduced-motion callers). |
| `duration` | `string` | `undefined` | Override the shimmer duration (`'500ms'`, `'4s'`). Defaults to the theme's value (typically `2s`). |
| `tag` | `string` | `'span'` | Element to render as. |

### `<VCPlaceholderWrapper>`

Conditional wrapper — renders `#loading` when `:loading` is true,
`#default` otherwise. Mirrors `aria-busy` + `role="status"` +
`aria-live="polite"` to the wrapper for assistive-tech loading
announcements (W3C "Loading content" pattern).

```vue
<VCPlaceholderWrapper :loading="busy">
    <template #loading>
        <VCTablePlaceholder :rows="5" :columns="7" />
    </template>
    <template #default>
        <RealContent />
    </template>
</VCPlaceholderWrapper>
```

### Composite skeletons (live in neighbour packages)

- **`<VCCardPlaceholder>`** — card-shaped skeleton (image / header /
  body lines / footer). Lives in `@vuecs/elements` next to `<VCCard>`.
  See the [Card docs](./card.md#card-placeholder-skeleton).
- **`<VCTablePlaceholder>`** — table-shaped skeleton with optional
  header / footer + customisable rows / columns. Lives in
  `@vuecs/table` next to `<VCTable>`. See the
  [Table docs](./table.md#table-placeholder-skeleton).

Both compose `<VCPlaceholder>` per cell / section — the `:animation`
prop flows through, so the reduced-motion handling at the bar level
applies to the composites too.

## Animation modes

- **`wave`** — moving-gradient sweep (Facebook / LinkedIn pattern). Default.
- **`glow`** — opacity pulse (Bootstrap 5 default).
- **`none`** — animation disabled. Use this for consumers running their own animation, or for explicit reduced-motion handling.

The shipped `assets/index.css` also respects
`prefers-reduced-motion: reduce` automatically — both wave + glow
disable themselves under that preference without needing the consumer
to pass `animation="none"`.

## Theme keys

| Component | Slot keys |
|---|---|
| `placeholder` | `root`, `wave`, `glow` |
| `placeholderWrapper` | `root` |

(`cardPlaceholder` lives under `@vuecs/elements`;
`tablePlaceholder` under `@vuecs/table`.)

## Standalone

The package ships its own minimal structural CSS — `<VCPlaceholder>`
renders visibly even without any theme installed. Themes layer their
visual styling (colors, radii, fine-tuned animation) on top.

```ts
// Without a theme — works out of the box.
import placeholder from '@vuecs/placeholder';
app.use(placeholder);
```

```css
/* Ensure the structural CSS loads. */
@import "@vuecs/placeholder";
```
