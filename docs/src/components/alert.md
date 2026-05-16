# Alert

Persistent banner for page-level warnings, form errors, and inline status. Pure CSS — no Reka primitive needed.

```bash
npm install @vuecs/elements
```

<Playground name="alert" component="VCAlert">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCAlert,
    VCAlertClose,
    VCAlertDescription,
    VCAlertTitle,
} from '@vuecs/elements';
import { ref } from 'vue';

const open = ref(true);
</script>

<template>
    <VCAlert v-model:open="open" color="error">
        <VCAlertTitle>Submission failed</VCAlertTitle>
        <VCAlertDescription>
            The server rejected the form. Check the highlighted fields and try again.
        </VCAlertDescription>
        <VCAlertClose />
    </VCAlert>
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

## Authoring shapes

### Inline shorthand

The simplest usage — default slot doubles as the description when no `<VCAlertTitle>` / `<VCAlertDescription>` are present.

```vue
<VCAlert color="info">All systems operational.</VCAlert>
```

### Title + description compound

For multi-line alerts use the structured parts:

```vue
<VCAlert color="warning">
    <VCAlertTitle>Network unstable</VCAlertTitle>
    <VCAlertDescription>
        Your changes will be saved as soon as the connection recovers.
    </VCAlertDescription>
</VCAlert>
```

### Dismissible

`<VCAlertClose>` reads the parent `<VCAlert v-model:open>` context and flips `open` to `false` on click. Slot-presence smart default mirrors `<VCModalClose>`:

```vue
<script setup lang="ts">
const visible = ref(true);
</script>

<template>
    <VCAlert v-model:open="visible" color="error">
        <VCAlertTitle>Cannot save</VCAlertTitle>
        <!-- slotless → corner-X icon -->
        <VCAlertClose />
    </VCAlert>
</template>
```

### Custom icon

`:icon` accepts any Iconify name and overrides the preset's color-derived default:

```vue
<VCAlert color="info" icon="lucide:wifi">
    Re-connected to the server.
</VCAlert>
```

Pass an empty string (`:icon="''"`) to suppress the icon entirely.

### Dismiss with collapse animation

Compose with [`<VCCollapse>`](/components/collapse) for a height-collapse on dismiss (instead of instant unmount):

```vue
<script setup lang="ts">
const open = ref(true);
</script>

<template>
    <VCCollapse v-model:open="open">
        <VCCollapseContent>
            <VCAlert color="success">
                <VCAlertTitle>Profile updated</VCAlertTitle>
                <VCAlertClose @click="open = false" />
            </VCAlert>
        </VCCollapseContent>
    </VCCollapse>
</template>
```

The click handler flips `open` on `<VCCollapse>` (one frame ahead of `<VCAlert>`'s internal state), Reka's `Presence` then plays the `accordion-up` animation, and the alert unmounts after `animationend`.

## Compound API

| Component | Element default | Role |
|---|---|---|
| `VCAlert` | `<div role="alert\|status">` | Outer container; provides theme + color context |
| `VCAlertTitle` | `<h4>` (configurable `as`) | Heading text |
| `VCAlertDescription` | `<div>` | Body text |
| `VCAlertClose` | `<button>` | Dismiss button — reads parent context to toggle `v-model:open` |

## Theme keys

| Key | Slots | Notes |
|---|---|---|
| `alert` | `root`, `icon`, `content`, `closeIcon`, `close` | `color × variant × size` matrix on `root` (15-cell `compoundVariants`) |
| `alertTitle` | `root` | |
| `alertDescription` | `root` | |

## Icon defaults

`<VCAlert :color>` auto-resolves a leading icon from the active icon preset (see [Icons setup](/getting-started/icons)).

| Color | `@vuecs/icons-lucide` | `@vuecs/icons-font-awesome` |
|---|---|---|
| `info` | `lucide:info` | `fa6-solid:circle-info` |
| `success` | `lucide:circle-check` | `fa6-solid:circle-check` |
| `warning` | `lucide:triangle-alert` | `fa6-solid:triangle-exclamation` |
| `error` | `lucide:circle-x` | `fa6-solid:circle-xmark` |

Override per-app via `defaults`:

```ts
app.use(vuecs, {
    defaults: {
        alert: { errorIcon: 'mdi:alert-octagon' },
    },
});
```

## Accessibility

`<VCAlert>` derives ARIA role from `color`:

| color | role | aria-live |
|---|---|---|
| `error` / `warning` | `alert` | `assertive` (announced immediately) |
| `info` / `success` / `neutral` | `status` | `polite` (announced when AT is idle) |

Override via `<VCAlert role="log">` for custom interaction patterns (e.g. chat logs).

## Distinction from `<VCToast>`

| Concern | `<VCAlert>` | `<VCToast>` |
|---|---|---|
| Lifetime | Permanent until dismissed | Auto-dismisses after duration |
| Placement | Inline in document flow | Fixed-position viewport |
| Queue | None — one per markup site | Managed by `useToast()` |
| Use case | Form errors, page warnings | Transient action feedback |

## API Reference

### `<VCAlert>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` | `undefined` | Folded into `themeVariant`; auto-resolves the icon + ARIA role. |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `undefined` | Folded into `themeVariant`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `undefined` | Folded into `themeVariant`. |
| `icon` | `string` | `undefined` (preset default for `color`) | Iconify name. Pass `''` to suppress. |
| `role` | `string` | derived from `color` | ARIA role override. |
| `open` | `boolean \| undefined` | `undefined` | Controlled visibility; bind via `v-model:open`. |
| `defaultOpen` | `boolean` | `true` | Initial visibility when `open` is undefined. |
| `as` | `string` | `'div'` | HTML tag to render. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired when `<VCAlertClose>` dismisses. |

### `<VCAlertClose>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `boolean` | `false` | Force corner-X presentation. Slot-presence smart default decides otherwise. |
| `as` | `string` | `'button'` | HTML tag to render. |

| Emit | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Fired on click. Call `event.preventDefault()` to suppress the auto-`setOpen(false)` behavior. |
