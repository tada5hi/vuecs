# DropdownMenu

Click-triggered menu of actions. Built on [Reka UI](https://reka-ui.com/)'s DropdownMenu primitives — keyboard-navigable, typeahead-aware, with focus management out of the box.

```bash
npm install @vuecs/overlays @vuecs/core reka-ui
```

## Compound API

| Component | Wraps | Notes |
|---|---|---|
| `VCDropdownMenu` | `DropdownMenuRoot` | Holds open state. v-models `open`. |
| `VCDropdownMenuTrigger` | `DropdownMenuTrigger` | Button that opens the menu. |
| `VCDropdownMenuContent` | `DropdownMenuPortal` + `DropdownMenuContent` | Menu panel. Position via `side` / `align`. `loop` controls keyboard wrap (default `true`). |
| `VCDropdownMenuItem` | `DropdownMenuItem` | Single action. Emits `select`. |
| `VCDropdownMenuLabel` | `DropdownMenuLabel` | Section heading. |
| `VCDropdownMenuSeparator` | `DropdownMenuSeparator` | Horizontal divider. |
| `VCDropdownMenuGroup` | `DropdownMenuGroup` | Wrapping group (semantic). |
| `VCDropdownMenuArrow` | `DropdownMenuArrow` | Optional pointer arrow. |

```vue
<script setup lang="ts">
import {
    VCDropdownMenu,
    VCDropdownMenuContent,
    VCDropdownMenuGroup,
    VCDropdownMenuItem,
    VCDropdownMenuLabel,
    VCDropdownMenuSeparator,
    VCDropdownMenuTrigger,
} from '@vuecs/overlays';

const onAction = (key: string) => console.log('action:', key);
</script>

<template>
    <VCDropdownMenu>
        <VCDropdownMenuTrigger>Actions</VCDropdownMenuTrigger>
        <VCDropdownMenuContent>
            <VCDropdownMenuLabel>Manage</VCDropdownMenuLabel>
            <VCDropdownMenuGroup>
                <VCDropdownMenuItem @select="onAction('edit')">Edit</VCDropdownMenuItem>
                <VCDropdownMenuItem @select="onAction('share')">Share</VCDropdownMenuItem>
            </VCDropdownMenuGroup>
            <VCDropdownMenuSeparator />
            <VCDropdownMenuItem @select="onAction('delete')">Delete</VCDropdownMenuItem>
        </VCDropdownMenuContent>
    </VCDropdownMenu>
</template>
```

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `trigger` | `vc-dropdown-trigger` | |
| `content` | `vc-dropdown-content` | Menu panel; `data-state="open|closed"` for animation. |
| `item` | `vc-dropdown-item` | Single entry; `data-highlighted` while hovered/focused, `data-disabled` when disabled. |
| `label` | `vc-dropdown-label` | |
| `separator` | `vc-dropdown-separator` | |
| `group` | `vc-dropdown-group` | |
| `arrow` | `vc-dropdown-arrow` | |

## Accessibility

Provided by Reka:
- Arrow-key navigation between items, with `loop` wrap support
- Typeahead — letters jump to the next item starting with that character
- Escape closes; click-outside dismisses
- Focus returns to the trigger on close
- ARIA `role="menu"` / `role="menuitem"` with `aria-orientation`

## Out of scope (for now)

The first ship covers the core parts. Missing extras (likely follow-ups):

- `VCDropdownMenuCheckboxItem` / `VCDropdownMenuRadioItem` / `VCDropdownMenuRadioGroup`
- `VCDropdownMenuSub` / `VCDropdownMenuSubTrigger` / `VCDropdownMenuSubContent`
- `VCDropdownMenuItemIndicator`
