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
    <VCAlert v-if="open" color="error">
        <VCAlertTitle>Submission failed</VCAlertTitle>
        <VCAlertDescription>
            The server rejected the form. Check the highlighted fields and try again.
        </VCAlertDescription>
        <VCAlertClose @click="open = false" />
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

`<VCAlertClose>` is presentational — it emits `click` only. Wire the click to whichever ref controls visibility. For instant dismissal use `v-if`:

```vue
<script setup lang="ts">
const visible = ref(true);
</script>

<template>
    <VCAlert v-if="visible" color="error">
        <VCAlertTitle>Cannot save</VCAlertTitle>
        <!-- slotless → corner-X icon via the theme's `closeIcon` slot -->
        <VCAlertClose @click="visible = false" />
    </VCAlert>
</template>
```

For an animated dismiss, wrap with [`<VCCollapse>`](/components/collapse) (see the next section).

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

The click handler flips `open` on `<VCCollapse>`, Reka's `Presence` plays the `accordion-up` animation, and the alert unmounts after `animationend`. Because `<VCAlert>` is purely presentational it stays mounted (and rendered) throughout the close animation — Collapse owns the unmount cascade.

## Compound API

| Component | Element default | Role |
|---|---|---|
| `VCAlert` | `<div role="alert\|status">` | Outer container; provides theme + color context |
| `VCAlertTitle` | `<h4>` (configurable `as`) | Heading text |
| `VCAlertDescription` | `<div>` | Body text |
| `VCAlertClose` | `<button>` | Styled close button — emits `click` only (consumer owns visibility) |

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
| `color` | `'primary' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` | `undefined` | Folded into `themeVariant`; auto-resolves the icon + ARIA role for `info/success/warning/error`. `primary` and `neutral` use no preset icon by default (pass `:icon` explicitly to render one). |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `undefined` | Folded into `themeVariant`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `undefined` | Folded into `themeVariant`. |
| `icon` | `string` | `undefined` (preset default for `color`) | Iconify name. Pass `''` to suppress. |
| `role` | `string` | derived from `color` | ARIA role override. |
| `as` | `string` | `'div'` | HTML tag to render. |

`<VCAlert>` is presentational — wrap with `v-if` (instant dismissal) or `<VCCollapse v-model:open>` (animated). No `v-model:open` on the alert itself.

### `<VCAlertClose>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `boolean` | `false` | Force corner-X presentation. Slot-presence smart default decides otherwise. |
| `as` | `string` | `'button'` | HTML tag to render. |

Emits a native `click` event on the underlying button — no extra side effects. Wire `@click` to your visibility ref.
