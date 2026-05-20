# Card

Compound surface for grouping related content into a bounded panel. Six parts — `<VCCard>` outer + optional `<VCCardHeader>` / `<VCCardTitle>` / `<VCCardDescription>` / `<VCCardBody>` / `<VCCardFooter>`. Pure-CSS surface; each part wraps `reka-ui`'s `Primitive` so `:as-child` works on every part for render-as-link cases.

Padding lives on the outer `<VCCard>` and propagates to every band via card context — set `padding="compact"` once, every part resizes consistently. Variants (`outline` / `soft` / `elevated`) cover the typical visual ladder.

```bash
npm install @vuecs/elements @vuecs/button
```

<Playground name="card">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCCard,
    VCCardBody,
    VCCardDescription,
    VCCardFooter,
    VCCardHeader,
    VCCardTitle,
} from '@vuecs/elements';
import { VCButton } from '@vuecs/button';
</script>

<template>
    <VCCard variant="outline" padding="normal">
        <VCCardHeader>
            <VCCardTitle>User profile</VCCardTitle>
            <VCCardDescription>Manage your account settings.</VCCardDescription>
        </VCCardHeader>
        <VCCardBody>
            <!-- content -->
        </VCCardBody>
        <VCCardFooter>
            <VCButton variant="ghost">Cancel</VCButton>
            <VCButton color="primary">Save</VCButton>
        </VCCardFooter>
    </VCCard>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/elements";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Render-as-link pattern

Use `:as-child` to render `<VCCard>` (or any part) as a passed slot child. Combined with `interactive`, the whole card becomes a focusable link with hover + focus rings.

```vue
<VCCard as-child interactive>
    <NuxtLink :to="`/users/${user.id}`">
        <VCCardBody>
            <VCCardTitle>{{ user.name }}</VCCardTitle>
            <VCCardDescription>{{ user.email }}</VCCardDescription>
        </VCCardBody>
    </NuxtLink>
</VCCard>
```

## `<VCCard>` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'outline' \| 'soft' \| 'elevated'` | `'outline'` (theme default) | Visual treatment — border vs tinted fill vs shadow. |
| `padding` | `'compact' \| 'normal' \| 'spacious'` | `'normal'` | Inner padding scale; propagates to every band via context. |
| `interactive` | `boolean` | `false` | Adds hover + focus-within rings, suitable for link-cards. |
| `as` | `string` | `'div'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render the consumer's slot child as the root (Reka `asChild` pattern). |
| `themeClass` | `Partial<CardThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

## Child-part props

`<VCCardHeader>` / `<VCCardTitle>` / `<VCCardDescription>` / `<VCCardBody>` / `<VCCardFooter>` all share the same prop surface:

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | varies — `header`, `h3`, `p`, `div`, `footer` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render the consumer's slot child as the root. |
| `themeClass` | `Partial<*ThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values; merged onto card context. |

## Card-placeholder skeleton

`<VCCardPlaceholder>` is the card-shaped loading skeleton — image +
header line + body lines + footer block. Each section is
independently togglable via `:no-*` props. Composes
`<VCPlaceholder>` from `@vuecs/placeholder` per section, so the
`:animation` prop flows through and reduced-motion handling at the
bar level applies here too.

```vue
<script setup>
import { VCCardPlaceholder } from '@vuecs/elements';
</script>

<template>
    <VCCardPlaceholder :body-lines="3" animation="wave" />

    <!-- Skip cover + footer; show only header + body. -->
    <VCCardPlaceholder no-img no-footer />
</template>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `noImg` | `boolean` | `false` | Skip the cover-image placeholder. |
| `noHeader` | `boolean` | `false` | Skip the header line. |
| `noFooter` | `boolean` | `false` | Skip the footer block. |
| `imgHeight` | `string` | `'180px'` | Cover-image placeholder height. |
| `bodyLines` | `number` | `3` | Number of body lines below the header. |
| `animation` | `'wave' \| 'glow' \| 'none'` | `'wave'` | Forwarded to every inner bar. |

## Theme keys

| Component | Key | Default class |
|---|---|---|
| `card` | `root` | `vc-card` |
| `cardHeader` | `root` | `vc-card-header` |
| `cardTitle` | `root` | `vc-card-title` |
| `cardDescription` | `root` | `vc-card-description` |
| `cardBody` | `root` | `vc-card-body` |
| `cardFooter` | `root` | `vc-card-footer` |
| `cardPlaceholder` | `root` / `image` / `header` / `body` / `footer` | `vc-card-placeholder-*` |

## Variants opted-into per shipping theme

| Component | Axis | Values |
|---|---|---|
| `card` | `variant` | `outline` / `soft` / `elevated` |
| `card` | `interactive` | `true` / `false` |
| `cardHeader` | `padding` | `compact` / `normal` / `spacious` |
| `cardBody` | `padding` | `compact` / `normal` / `spacious` |
| `cardFooter` | `padding` | `compact` / `normal` / `spacious` |
