# Presence

Low-level **animation lifecycle** wrapper. `<VCPresence>` keeps its wrapped subtree mounted while `present` is `true`, and — when `present` flips to `false` — waits for any in-flight `data-state` CSS exit animation to finish before unmounting. It's a thin, vuecs-owned wrapper over [Reka UI](https://reka-ui.com/)'s `Presence` primitive.

```bash
npm install @vuecs/overlays
```

## When you need it

Almost never, directly. Every shipped overlay `*Content` part (`<VCModalContent>`, `<VCPopoverContent>`, `<VCTooltipContent>`, the menu contents, `<VCToast>`) already wraps `Presence` internally, so their theme's exit-state classes play on close with **no extra wiring**.

Reach for `<VCPresence>` only when you're animating a **custom element that isn't a Reka overlay** — e.g. an inline expanding panel, a bespoke drawer — and want the same "delay unmount until the exit animation ends" behaviour.

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `present` | `boolean` | *(required)* | Whether the wrapped subtree is mounted. Toggle it to trigger enter / exit animations. |
| `forceMount` | `boolean` | `false` | Keep the subtree mounted regardless of `present` (debug / programmatic transition control). |

**Default slot** receives `{ present }` so you can bind state-driven attributes/classes on your element.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCPresence } from '@vuecs/overlays';

const open = ref(false);
</script>

<template>
    <button @click="open = !open">Toggle</button>

    <VCPresence :present="open" v-slot="{ present }">
        <div
            class="panel"
            :data-state="present ? 'open' : 'closed'"
        >
            Content that animates out before it unmounts.
        </div>
    </VCPresence>
</template>

<style>
.panel[data-state='open']  { animation: fade-in 150ms ease-out; }
.panel[data-state='closed'] { animation: fade-out 150ms ease-in; }
@keyframes fade-in  { from { opacity: 0 } to { opacity: 1 } }
@keyframes fade-out { from { opacity: 1 } to { opacity: 0 } }
</style>
```

`<VCPresence>` reads the element's computed `animation-name` when `present` becomes `false`; if an exit animation is defined it suspends the unmount until `animationend`, then removes the element. With no animation defined it unmounts immediately.

> `<VCPresence>` wraps Reka's `Presence` without re-exporting it — the prop shape (`VCPresenceProps`) is vuecs-owned, so you depend on `@vuecs/overlays`, not `reka-ui`.
