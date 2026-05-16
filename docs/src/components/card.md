# Card

Compound surface for grouping related content into a bounded panel. Six parts — `<VCCard>` outer + optional `<VCCardHeader>` / `<VCCardTitle>` / `<VCCardDescription>` / `<VCCardBody>` / `<VCCardFooter>`. Pure-CSS; no Reka primitive.

Padding lives on the outer `<VCCard>` and propagates to every band via card context — set `padding="compact"` once, every part resizes consistently. Variants (`outline` / `soft` / `elevated`) cover the typical visual ladder.

```bash
npm install @vuecs/elements
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

## Theme keys

| Component | Key | Default class |
|---|---|---|
| `card` | `root` | `vc-card` |
| `cardHeader` | `root` | `vc-card-header` |
| `cardTitle` | `root` | `vc-card-title` |
| `cardDescription` | `root` | `vc-card-description` |
| `cardBody` | `root` | `vc-card-body` |
| `cardFooter` | `root` | `vc-card-footer` |

## Variants opted-into per shipping theme

| Component | Axis | Values |
|---|---|---|
| `card` | `variant` | `outline` / `soft` / `elevated` |
| `card` | `interactive` | `true` / `false` |
| `cardHeader` | `padding` | `compact` / `normal` / `spacious` |
| `cardBody` | `padding` | `compact` / `normal` / `spacious` |
| `cardFooter` | `padding` | `compact` / `normal` / `spacious` |
