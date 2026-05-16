# Collapse

Toggleable disclosure pane wrapping Reka's [Collapsible primitive](https://reka-ui.com/docs/components/collapsible). Three parts: outer root, trigger, content. Auto-animated height transition + `aria-expanded` / `aria-controls` wiring out of the box.

```bash
npm install @vuecs/elements
```

<Playground name="collapse" component="VCCollapse">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCCollapse,
    VCCollapseContent,
    VCCollapseTrigger,
} from '@vuecs/elements';
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
    <VCCollapse v-model:open="open">
        <VCCollapseTrigger>
            {{ open ? 'Hide details' : 'Show details' }}
        </VCCollapseTrigger>
        <VCCollapseContent>
            <p>Reka handles the height transition + a11y wiring.</p>
        </VCCollapseContent>
    </VCCollapse>
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

## Compound API

| Component | Reka primitive | Default tag | Role |
|---|---|---|---|
| `VCCollapse` | `CollapsibleRoot` | `<div>` | Outer container; owns `v-model:open` state |
| `VCCollapseTrigger` | `CollapsibleTrigger` | `<button>` | Toggle button — clicks + Enter / Space toggle `open` |
| `VCCollapseContent` | `CollapsibleContent` | `<div>` | Collapsing pane; auto-animated via Reka's `Presence` |

## Chevron variant

`<VCCollapseTrigger>` auto-renders a rotating chevron icon when an active icon preset is installed (e.g. `@vuecs/icons-lucide` ships `'lucide:chevron-down'`). The chevron rotates 180° on open via the `[data-state="open"] .vc-collapse-chevron` structural rule.

Hide the chevron via `:theme-variant`:

```vue
<VCCollapseTrigger :theme-variant="{ chevron: 'none' }">
    Custom trigger content
</VCCollapseTrigger>
```

## Composition patterns

### Card with collapsible body (FAQ)

```vue
<VCCollapse>
    <VCCard>
        <VCCardHeader>
            <VCCollapseTrigger as-child>
                <button class="w-full text-left">
                    <VCCardTitle>How do I install vuecs?</VCCardTitle>
                </button>
            </VCCollapseTrigger>
        </VCCardHeader>
        <VCCollapseContent>
            <VCCardBody>Run <code>npm install @vuecs/core</code> ...</VCCardBody>
        </VCCollapseContent>
    </VCCard>
</VCCollapse>
```

`as-child` on `<VCCollapseTrigger>` passes the trigger behavior to your own child element — useful when the trigger needs custom layout (card header, table row, etc.).

### Alert dismiss-with-collapse animation

```vue
<script setup lang="ts">
const visible = ref(true);
</script>

<template>
    <VCCollapse v-model:open="visible">
        <VCCollapseContent>
            <VCAlert color="error">
                <VCAlertTitle>Save failed</VCAlertTitle>
                <VCAlertClose @click="visible = false" />
            </VCAlert>
        </VCCollapseContent>
    </VCCollapse>
</template>
```

Reka's `Presence` waits for the `accordion-up` animation to finish before unmounting the alert. Without `<VCCollapse>`, the alert disappears instantly.

## Theme keys

| Key | Slots | Notes |
|---|---|---|
| `collapse` | `root` | |
| `collapseTrigger` | `root`, `chevron` | `chevron: 'auto' \| 'none'` variant |
| `collapseContent` | `root` | Theme classes animate via `--reka-collapsible-content-height` |

## Animations

`<VCCollapseContent>` uses `data-state="open|closed"` driven by Reka. Both themes ship `accordion-down` / `accordion-up` keyframes via `@vuecs/design`'s vanilla-CSS port of [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css), interpolating from `0 → --reka-collapsible-content-height` (and reverse). Tailwind theme gates via `data-[state=open]:animate-accordion-down`; BS5 and Bulma themes use the dual-state helper class `vc-collapse-anim`. `prefers-reduced-motion: reduce` disables every animation.

## API Reference

### `<VCCollapse>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled state; bind with `v-model:open`. Leave undefined for uncontrolled. |
| `defaultOpen` | `boolean` | `false` | Initial state when `open` is undefined. |
| `disabled` | `boolean` | `false` | Disable interaction (trigger ignores clicks). |
| `unmountOnHide` | `boolean` | `true` | Unmount the content element when closed. Set to `false` to preserve state (form inputs, animations) across cycles. |
| `as` | `string` | `'div'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Pass through to consumer's child element. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired when the open state changes. |

### `<VCCollapseTrigger>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `chevron` | `'auto' \| 'none'` | `'auto'` | Show / hide the auto-rendered chevron indicator. |
| `as` | `string` | `'button'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Pass trigger behavior to a custom child element. |

### `<VCCollapseContent>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `forceMount` | `boolean` | `false` | Keep mounted while closed. Useful when you need Vue-level control of the unmount cascade. |
| `as` | `string` | `'div'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Pass content behavior to a custom child element. |
