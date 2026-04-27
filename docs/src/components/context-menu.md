# ContextMenu

Right-click-triggered menu. Same shape as DropdownMenu but anchored to the cursor on `contextmenu` events. Built on [Reka UI](https://reka-ui.com/)'s ContextMenu primitives.

```bash
npm install @vuecs/overlays @vuecs/core reka-ui
```

## Compound API

| Component | Wraps | Notes |
|---|---|---|
| `VCContextMenu` | `ContextMenuRoot` | Holds open state. Emits `update:open`. |
| `VCContextMenuTrigger` | `ContextMenuTrigger` | Right-click area. `disabled` to opt out. |
| `VCContextMenuContent` | `ContextMenuPortal` + `ContextMenuContent` | Menu panel anchored to cursor. `inline` skips the portal. |
| `VCContextMenuItem` | `ContextMenuItem` | Single action. Emits `select`. |
| `VCContextMenuLabel` | `ContextMenuLabel` | Section heading. |
| `VCContextMenuSeparator` | `ContextMenuSeparator` | Horizontal divider. |
| `VCContextMenuGroup` | `ContextMenuGroup` | Wrapping group (semantic). |

```vue
<script setup lang="ts">
import {
    VCContextMenu,
    VCContextMenuContent,
    VCContextMenuItem,
    VCContextMenuSeparator,
    VCContextMenuTrigger,
} from '@vuecs/overlays';

const onAction = (key: string) => console.log('action:', key);
</script>

<template>
    <VCContextMenu>
        <VCContextMenuTrigger>
            <div class="rounded-md border border-dashed p-8">
                Right-click me
            </div>
        </VCContextMenuTrigger>
        <VCContextMenuContent>
            <VCContextMenuItem @select="onAction('open')">Open</VCContextMenuItem>
            <VCContextMenuItem @select="onAction('rename')">Rename</VCContextMenuItem>
            <VCContextMenuSeparator />
            <VCContextMenuItem @select="onAction('delete')">Delete</VCContextMenuItem>
        </VCContextMenuContent>
    </VCContextMenu>
</template>
```

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `trigger` | `vc-context-menu-trigger` | |
| `content` | `vc-context-menu-content` | Menu panel; `data-state="open|closed"` for animation. |
| `item` | `vc-context-menu-item` | `data-highlighted` while hovered/focused, `data-disabled` when disabled. |
| `label` | `vc-context-menu-label` | |
| `separator` | `vc-context-menu-separator` | |
| `group` | `vc-context-menu-group` | |

## Accessibility

Same as DropdownMenu — keyboard arrow navigation, typeahead, Escape close, focus restoration. The trigger fires on long-press on touch devices, in addition to right-click on desktop.

## Out of scope (for now)

Same omissions as DropdownMenu — checkbox/radio/sub-menu parts are planned follow-ups.
