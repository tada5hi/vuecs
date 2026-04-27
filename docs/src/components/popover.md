# Popover

Floating panel anchored to a trigger. Built on [Reka UI](https://reka-ui.com/)'s Popover primitives — `floating-ui` powers positioning so the panel flips and shifts to stay on-screen.

```bash
npm install @vuecs/overlays @vuecs/core reka-ui
```

## Compound API

| Component | Wraps | Notes |
|---|---|---|
| `VCPopover` | `PopoverRoot` | Holds open state. v-models `open`. Pass `modal: true` for focus-trap behavior. |
| `VCPopoverTrigger` | `PopoverTrigger` | Toggles open. |
| `VCPopoverContent` | `PopoverPortal` + `PopoverContent` | Floating panel. `inline` skips the portal. Position via `side` / `sideOffset` / `align` / `alignOffset` / `avoidCollisions`. |
| `VCPopoverArrow` | `PopoverArrow` | Optional pointer arrow. |
| `VCPopoverClose` | `PopoverClose` | Close button. |

```vue
<script setup lang="ts">
import {
    VCPopover,
    VCPopoverArrow,
    VCPopoverClose,
    VCPopoverContent,
    VCPopoverTrigger,
} from '@vuecs/overlays';
</script>

<template>
    <VCPopover>
        <VCPopoverTrigger>Open</VCPopoverTrigger>
        <VCPopoverContent side="bottom" :side-offset="8">
            <p class="text-sm">Hello from a popover</p>
            <VCPopoverArrow />
            <VCPopoverClose />
        </VCPopoverContent>
    </VCPopover>
</template>
```

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `trigger` | `vc-popover-trigger` | |
| `content` | `vc-popover-content` | Floating panel; supports `data-state="open|closed"` for animation. |
| `arrow` | `vc-popover-arrow` | |
| `close` | `vc-popover-close` | |

## Accessibility

Provided by Reka:
- Click-outside dismiss
- Escape key closes
- Focus trap when `modal: true`
- ARIA `role="dialog"` (popover) with `aria-controls` on the trigger
