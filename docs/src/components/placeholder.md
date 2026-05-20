# Placeholder

Skeleton / placeholder loading components. Show animated shapes while
content is loading — the "Twitter / Facebook shimmer" pattern.

<Playground name="placeholder">
  <template #code>

```vue
<script setup>
import {
    VCPlaceholder,
    VCPlaceholderCard,
    VCPlaceholderTable,
    VCPlaceholderWrapper,
} from '@vuecs/placeholder';
import { ref } from 'vue';

const loading = ref(true);
</script>

<template>
    <!-- Single bar — building block. -->
    <VCPlaceholder width="60%" size="lg" />

    <!-- Circle skeleton — for avatars. -->
    <VCPlaceholder shape="circle" width="40px" />

    <!-- Pill — for buttons / badges. -->
    <VCPlaceholder shape="pill" width="80px" size="lg" />

    <!-- Table-shaped skeleton. -->
    <VCPlaceholderTable :rows="5" :columns="4" />

    <!-- Card-shaped skeleton (image + header + body + footer). -->
    <VCPlaceholderCard />

    <!-- Conditional wrapper — swap skeleton vs real content. -->
    <VCPlaceholderWrapper :loading="loading">
        <template #loading>
            <VCPlaceholderTable :rows="3" :columns="4" />
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

### `<VCPlaceholderTable>`

Table-shaped skeleton. `rows × columns` placeholder bars in a real
`<table>` element. Cell widths vary per index so the result looks
natural rather than a uniform grid.

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` | `number` | `5` | Body row count. |
| `columns` | `number` | `4` | Column count. |
| `showHeader` | `boolean` | `true` | Render `<thead>` band. |
| `showFooter` | `boolean` | `false` | Render `<tfoot>` band. |
| `animation` | `'wave' \| 'glow' \| 'none'` | `'wave'` | Forwarded to every inner bar. |

### `<VCPlaceholderCard>`

Card-shaped skeleton — image + header + body lines + footer block.

| Prop | Type | Default | Description |
|---|---|---|---|
| `noImg` | `boolean` | `false` | Skip the cover-image placeholder. |
| `noHeader` | `boolean` | `false` | Skip the header line. |
| `noFooter` | `boolean` | `false` | Skip the footer block. |
| `imgHeight` | `string` | `'180px'` | Cover-image placeholder height. |
| `bodyLines` | `number` | `3` | Number of body lines below the header. |
| `animation` | `'wave' \| 'glow' \| 'none'` | `'wave'` | Forwarded to every inner bar. |

### `<VCPlaceholderWrapper>`

Conditional wrapper — renders `#loading` when `:loading` is true,
`#default` otherwise. Mirrors `aria-busy` to the wrapper for
assistive-tech announcements.

```vue
<VCPlaceholderWrapper :loading="busy">
    <template #loading>
        <VCPlaceholderTable :rows="5" :columns="7" />
    </template>
    <template #default>
        <RealContent />
    </template>
</VCPlaceholderWrapper>
```

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
| `placeholderTable` | `root`, `header`, `body`, `footer`, `row`, `cell` |
| `placeholderCard` | `root`, `image`, `header`, `body`, `footer` |
| `placeholderWrapper` | `root` |

## Standalone

The package ships its own minimal structural CSS — `<VCPlaceholder>`
and friends render visibly even without any theme installed. Themes
layer their visual styling (colors, radii, fine-tuned animation) on
top.

```ts
// Without a theme — works out of the box.
import placeholder from '@vuecs/placeholder';
app.use(placeholder);
```

```css
/* Ensure the structural CSS loads. */
@import "@vuecs/placeholder";
```
