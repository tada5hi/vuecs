# Tooltip

Hover/focus-triggered text bubble. Built on [Reka UI](https://reka-ui.com/)'s Tooltip primitives, with `floating-ui` positioning.

```bash
npm install @vuecs/overlays
```

<Demo name="tooltip" component="VCTooltip">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCTooltip,
    VCTooltipArrow,
    VCTooltipContent,
    VCTooltipProvider,
    VCTooltipTrigger,
} from '@vuecs/overlays';
</script>

<template>
    <VCTooltipProvider :delay-duration="200">
        <VCTooltip
            v-for="side in ['top', 'right', 'bottom', 'left'] as const"
            :key="side"
        >
            <VCTooltipTrigger>Hover ({{ side }})</VCTooltipTrigger>
            <VCTooltipContent :side="side" :side-offset="6">
                Tooltip on the {{ side }}
                <VCTooltipArrow />
            </VCTooltipContent>
        </VCTooltip>
    </VCTooltipProvider>
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
| `VCTooltipProvider` | `TooltipProvider` | App-level config (`delayDuration`, `skipDelayDuration`). Wrap once near the app root. |
| `VCTooltip` | `TooltipRoot` | One tooltip instance. Per-instance `delayDuration` overrides the provider. |
| `VCTooltipTrigger` | `TooltipTrigger` | Hover/focus target. |
| `VCTooltipContent` | `TooltipPortal` + `TooltipContent` | Floating bubble. `inline` skips the portal. |
| `VCTooltipArrow` | `TooltipArrow` | Optional pointer arrow. |

```vue
<script setup lang="ts">
import {
    VCTooltip,
    VCTooltipArrow,
    VCTooltipContent,
    VCTooltipProvider,
    VCTooltipTrigger,
} from '@vuecs/overlays';
</script>

<template>
    <VCTooltipProvider :delay-duration="200">
        <VCTooltip>
            <VCTooltipTrigger>Hover me</VCTooltipTrigger>
            <VCTooltipContent side="top" :side-offset="6">
                Helpful hint
                <VCTooltipArrow />
            </VCTooltipContent>
        </VCTooltip>
    </VCTooltipProvider>
</template>
```

For most apps, install `<VCTooltipProvider>` once at the root and wrap individual usages with `<VCTooltip>` / `<VCTooltipTrigger>` / `<VCTooltipContent>`.

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `trigger` | `vc-tooltip-trigger` | |
| `content` | `vc-tooltip-content` | Bubble; supports `data-state="delayed-open|closed"` for animation. |
| `arrow` | `vc-tooltip-arrow` | |

## Accessibility

Provided by Reka:
- Hover + focus-visible open (no open on focus from clicks, per WCAG 2.1)
- Escape key closes
- ARIA `role="tooltip"` linked via `aria-describedby` on the trigger

## API Reference

### `<VCTooltipProvider>`

App-level configuration. Wrap once near the app root (or around a specific subtree) so every nested `<VCTooltip>` shares the same delay and skip-grouping behavior. Wraps `TooltipProvider`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `delayDuration` | `number` | `700` | Milliseconds to wait before opening on hover. Per-tooltip overrides take precedence. |
| `skipDelayDuration` | `number` | `300` | Window after a tooltip closes during which sibling tooltips skip the delay (so a row of icon-buttons feels snappy). |
| `disableHoverableContent` | `boolean` | `false` | Disable hovering-only opens (focus still works). |
| `disableClosingTrigger` | `boolean` | `false` | Don't close the tooltip when the trigger is clicked. |

### `<VCTooltip>`

One tooltip instance. Wraps `TooltipRoot`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state. |
| `delayDuration` | `number \| undefined` | `undefined` | Per-instance delay; overrides the provider value. |
| `disableHoverableContent` | `boolean \| undefined` | `undefined` | Per-instance override. |
| `disableClosingTrigger` | `boolean \| undefined` | `undefined` | Per-instance override. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired on open/close. |

### `<VCTooltipTrigger>`

Hover/focus target. Wraps `TooltipTrigger`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'button'` | HTML tag to render. Buttons are recommended for keyboard accessibility. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `themeClass` | `Partial<TooltipThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCTooltipContent>`

Floating bubble. Bundles `TooltipPortal` + `TooltipContent`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `inline` | `boolean` | `false` | Skip the portal. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side relative to the trigger. |
| `sideOffset` | `number` | `4` | Distance in pixels between trigger and bubble. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the chosen side. |
| `alignOffset` | `number` | `0` | Offset in pixels along the alignment axis. |
| `avoidCollisions` | `boolean` | `true` | Flip / shift to stay inside the viewport. |
| `themeClass` | `Partial<TooltipThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCTooltipArrow>`

Optional pointer arrow. Wraps `TooltipArrow`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | `10` | Arrow width in pixels. |
| `height` | `number` | `5` | Arrow height in pixels. |
| `themeClass` | `Partial<TooltipThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |
