# Toast

Transient notifications fired imperatively from anywhere in your app via a shared queue. Built on [Reka UI](https://reka-ui.com/)'s Toast primitives.

```bash
npm install @vuecs/overlays
```

<Playground name="toast" component="VCToast">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCToastProvider,
    VCToaster,
    useToast,
} from '@vuecs/overlays';

const toast = useToast();

function notify() {
    toast.add({
        title: 'Saved',
        description: 'Your changes were saved.',
        color: 'success',
    });
}
</script>

<template>
    <VCToastProvider>
        <button type="button" @click="notify">Show toast</button>
        <VCToaster position="top-right" />
    </VCToastProvider>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Imperative API: `useToast()`

`useToast()` returns a shared, module-level queue. Every call site reads from the same `entries` ref, so a notification fired from a Pinia store, an axios interceptor, or a deep component lands in the same viewport.

```ts
import { useToast } from '@vuecs/overlays';

const toast = useToast();

const id = toast.add({
    title: 'Upload complete',
    description: 'roadmap.pdf has been uploaded.',
    color: 'success',
});

// Optionally dismiss later
toast.dismiss(id);

// Mutate while open
toast.update(id, { description: 'roadmap-v2.pdf' });

// Drop everything
toast.clear();
```

| Method | Signature | Notes |
|---|---|---|
| `add(entry)` | `(entry: ToastEntryInput) => string` | Returns the toast's id. Auto-generated when not provided. |
| `dismiss(id)` | `(id: string) => void` | Removes the toast from the queue and fires its `onDismiss`. |
| `update(id, patch)` | `(id: string, patch: Partial<Omit<ToastEntry, 'id'>>) => void` | Immutable patch — replaces the entry with `{ ...entry, ...patch }`. `id` is excluded from the patch shape (use `dismiss` + `add` to re-key an entry). |
| `clear()` | `() => void` | Dismisses every queued entry. |

```ts
import type { Component, VNode } from 'vue';
import type { UseToastReturn } from '@vuecs/overlays';

type ToastRenderFn = () => VNode | VNode[] | string;

type ToastEntryInput = {
    id?: string;
    /** Heading text — accepts a string OR `() => h(...)` for inline rich content. */
    title?: string | ToastRenderFn;
    /** Body text — accepts a string OR `() => h(...)` for inline rich content. */
    description?: string | ToastRenderFn;
    color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
    variant?: 'solid' | 'soft' | 'outline';
    /** Auto-dismiss timeout (ms). `0` or `Infinity` disables auto-dismiss (persistent toast). */
    duration?: number;
    /**
     * Action button(s). Either the structured `{ label, onClick }` shape
     * (renders one `<VCToastAction>` button) OR a render fn for fully-custom
     * action UI (multiple buttons, inline link, styled component). The
     * render fn receives `(id, toast)` so custom buttons can dismiss /
     * update / chain without closure capture.
     */
    action?:
        | { label: string; onClick: (id: string, toast: UseToastReturn) => void }
        | ((id: string, toast: UseToastReturn) => VNode | VNode[] | string);
    /** When `false`, hides the close button. Defaults to `true`. */
    closable?: boolean;
    /**
     * Per-entry full custom render. Replaces the canonical layout for THIS
     * toast only. Receives `{ entry, dismiss }` as props plus any extra
     * `componentProps`. Prefer plain `title` / `description` (with render-fn
     * flavour) when the canonical layout fits — `component` is the escape hatch.
     */
    component?: Component;
    componentProps?: Record<string, unknown>;
    /** Fires when the toast is removed for any reason. */
    onDismiss?: (id: string, toast: UseToastReturn) => void;
};
```

### Action / dismiss callbacks receive `(id, toast)`

Both `action.onClick` and `onDismiss` are called with the toast's `id`
plus the shared queue API — no closure capture needed:

```ts
toast.add({
    title: 'Item moved to trash',
    action: {
        label: 'Undo',
        onClick: (id, t) => {
            t.dismiss(id);
            t.add({ title: 'Restored', color: 'success' });
        },
    },
});
```

### Render-fn title / description (inline rich content)

For inline links, formatted text, or icons inside the title or body,
pass a render fn instead of a string:

```ts
import { h } from 'vue';

toast.add({
    title: () => h('span', [
        'Released ', h('code', 'v2.1.0'),
    ]),
    description: () => h('span', [
        'See the ',
        h('a', { href: '/changelog' }, 'changelog'),
        ' for details.',
    ]),
});
```

### Custom action UI (multiple buttons, links, …)

When the single `{ label, onClick }` shape isn't enough — e.g. "Retry"
+ "Dismiss" side-by-side on a network-error toast — pass a render fn
to `action`. It receives the same `(id, toast)` payload as the
structured `onClick`:

```ts
import { h } from 'vue';

toast.add({
    title: 'Network error',
    description: 'Failed to fetch /api/users.',
    color: 'error',
    duration: Infinity,
    action: (id, t) => h('div', { style: 'display: flex; gap: 0.5rem;' }, [
        h('button', { onClick: () => retry() }, 'Retry'),
        h('button', { onClick: () => t.dismiss(id) }, 'Dismiss'),
    ]),
});
```

### Per-entry custom component

When the canonical layout doesn't fit (e.g. a progress toast with a
`<VCProgress>` bar), pass a component that receives `entry` + `dismiss`
as props:

```ts
import { defineComponent, h } from 'vue';

const ProgressToast = defineComponent({
    props: { entry: Object, dismiss: Function, progress: Number },
    setup(props) {
        return () => h('div', [
            h('strong', 'Uploading...'),
            h('progress', { value: props.progress, max: 100 }),
        ]);
    },
});

const id = toast.add({
    component: ProgressToast,
    componentProps: { progress: 0 },
    duration: Infinity,
    closable: false,
});
// Later — mutate progress via update():
toast.update(id, { componentProps: { progress: 50 } });
```

The component renders inside the standard `<VCToast>` wrapper, so it
inherits theme variants (`color`, `variant`), animation hooks, and
auto-dismiss timing.

## Compound API

For full control over per-toast rendering (custom layouts, icons in titles, swap actions for inline buttons), use the compound parts directly via `<VCToaster>`'s default slot:

```vue
<script setup lang="ts">
import {
    VCToast,
    VCToastAction,
    VCToastClose,
    VCToastDescription,
    VCToastProvider,
    VCToastTitle,
    VCToaster,
} from '@vuecs/overlays';
</script>

<template>
    <VCToastProvider>
        <VCToaster position="top-right">
            <template #default="{ entry, dismiss, classes }">
                <VCToast :color="entry.color" :duration="entry.duration">
                    <div :class="classes.body">
                        <VCToastTitle v-if="entry.title">{{ entry.title }}</VCToastTitle>
                        <VCToastDescription v-if="entry.description">
                            {{ entry.description }}
                        </VCToastDescription>
                    </div>
                    <VCToastClose />
                </VCToast>
            </template>
        </VCToaster>
    </VCToastProvider>
</template>
```

| Component | Wraps | Notes |
|---|---|---|
| `VCToastProvider` | `ToastProvider` | App-level config (duration, swipe direction). Wrap once near the app root. |
| `VCToaster` | `ToastViewport` | Renders the queued entries. Default slot per entry. |
| `VCToast` | `ToastRoot` | One toast instance. Carries `color` / `variant` / `duration`. |
| `VCToastTitle` | `ToastTitle` | |
| `VCToastDescription` | `ToastDescription` | |
| `VCToastAction` | `ToastAction` | Requires `altText` (read by screen readers when auto-dismissed). |
| `VCToastClose` | `ToastClose` | Slot-presence smart default: slotless → corner-X icon; with text → labelled close button. |

## Theme keys

| Key | Slots | Notes |
|---|---|---|
| `toastViewport` | `root` | Container with position variant (`top-right` default; six positions total). |
| `toast` | `root`, `icon`, `body`, `close`, `closeIcon` | Color × variant matrix on `root`. Same six semantic colors as Badge. |
| `toastTitle` | `root` | |
| `toastDescription` | `root` | |
| `toastAction` | `root` | |

## Accessibility

Provided by Reka:
- ARIA `role="status"` (or `"alert"` for `error` color) with `aria-live="polite"`/`"assertive"` so screen readers announce new toasts
- Hover/focus pauses the auto-dismiss timer
- `F8` keyboard shortcut (default) focuses the viewport so screen-reader users can review recent toasts
- Swipe-to-dismiss on touch devices

## Animations

Toasts use `data-state="open|closed"` plus `data-swipe="move|cancel|end"` for swipe gestures. Both themes ship enter and exit animations (slide-in from the right by default, plus opacity fade) via `@vuecs/design`'s vanilla-CSS port of [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css). Tailwind theme gates animations via `data-[state=open]:` / `data-[state=closed]:` variants; BS5 and Bulma themes use the dual-state helper class `vc-toast-anim`. Reka's `ToastRoot` wraps with `Presence` so exit animations play before unmount. `prefers-reduced-motion: reduce` disables every animation.

## API Reference

### `<VCToastProvider>`

App-level configuration. Wrap once near the app root. Wraps `ToastProvider`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `duration` | `number` | `5000` | Default auto-dismiss timeout in ms. Per-toast `duration` overrides. |
| `label` | `string` | `'Notification'` | Label announced by screen readers when a toast renders. |
| `swipeDirection` | `'up' \| 'down' \| 'left' \| 'right'` | `'right'` | Direction the user swipes to dismiss. |
| `swipeThreshold` | `number` | `50` | Pixels swiped before dismissal is registered. |

### `<VCToaster>`

The toast viewport — renders the shared `useToast()` queue. Wraps `ToastViewport`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `'top-right' \| 'top-left' \| 'top-center' \| 'bottom-right' \| 'bottom-left' \| 'bottom-center'` | `'top-right'` | Where the toast stack pins on the screen. |
| `hotkey` | `string[]` | `['F8']` (Reka default) | Keyboard shortcut that focuses the viewport. |
| `label` | `string` | undefined | Override the provider's screen-reader label. |
| `as` | `string` | `'ol'` | HTML tag to render. |
| `themeClass` | `Partial<ToastViewportThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

Default slot receives `{ entry, dismiss, classes }` for per-toast custom rendering — `classes` is the resolved `toast` theme so custom layouts can reuse the active theme's class strings. When the slot is omitted, `<VCToaster>` renders the canonical layout (title + description + action + close).

### `<VCToast>`

A single toast. Wraps `ToastRoot`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled open state. Leave undefined to let Reka manage open/close lifecycle from `defaultOpen` + the auto-dismiss timer. |
| `defaultOpen` | `boolean` | `true` | Initial open state when `open` is undefined. |
| `duration` | `number \| undefined` | `undefined` | Per-toast auto-dismiss; overrides the provider. `0` or `Infinity` disables (persistent). |
| `type` | `'foreground' \| 'background'` | `'background'` | `foreground` reserves announcements (use sparingly for time-critical alerts). |
| `color` | `'primary' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `undefined` | Folded into `themeVariant`. |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `undefined` | Folded into `themeVariant`. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired on open/close. |
| `escapeKeyDown` | `KeyboardEvent` | Fired when Escape is pressed while the toast has focus. |
| `pause` | `void` | Fired when the auto-dismiss timer pauses (hover / focus). |
| `resume` | `void` | Fired when the timer resumes. |
| `swipeStart` | `SwipeEvent` | Fired on swipe gesture start. |
| `swipeMove` | `SwipeEvent` | Fired during swipe. |
| `swipeCancel` | `SwipeEvent` | Fired when the swipe is cancelled. |
| `swipeEnd` | `SwipeEvent` | Fired when the swipe completes. |

### `<VCToastAction>`

Action button rendered inside a toast. Wraps `ToastAction`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `altText` | `string` | required | Short text describing the action — announced by screen readers when the toast auto-dismisses. Mirror your visible label. |
| `as` | `string` | `'button'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |

### `<VCToastClose>`

Close button. Wraps `ToastClose`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `boolean` | `false` | Force the corner-X icon presentation even with custom slot content. |
| `as` | `string` | `'button'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |

Slot-presence smart default: a slotless `<VCToastClose />` renders the `closeIcon` slot (corner-X); content children render the `close` slot (labelled button). Force the icon form via `<VCToastClose icon>...</VCToastClose>`.
