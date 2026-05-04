# HoverCard

Floating panel that opens on hover, with a built-in grace area for the cursor traveling between the trigger and the content. Built on [Reka UI](https://reka-ui.com/)'s `HoverCard` primitives.

`<VCHoverCard>` is for hover-triggered previews (mention chips, profile cards, glossary pop-ups). For click-triggered floating panels use [`<VCPopover>`](/components/popover); for hover-triggered short text use [`<VCTooltip>`](/components/tooltip).

```bash
npm install @vuecs/overlays
```

<Demo name="hover-card" component="VCHoverCard">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCHoverCard,
    VCHoverCardArrow,
    VCHoverCardContent,
    VCHoverCardTrigger,
} from '@vuecs/overlays';
</script>

<template>
    <p>
        Built by
        <VCHoverCard>
            <VCHoverCardTrigger as="a" href="#">@octocat</VCHoverCardTrigger>
            <VCHoverCardContent :side-offset="8">
                <p class="font-semibold">@octocat</p>
                <p class="text-xs text-fg-muted">
                    The mascot of GitHub. Joined in 2008.
                </p>
                <VCHoverCardArrow />
            </VCHoverCardContent>
        </VCHoverCard>
    </p>
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

## Compound API

| Component | Wraps | Notes |
|---|---|---|
| `VCHoverCard` | `HoverCardRoot` | Holds open state. v-models `open`. Configures `openDelay` / `closeDelay`. |
| `VCHoverCardTrigger` | `HoverCardTrigger` | Anchor element. Defaults to `as="a"` because hover-card triggers are typically links. |
| `VCHoverCardContent` | `HoverCardPortal` + `HoverCardContent` | Floating panel. `inline` skips the portal. Position via `side` / `sideOffset` / `align` / `alignOffset` / `avoidCollisions`. |
| `VCHoverCardArrow` | `HoverCardArrow` | Optional pointer arrow. |

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `trigger` | `vc-hover-card-trigger` | |
| `content` | `vc-hover-card-content` | Floating panel; supports `data-state="open\|closed"` for animation. |
| `arrow` | `vc-hover-card-arrow` | |

## API Reference

### `<VCHoverCard>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `openDelay` | `number` | `700` | Delay (ms) from pointer-enter to opening. |
| `closeDelay` | `number` | `300` | Delay (ms) from pointer-leave to closing — covers grace-area travel between trigger and content. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired on open / close changes. |

### `<VCHoverCardTrigger>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'a'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |

### `<VCHoverCardContent>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `inline` | `boolean` | `false` | Skip the portal and render in-place. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to the trigger. |
| `sideOffset` | `number` | `4` | Distance in pixels between trigger and panel. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the chosen side. |
| `alignOffset` | `number` | `0` | Offset in pixels along the alignment axis. |
| `avoidCollisions` | `boolean` | `true` | Flip / shift to stay inside the viewport. |

### `<VCHoverCardArrow>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | `10` | Arrow width in pixels. |
| `height` | `number` | `5` | Arrow height in pixels. |
