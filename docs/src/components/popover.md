# Popover

Floating panel anchored to a trigger. Built on [Reka UI](https://reka-ui.com/)'s Popover primitives — `floating-ui` powers positioning so the panel flips and shifts to stay on-screen.

```bash
npm install @vuecs/overlays
```

<Demo name="popover" component="VCPopover">
  <template #code>

::: code-group

```vue [Vue]
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
    <VCPopover
        v-for="side in ['top', 'right', 'bottom', 'left'] as const"
        :key="side"
    >
        <VCPopoverTrigger>{{ side }}</VCPopoverTrigger>
        <VCPopoverContent :side="side" :side-offset="8">
            <p class="text-sm font-semibold">{{ side }} popover</p>
            <p class="text-xs text-fg-muted">
                floating-ui flips and shifts to stay on-screen.
            </p>
            <VCPopoverArrow />
            <VCPopoverClose />
        </VCPopoverContent>
    </VCPopover>
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
| `content` | `vc-popover-content` | Floating panel; supports `data-state="open\|closed"` for animation. |
| `arrow` | `vc-popover-arrow` | |
| `close` | `vc-popover-close` | |

## Accessibility

Provided by Reka:
- Click-outside dismiss
- Escape key closes
- Focus trap when `modal: true`
- ARIA `role="dialog"` (popover) with `aria-controls` on the trigger

## Animations

Both `theme-tailwind` and `theme-bootstrap-v5` ship enter and exit animations (fade + zoom-95) via `@vuecs/design`'s vanilla-CSS port of [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css). Tailwind theme uses `data-[state=open]:` / `data-[state=closed]:` variant prefixes; BS5 theme uses the dual-state helper class `vc-overlay-anim`. Reka's `PopoverContent` wraps with `Presence` internally so exit animations actually play before unmount. `prefers-reduced-motion: reduce` disables every animation. Override per-instance via `:theme-class="{ content: '...' }"`.

## API Reference

### `<VCPopover>`

Root component; provides context to nested parts. Wraps `PopoverRoot`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled open state. Use `v-model:open` or pair `:open` with `@update:open`. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `modal` | `boolean` | `false` | Trap focus inside the popover and disable interaction with outside content. Default differs from `<VCModal>` — popovers are usually non-modal. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired on open/close changes. |

### `<VCPopoverTrigger>`

Toggles the popover. Wraps `PopoverTrigger`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'button'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `themeClass` | `Partial<PopoverThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCPopoverContent>`

Floating panel. Bundles `PopoverPortal` + `PopoverContent`. floating-ui handles flip/shift to keep the panel on-screen.

| Prop | Type | Default | Description |
|---|---|---|---|
| `inline` | `boolean` | `false` | Skip the portal and render in-place. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to the trigger. |
| `sideOffset` | `number` | `4` | Distance in pixels between trigger and panel. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the chosen side. |
| `alignOffset` | `number` | `0` | Offset in pixels along the alignment axis. |
| `avoidCollisions` | `boolean` | `true` | Flip / shift to stay inside the viewport. |
| `themeClass` | `Partial<PopoverThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

Reka's extra `PopoverContent` props (`onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside`, etc.) pass through via `attrs`.

### `<VCPopoverArrow>`

Optional pointer arrow that follows the panel's position. Wraps `PopoverArrow`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | `10` | Arrow width in pixels. |
| `height` | `number` | `5` | Arrow height in pixels. |
| `themeClass` | `Partial<PopoverThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCPopoverClose>`

Button that dismisses the popover. Wraps `PopoverClose`. Default content is `×`.

When no slot content is supplied, `<VCPopoverClose>` auto-applies `aria-label="Close"` so screen readers don't announce the bare `×` glyph as "multiplication sign". Pass an explicit `aria-label` via attrs to override, or supply visible text content to drop the auto-label.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'button'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `themeClass` | `Partial<PopoverThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |
