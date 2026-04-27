# ContextMenu

Right-click-triggered menu. Same shape as DropdownMenu but anchored to the cursor on `contextmenu` events. Built on [Reka UI](https://reka-ui.com/)'s ContextMenu primitives.

```bash
npm install @vuecs/overlays
```

<Demo name="context-menu" component="VCContextMenu">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCContextMenu,
    VCContextMenuContent,
    VCContextMenuItem,
    VCContextMenuLabel,
    VCContextMenuSeparator,
    VCContextMenuTrigger,
} from '@vuecs/overlays';
import { ref } from 'vue';

const lastAction = ref<string>('—');
</script>

<template>
    <VCContextMenu>
        <VCContextMenuTrigger>
            <div class="rounded-md border-2 border-dashed p-8">
                Right-click me
            </div>
        </VCContextMenuTrigger>
        <VCContextMenuContent>
            <VCContextMenuLabel>Item options</VCContextMenuLabel>
            <VCContextMenuItem @select="lastAction = 'open'">Open</VCContextMenuItem>
            <VCContextMenuItem @select="lastAction = 'rename'">Rename</VCContextMenuItem>
            <VCContextMenuItem @select="lastAction = 'duplicate'">Duplicate</VCContextMenuItem>
            <VCContextMenuSeparator />
            <VCContextMenuItem @select="lastAction = 'delete'">Delete</VCContextMenuItem>
        </VCContextMenuContent>
    </VCContextMenu>
    <p>Last action: {{ lastAction }}</p>
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

## Extras

Same shape as [DropdownMenu](/components/dropdown-menu) — `VCContextMenuCheckboxItem`, `VCContextMenuRadioGroup` / `VCContextMenuRadioItem`, `VCContextMenuItemIndicator`, and `VCContextMenuSub` / `VCContextMenuSubTrigger` / `VCContextMenuSubContent` are all available with the same prop / event / theme-key shape (just `vc-context-menu-*` instead of `vc-dropdown-*`).

## API Reference

### `<VCContextMenu>`

Root component. Wraps `ContextMenuRoot`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `modal` | `boolean` | `true` | Block interaction with content outside while open. |
| `dir` | `'ltr' \| 'rtl' \| undefined` | `undefined` | Reading direction. Falls back to the inherited `useConfig('dir')` value. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired on open/close. |

::: tip No `open` prop
ContextMenu has no `open` / `defaultOpen` prop because Reka triggers it from `contextmenu` events on `<VCContextMenuTrigger>`. Use `update:open` to observe the state.
:::

### `<VCContextMenuTrigger>`

Right-click area. Wraps `ContextMenuTrigger`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'span'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `disabled` | `boolean` | `false` | Don't open the menu on right-click. |
| `themeClass` | `Partial<ContextMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCContextMenuContent>`

Floating menu panel anchored to the cursor. Bundles `ContextMenuPortal` + `ContextMenuContent`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `inline` | `boolean` | `false` | Skip the portal. |
| `loop` | `boolean` | `true` | Wrap arrow-key focus from last item back to first. |
| `avoidCollisions` | `boolean` | `true` | Flip / shift to stay inside the viewport. |
| `themeClass` | `Partial<ContextMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCContextMenuItem>` / `Label` / `Separator` / `Group` / `CheckboxItem` / `RadioGroup` / `RadioItem` / `ItemIndicator` / `Sub` / `SubTrigger` / `SubContent`

Identical prop, event, and slot shape to the matching `VCDropdownMenu*` parts — see the [DropdownMenu API Reference](/components/dropdown-menu#api-reference).

The only differences are:

- The component prefix is `VCContextMenu*` instead of `VCDropdownMenu*`
- Theme keys live under the `contextMenu` element (default classes use `vc-context-menu-*` instead of `vc-dropdown-*`)
- The Reka primitive each part wraps is `ContextMenu*` instead of `DropdownMenu*`
