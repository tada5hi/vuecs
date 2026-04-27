# Modal

Accessible modal dialog built on [Reka UI](https://reka-ui.com/)'s Dialog primitives. Includes a `useModal()` composable with **view-stack** support — push/pop views inside one modal instance instead of stacking dialogs.

```bash
npm install @vuecs/overlays @vuecs/core reka-ui
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
| `VCModalClose` | `DialogClose` | Button that closes. Default content is `×`. |

```vue
<script setup lang="ts">
import {
    VCModal,
    VCModalContent,
    VCModalClose,
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
            <VCModalTitle>Confirm action</VCModalTitle>
            <VCModalDescription>
                This will permanently delete the record.
            </VCModalDescription>
            <div class="flex justify-end gap-2">
                <VCModalClose>Cancel</VCModalClose>
                <button @click="open = false">Confirm</button>
            </div>
        </VCModalContent>
    </VCModal>
</template>
```

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

type ModalView<P = Record<string, any>> = {
    key?: string | number | symbol;
    component: Component;
    props?: P;
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

```vue
<script setup lang="ts">
import { VCModal, VCModalContent, VCModalTitle, useModal } from '@vuecs/overlays';
import { h } from 'vue';
import ListView from './ListView.vue';
import DetailView from './DetailView.vue';

const modal = useModal();

const showItem = (id: number) => {
    modal.pushView({ component: DetailView, props: { id }, title: `Item #${id}` });
};
</script>

<template>
    <button @click="modal.open({ component: ListView })">Open list</button>

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

## Status

`@vuecs/overlays` is the first piece of Phase 3 of the [Reka UI adoption roadmap](https://github.com/tada5hi/vuecs/blob/master/.agents/plans/reka-ui-adoption-roadmap.md). `VCPopover`, `VCTooltip`, `VCDropdownMenu`, and `VCContextMenu` will follow on the same compound + `useComponentTheme` shape.
