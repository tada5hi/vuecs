# Modal

Accessible modal dialog built on [Reka UI](https://reka-ui.com/)'s Dialog primitives. Includes a `useModal()` composable with **view-stack** support — push/pop views inside one modal instance instead of stacking dialogs.

```bash
npm install @vuecs/overlays
```

## Compound API

`<VCModal>` is a compound component. Each part is a thin wrapper over the matching Reka Dialog primitive, themed via `useComponentTheme('modal', ...)`:

| Component | Wraps | Purpose |
|---|---|---|
| `VCModal` | `DialogRoot` | Holds open state. v-models `open`. |
| `VCModalTrigger` | `DialogTrigger` | Button that toggles open. |
| `VCModalContent` | `DialogPortal` + `DialogOverlay` + `DialogContent` | Backdrop + focused panel. Use `inline` to skip the portal, `hideOverlay` to skip the backdrop. |
| `VCModalTitle` | `DialogTitle` | aria-labelledby target. |
| `VCModalDescription` | `DialogDescription` | aria-describedby target. |
| `VCModalClose` | `DialogClose` | Button that closes. Default content is `×` (auto `aria-label="Close"` when no slot). |

<Demo name="modal" component="VCModal">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCModal,
    VCModalClose,
    VCModalContent,
    VCModalDescription,
    VCModalTitle,
    VCModalTrigger,
} from '@vuecs/overlays';
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
    <VCModal v-model:open="open">
        <VCModalTrigger>Open dialog</VCModalTrigger>
        <VCModalContent>
            <!-- Renders the default × in the top-right (the position
                 styled by the theme-tailwind `close` slot). -->
            <VCModalClose />
            <VCModalTitle>Confirm action</VCModalTitle>
            <VCModalDescription>
                This will permanently delete the record.
            </VCModalDescription>
            <div class="flex justify-end gap-2">
                <button @click="open = false">Cancel</button>
                <button @click="open = false">Confirm</button>
            </div>
        </VCModalContent>
    </VCModal>
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

::: tip When to use `<VCModalClose>` vs a plain `<button>`
The theme-tailwind `close` slot is styled for the **top-right corner ×**
(`absolute right-3 top-3 h-7 w-7`). Use `<VCModalClose />` (no children) for
that position. For Cancel/Confirm-style buttons elsewhere in the dialog,
use plain `<button @click="open = false">` — Vue's `class` attribute merges
with the theme's classes rather than replacing them, so the corner-positioning
leaks if you reuse `<VCModalClose>` in the footer. To use `<VCModalClose>`
outside the corner (e.g. for a labelled Cancel button), pass a full theme
override via `:theme-class="{ close: 'rounded-md border ...' }"`.
:::

## `useModal()` composable

For flows like "list view → detail view → back" that would otherwise stack modals or fight z-index, `useModal()` exposes a view-stack and Escape/backdrop handling that pops the stack first, then closes when the stack is empty.

```ts
import { useModal, type ModalView } from '@vuecs/overlays';
import ListView from './ListView.vue';
import DetailView from './DetailView.vue';

const modal = useModal({
    onClose: () => {
        // refetch / reset / cleanup after the modal fully closes
    },
});

modal.open({ component: ListView });
//        ↳ depth = 1, currentView = ListView

modal.pushView({ component: DetailView, props: { id: 42 } });
//        ↳ depth = 2, currentView = DetailView

modal.popView();
//        ↳ depth = 1, currentView = ListView again

modal.popView();
//        ↳ depth = 0, modal closes, onClose() fires
```

### API

```ts
type UseModalOptions = {
    initialView?: ModalView;
    onClose?: () => void;
};

type ModalView = {
    key?: string | number | symbol;
    component: Component;
    props?: Record<string, unknown>;
    title?: string;
};

type UseModalReturn = {
    isOpen: Ref<boolean>;
    currentView: ComputedRef<ModalView | undefined>;
    hasHistory: ComputedRef<boolean>;
    depth: ComputedRef<number>;

    open: (view?: ModalView) => void;
    close: () => void;
    pushView: (view: ModalView) => void;
    popView: () => void;
    replaceView: (view: ModalView) => void;
    setOpen: (next: boolean) => void;
};
```

### Wiring with the compound API

<Demo name="modal-view-stack" component="VCModal">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCModal, VCModalContent, VCModalTitle, useModal } from '@vuecs/overlays';
import ListView from './ListView.vue';
import DetailView from './DetailView.vue';

const modal = useModal();

const showItem = (id: number) => {
    modal.pushView({ component: DetailView, props: { id }, title: `Item #${id}` });
};
</script>

<template>
    <button @click="modal.open({ component: ListView, title: 'List' })">
        Open list
    </button>

    <VCModal :open="modal.isOpen.value" @update:open="modal.setOpen">
        <VCModalContent>
            <header class="flex items-center gap-2">
                <button v-if="modal.hasHistory.value" @click="modal.popView()">←</button>
                <VCModalTitle>{{ modal.currentView.value?.title }}</VCModalTitle>
            </header>
            <component
                :is="modal.currentView.value.component"
                v-if="modal.currentView.value"
                v-bind="modal.currentView.value.props"
                @select="showItem"
            />
        </VCModalContent>
    </VCModal>
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

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `overlay` | `vc-modal-overlay` | Backdrop layer behind the dialog. |
| `content` | `vc-modal-content` | Focused panel. |
| `header` | `vc-modal-header` | Header layout container (consumer-composed). |
| `title` | `vc-modal-title` | `DialogTitle` element. |
| `description` | `vc-modal-description` | `DialogDescription` element. |
| `body` | `vc-modal-body` | Body layout container (consumer-composed). |
| `footer` | `vc-modal-footer` | Footer layout container (consumer-composed). |
| `trigger` | `vc-modal-trigger` | Trigger button. |
| `close` | `vc-modal-close` | Close button. |
| `back` | `vc-modal-back` | Optional view-stack back button. |

`@vuecs/theme-tailwind` ships pre-built styling for every key with light/dark mode and `data-state="open|closed"` animation hooks.

## Accessibility

The Reka Dialog primitives provide:

- **Focus trap** — focus stays inside `<VCModalContent>` while open and restores to the trigger on close.
- **Scroll lock** — body scroll is disabled while a modal is open (`modal: true` mode).
- **Escape key** — closes the modal. Combine with `useModal()`'s `popView()` for view-stack flows by intercepting `update:open` to call `popView` while `hasHistory` is true.
- **ARIA** — `role="dialog"`, `aria-modal`, `aria-labelledby` (linked to `<VCModalTitle>`), `aria-describedby` (linked to `<VCModalDescription>`).

## Animations

Both `theme-tailwind` and `theme-bootstrap-v5` ship **enter and exit animations** out of the box (fade + zoom-95 on `<VCModalContent>`, fade-only on the overlay). Animation classes resolve through `@vuecs/design`'s `animations.css` — a vanilla-CSS port of [`tw-animate-css`](https://github.com/Wombosvideo/tw-animate-css), so the same class names work for any theme.

How the per-state gating works in each theme:

- `theme-tailwind` uses Tailwind's `data-[state=open]:animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out fade-out-0 zoom-out-95` composition — Tailwind compiles each variant to a selector scoped to the matching `data-state`.
- `theme-bootstrap-v5` uses vuecs's dual-state helper classes (`vc-overlay-anim`, `vc-overlay-fade-anim`) which package the same gating into a single class. Required because BS5 theme strings can't carry `data-[state=]:` attribute selectors.

Reka's `DialogContent` already wraps with `Presence` internally — it reads the element's computed `animation-name` when `data-state` flips to `closed`, suspends unmount, and waits for `animationend` before removing the element. So exit animations actually play; nothing extra to wire on the vuecs side.

Per-instance overrides (e.g. opt out of motion entirely):

```vue
<VCModalContent :theme-class="{ content: '', overlay: '' }">
    ...
</VCModalContent>
```

The `prefers-reduced-motion: reduce` CSS media query also disables every animation in `animations.css` automatically.

## API Reference

### `<VCModal>`

Holds the open/closed state and provides context to every nested part. Wraps Reka's `DialogRoot`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean \| undefined` | `undefined` | Controlled open state. Use `v-model:open` or pair `:open` with `@update:open`. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage (when `open` is omitted). |
| `modal` | `boolean` | `true` | Trap focus inside the dialog and disable interaction with content outside. |

| Emit | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | Fired when the open state changes (Escape, click-outside, `<VCModalClose>` click). |

### `<VCModalTrigger>`

Button that toggles the modal open. Composes `DialogTrigger` over the configured `as` element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'button'` | HTML tag to render. Set to `'div'`, `'span'`, etc. when you need non-button semantics. |
| `asChild` | `boolean` | `false` | Render the trigger via the default slot's child element instead of `as`. The slot's element receives the trigger's listeners + ARIA. |
| `themeClass` | `Partial<ModalThemeClasses>` | `undefined` | Per-instance theme override (slot keys → class strings). |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCModalContent>`

Floating dialog panel. Bundles `DialogPortal` + `DialogOverlay` + `DialogContent` so consumers don't compose them manually.

| Prop | Type | Default | Description |
|---|---|---|---|
| `inline` | `boolean` | `false` | Skip the `DialogPortal` and render where the component sits in the DOM. Useful for testing or custom mounting. |
| `hideOverlay` | `boolean` | `false` | Skip the backdrop element. |
| `themeClass` | `Partial<ModalThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

Extra `DialogContent` props (`onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside`, etc.) pass through via `attrs`.

### `<VCModalTitle>`

Accessible dialog title, linked to the panel via `aria-labelledby`. Wraps `DialogTitle`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `themeClass` | `Partial<ModalThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCModalDescription>`

Accessible description, linked via `aria-describedby`. Wraps `DialogDescription`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `themeClass` | `Partial<ModalThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `<VCModalClose>`

Button that dismisses the modal. Wraps `DialogClose`. Default slot content is `×` when no children are provided.

When no slot content is supplied, `<VCModalClose>` auto-applies `aria-label="Close"` so screen readers don't announce the bare `×` glyph as "multiplication sign". Pass an explicit `aria-label` via attrs to override, or supply visible text content (e.g. `<VCModalClose>Close</VCModalClose>`) — visible text takes precedence and the auto-label is dropped.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'button'` | HTML tag to render. |
| `asChild` | `boolean` | `false` | Render via the default slot's child element. |
| `themeClass` | `Partial<ModalThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

### `useModal(options?)`

Reactive view-stack composable. See [`useModal()` composable](#usemodal-composable) above for usage.

| Option | Type | Default | Description |
|---|---|---|---|
| `initialView` | `ModalView` | `undefined` | Pushed onto the stack the first time `open()` is called without a `view` argument. |
| `onClose` | `() => void` | `undefined` | Called after the modal closes (after the stack is cleared). |

The return shape (`isOpen` / `currentView` / `hasHistory` / `depth` / `open` / `close` / `pushView` / `popView` / `replaceView` / `setOpen`) is documented in the API block above.

::: tip Header / body / footer
`header`, `body`, and `footer` are theme keys, not components — vuecs doesn't ship `<VCModalHeader>` etc. Compose them as plain `<div>` / `<header>` / `<footer>` and apply the theme classes manually if you want the layout helpers from `theme-tailwind`. The theme key list above shows the default classes.
:::

## Status

`@vuecs/overlays` ships Modal alongside Popover, Tooltip, DropdownMenu, and ContextMenu — all on the same compound + `useComponentTheme` shape. See the [Reka UI adoption roadmap](https://github.com/tada5hi/vuecs/blob/master/.agents/plans/009-reka-ui-adoption-roadmap.md) for the broader plan.
