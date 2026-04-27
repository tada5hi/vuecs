# DropdownMenu

Click-triggered menu of actions. Built on [Reka UI](https://reka-ui.com/)'s DropdownMenu primitives — keyboard-navigable, typeahead-aware, with focus management out of the box.

```bash
npm install @vuecs/overlays
```

<Demo name="dropdown-menu" component="VCDropdownMenu">
  <template #code>

::: code-group

```vue [Vue]
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
import { ref } from 'vue';

const lastAction = ref<string>('—');
</script>

<template>
    <VCDropdownMenu>
        <VCDropdownMenuTrigger>Actions ▾</VCDropdownMenuTrigger>
        <VCDropdownMenuContent>
            <VCDropdownMenuLabel>Manage</VCDropdownMenuLabel>
            <VCDropdownMenuGroup>
                <VCDropdownMenuItem @select="lastAction = 'edit'">Edit</VCDropdownMenuItem>
                <VCDropdownMenuItem @select="lastAction = 'duplicate'">Duplicate</VCDropdownMenuItem>
                <VCDropdownMenuItem @select="lastAction = 'share'">Share</VCDropdownMenuItem>
            </VCDropdownMenuGroup>
            <VCDropdownMenuSeparator />
            <VCDropdownMenuItem @select="lastAction = 'archive'">Archive</VCDropdownMenuItem>
            <VCDropdownMenuItem @select="lastAction = 'delete'">Delete</VCDropdownMenuItem>
        </VCDropdownMenuContent>
    </VCDropdownMenu>
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
| `VCDropdownMenu` | `DropdownMenuRoot` | Holds open state. v-models `open`. |
| `VCDropdownMenuTrigger` | `DropdownMenuTrigger` | Button that opens the menu. |
| `VCDropdownMenuContent` | `DropdownMenuPortal` + `DropdownMenuContent` | Menu panel. Position via `side` / `align`. `loop` controls keyboard wrap (default `true`). |
| `VCDropdownMenuItem` | `DropdownMenuItem` | Single action. Emits `select`. |
| `VCDropdownMenuCheckboxItem` | `DropdownMenuCheckboxItem` | Toggleable item. v-models `modelValue` (`true` / `false` / `'indeterminate'`). |
| `VCDropdownMenuRadioGroup` | `DropdownMenuRadioGroup` | Wraps a group of `VCDropdownMenuRadioItem`. v-models `modelValue` (the selected `value`). |
| `VCDropdownMenuRadioItem` | `DropdownMenuRadioItem` | One radio choice; takes a required `value`. |
| `VCDropdownMenuItemIndicator` | `DropdownMenuItemIndicator` | Renders inside `CheckboxItem` / `RadioItem` only when checked. Default content is `✓`. |
| `VCDropdownMenuLabel` | `DropdownMenuLabel` | Section heading. |
| `VCDropdownMenuSeparator` | `DropdownMenuSeparator` | Horizontal divider. |
| `VCDropdownMenuGroup` | `DropdownMenuGroup` | Wrapping group (semantic). |
| `VCDropdownMenuSub` | `DropdownMenuSub` | Nested-menu root; v-models `open`. |
| `VCDropdownMenuSubTrigger` | `DropdownMenuSubTrigger` | Item that opens a nested menu (renders inside the parent `Content`). |
| `VCDropdownMenuSubContent` | `DropdownMenuPortal` + `DropdownMenuSubContent` | Nested-menu panel. |
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

## Theme keys for extras

| Key | Default class | Notes |
|---|---|---|
| `checkboxItem` | `vc-dropdown-checkbox-item` | Wider left padding to leave room for the indicator. |
| `radioItem` | `vc-dropdown-radio-item` | Same shape as `checkboxItem`. |
| `radioGroup` | `vc-dropdown-radio-group` | Wrapping group (semantic). |
| `itemIndicator` | `vc-dropdown-item-indicator` | Absolute-positioned indicator inside `checkboxItem`/`radioItem`. |
| `subTrigger` | `vc-dropdown-sub-trigger` | Item that opens a nested menu; gets `data-state="open"` while open. |
| `subContent` | `vc-dropdown-sub-content` | Nested-menu panel; same `data-state` animation hooks as `content`. |

## API Reference

### `<VCDropdownMenu>`

Root component. Wraps `DropdownMenuRoot`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `modal` | `boolean` | `true` | Block interaction with content outside the menu while open. |
| `dir` | `'ltr' \| 'rtl' \| undefined` | `undefined` | Reading direction. Falls back to the inherited `useConfig('dir')` value. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired on open/close. |

### `<VCDropdownMenuTrigger>`

Toggles the menu. Wraps `DropdownMenuTrigger`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'button'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCDropdownMenuContent>`

Floating menu panel. Bundles `DropdownMenuPortal` + `DropdownMenuContent`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `inline` | `boolean` | `false` | Skip the portal. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to the trigger. |
| `sideOffset` | `number` | `4` | Distance in pixels between trigger and panel. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along the chosen side. |
| `alignOffset` | `number` | `0` | Offset in pixels along the alignment axis. |
| `avoidCollisions` | `boolean` | `true` | Flip / shift to stay inside the viewport. |
| `loop` | `boolean` | `true` | Wrap arrow-key focus from last item back to first. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCDropdownMenuItem>`

Single menu entry. Wraps `DropdownMenuItem`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'div'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `disabled` | `boolean` | `false` | Mark the item as disabled (skipped by keyboard navigation). |
| `textValue` | `string \| undefined` | `undefined` | Override the typeahead match text (defaults to the item's textContent). |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

| Emit | Payload | Description |
|---|---|---|
| `select` | `Event` | Fired when the item is activated (click or Enter). Call `event.preventDefault()` to keep the menu open. |

### `<VCDropdownMenuCheckboxItem>`

Toggleable item. Wraps `DropdownMenuCheckboxItem`. Render `<VCDropdownMenuItemIndicator>` inside to show the check.

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean \| 'indeterminate' \| undefined` | `undefined` | Current checked state. Use `v-model` to bind. |
| `disabled` | `boolean` | `false` | Disabled flag. |
| `textValue` | `string \| undefined` | `undefined` | Override the typeahead match text. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

| Emit | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Fired on toggle. |
| `select` | `Event` | Fired when activated. Call `event.preventDefault()` to keep the menu open. |

### `<VCDropdownMenuRadioGroup>`

Wraps a group of `<VCDropdownMenuRadioItem>` and tracks the selected `value`. Wraps `DropdownMenuRadioGroup`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| undefined` | `undefined` | Selected value. Use `v-model` to bind. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

| Emit | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` | Fired when a radio item is selected. |

### `<VCDropdownMenuRadioItem>`

One radio choice inside a `<VCDropdownMenuRadioGroup>`. Wraps `DropdownMenuRadioItem`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — *(required)* | Value emitted to the parent group when selected. |
| `disabled` | `boolean` | `false` | Disabled flag. |
| `textValue` | `string \| undefined` | `undefined` | Override the typeahead match text. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

| Emit | Payload | Description |
|---|---|---|
| `select` | `Event` | Fired when activated. |

### `<VCDropdownMenuItemIndicator>`

Renders inside `<VCDropdownMenuCheckboxItem>` / `<VCDropdownMenuRadioItem>` only when checked / selected. Default content is `✓`. Wraps `DropdownMenuItemIndicator`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `forceMount` | `boolean` | `false` | Render even when not checked (useful for animation lifecycle). |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCDropdownMenuLabel>`

Non-interactive section heading. Wraps `DropdownMenuLabel`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'div'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCDropdownMenuSeparator>`

Horizontal divider between items. Wraps `DropdownMenuSeparator`. No props beyond the theme overrides.

### `<VCDropdownMenuGroup>`

Semantic wrapping group (renders a `<div role="group">`). Wraps `DropdownMenuGroup`. No props beyond the theme overrides.

### `<VCDropdownMenuSub>`

Nested-menu root. Wraps `DropdownMenuSub`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired on open/close. |

### `<VCDropdownMenuSubTrigger>`

Menu item that opens a nested menu when activated. Renders inside the parent `Content`. Wraps `DropdownMenuSubTrigger`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'div'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `disabled` | `boolean` | `false` | Disabled flag. |
| `textValue` | `string \| undefined` | `undefined` | Override the typeahead match text. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCDropdownMenuSubContent>`

Nested-menu panel. Bundles `DropdownMenuPortal` + `DropdownMenuSubContent`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `inline` | `boolean` | `false` | Skip the portal. |
| `sideOffset` | `number` | `0` | Distance in pixels between sub-trigger and sub-panel. |
| `alignOffset` | `number` | `0` | Offset in pixels along the alignment axis. |
| `avoidCollisions` | `boolean` | `true` | Flip / shift to stay inside the viewport. |
| `loop` | `boolean` | `true` | Wrap arrow-key focus inside the sub-menu. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCDropdownMenuArrow>`

Optional pointer arrow following the menu's anchor. Wraps `DropdownMenuArrow`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | `10` | Arrow width in pixels. |
| `height` | `number` | `5` | Arrow height in pixels. |
| `themeClass` | `Partial<DropdownMenuThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |
