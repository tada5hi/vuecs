# Tooltip

Hover/focus-triggered text bubble. Built on [Reka UI](https://reka-ui.com/)'s Tooltip primitives, with `floating-ui` positioning.

```bash
npm install @vuecs/overlays @vuecs/core reka-ui
```

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
